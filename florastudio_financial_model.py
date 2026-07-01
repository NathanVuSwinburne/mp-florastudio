"""FloraStudio 24-month profitability and pricing model.

Edit INPUTS and SCENARIOS below, then run:
    python florastudio_financial_model.py

No third-party packages are required. Outputs are printed and CSV files are
written to outputs/florastudio_financial_model/. All currency is USD, pre-tax.
"""

from __future__ import annotations

import csv
import math
from copy import deepcopy
from dataclasses import dataclass, asdict
from pathlib import Path


# =============================================================================
# INPUTS — EDIT NUMBERS HERE. "GUESS" means replace with observed data.
# =============================================================================

INPUTS = {
    # Pricing / packaging (GUESS: validate with customer interviews and A/B tests)
    "plus_monthly_price": 9.99,
    "plus_annual_price": 79.99,
    "pro_monthly_price": 17.99,
    "pro_annual_price": 149.99,
    "plus_share_of_paid": 0.85,
    "annual_share_of_paid": 0.40,
    "payment_fee_rate": 0.03,
    "free_trial_days": 7,
    "free_health_check_cap": 3,
    # Usage (GUESS: instrument actual checks and photo sizes)
    "free_photos_per_user_month": 1.5,
    "plus_photos_per_user_month": 8.0,
    "pro_photos_per_user_month": 15.0,
    "photo_size_mb": 1.0,
    "photo_retention_months": 12,
    # AI / storage COGS (GUESS: replace with vendor invoices and model telemetry)
    "vision_llm_cost_per_call": 0.008,
    "fallback_rate_launch": 0.40,
    "fallback_rate_month_12": 0.10,
    "fallback_rate_floor": 0.06,
    "storage_cost_per_gb_month": 0.023,
    "backend_variable_cost_per_active_user": 0.02,
    "label_fraction_of_escalations": 0.08,
    "label_cost_per_photo": 0.12,
    # Go-to-market / growth (GUESS: replace with cohort and channel data)
    "starting_free_users": 1_000,
    "new_free_users_month_1": 1_500,
    "monthly_new_user_growth": 0.10,
    "free_user_monthly_churn": 0.08,
    "base_freemium_conversion": 0.045,
    "base_paid_monthly_churn": 0.045,
    "base_cac_per_new_paid_user": 32.0,
    # Fixed costs (GUESS: lean operating plan; excludes CAC and payment fees)
    "fixed_team_cost_monthly": 25_000.0,
    "fixed_hosting_monthly": 1_500.0,
    "fixed_tools_admin_monthly": 1_000.0,
    "one_off_model_training_month_1": 12_000.0,
}


SCENARIOS = {
    "Conservative": {
        "conversion": 0.025, "paid_churn": 0.070, "cac": 48.0,
        "fallback_launch": 0.50, "fallback_m12": 0.20, "fallback_floor": 0.12,
        "new_user_growth": 0.06,
    },
    "Base": {
        "conversion": 0.045, "paid_churn": 0.045, "cac": 32.0,
        "fallback_launch": 0.40, "fallback_m12": 0.10, "fallback_floor": 0.06,
        "new_user_growth": 0.10,
    },
    "Optimistic": {
        "conversion": 0.070, "paid_churn": 0.028, "cac": 22.0,
        "fallback_launch": 0.30, "fallback_m12": 0.06, "fallback_floor": 0.03,
        "new_user_growth": 0.14,
    },
}


@dataclass
class Month:
    month: int
    fallback_rate: float
    new_free_users: float
    free_users: float
    new_paid_users: float
    paid_users: float
    revenue: float
    llm_cost: float
    storage_cost: float
    backend_cost: float
    labeling_cost: float
    payment_fees: float
    cogs: float
    gross_profit: float
    gross_margin: float
    fixed_costs: float
    cac_spend: float
    net_income: float
    cumulative_net: float


def effective_arpu(i: dict) -> float:
    """Weighted monthly recognized subscription revenue, net of tier/term mix."""
    plus = (1 - i["annual_share_of_paid"]) * i["plus_monthly_price"] + i["annual_share_of_paid"] * i["plus_annual_price"] / 12
    pro = (1 - i["annual_share_of_paid"]) * i["pro_monthly_price"] + i["annual_share_of_paid"] * i["pro_annual_price"] / 12
    return i["plus_share_of_paid"] * plus + (1 - i["plus_share_of_paid"]) * pro


def fallback_rate(month: int, launch: float, month12: float, floor: float) -> float:
    """Exponential data-flywheel decay, calibrated exactly to launch and month 12."""
    if launch <= floor or month12 <= floor:
        return max(floor, month12)
    decay = math.log((month12 - floor) / (launch - floor)) / 11
    return floor + (launch - floor) * math.exp(decay * (month - 1))


def run_scenario(name: str, s: dict, i: dict) -> list[Month]:
    free_users = float(i["starting_free_users"])
    paid_users = 0.0
    cumulative_net = 0.0
    stored_photo_cohorts: list[float] = []
    rows: list[Month] = []
    arpu = effective_arpu(i)
    fixed_recurring = i["fixed_team_cost_monthly"] + i["fixed_hosting_monthly"] + i["fixed_tools_admin_monthly"]

    for m in range(1, 25):
        new_free = i["new_free_users_month_1"] * (1 + s["new_user_growth"]) ** (m - 1)
        surviving_free = free_users * (1 - i["free_user_monthly_churn"])
        conversion_pool = surviving_free + new_free
        new_paid = conversion_pool * s["conversion"]
        free_users = conversion_pool - new_paid
        paid_users = paid_users * (1 - s["paid_churn"]) + new_paid

        fb = fallback_rate(m, s["fallback_launch"], s["fallback_m12"], s["fallback_floor"])
        avg_paid_photos = i["plus_share_of_paid"] * i["plus_photos_per_user_month"] + (1 - i["plus_share_of_paid"]) * i["pro_photos_per_user_month"]
        photos = free_users * i["free_photos_per_user_month"] + paid_users * avg_paid_photos
        escalations = photos * fb
        llm = escalations * i["vision_llm_cost_per_call"]
        labeling = escalations * i["label_fraction_of_escalations"] * i["label_cost_per_photo"]
        stored_photo_cohorts.append(photos)
        stored_photo_cohorts = stored_photo_cohorts[-int(i["photo_retention_months"]):]
        stored_gb = sum(stored_photo_cohorts) * i["photo_size_mb"] / 1024
        storage = stored_gb * i["storage_cost_per_gb_month"]
        backend = (free_users + paid_users) * i["backend_variable_cost_per_active_user"]
        revenue = paid_users * arpu
        fees = revenue * i["payment_fee_rate"]
        cogs = llm + labeling + storage + backend + fees
        gp = revenue - cogs
        gm = gp / revenue if revenue else 0.0
        fixed = fixed_recurring + (i["one_off_model_training_month_1"] if m == 1 else 0)
        cac_spend = new_paid * s["cac"]
        net = gp - fixed - cac_spend
        cumulative_net += net
        rows.append(Month(m, fb, new_free, free_users, new_paid, paid_users, revenue,
                          llm, storage, backend, labeling, fees, cogs, gp, gm,
                          fixed, cac_spend, net, cumulative_net))
    return rows


def unit_economics(s: dict, i: dict) -> dict:
    arpu = effective_arpu(i)
    mature_fb = s["fallback_floor"]
    avg_photos = i["plus_share_of_paid"] * i["plus_photos_per_user_month"] + (1 - i["plus_share_of_paid"]) * i["pro_photos_per_user_month"]
    variable = (avg_photos * mature_fb * i["vision_llm_cost_per_call"]
                + avg_photos * mature_fb * i["label_fraction_of_escalations"] * i["label_cost_per_photo"]
                + avg_photos * i["photo_size_mb"] / 1024 * i["storage_cost_per_gb_month"] * i["photo_retention_months"]
                + i["backend_variable_cost_per_active_user"] + arpu * i["payment_fee_rate"])
    contribution = arpu - variable
    gm = contribution / arpu
    ltv = contribution / s["paid_churn"]
    return {"ARPU": arpu, "Mature variable cost / paid user": variable,
            "Mature gross margin": gm, "LTV": ltv, "CAC": s["cac"],
            "LTV:CAC": ltv / s["cac"], "CAC payback months": s["cac"] / contribution}


def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def money(x: float) -> str:
    return f"${x:,.0f}"


def print_table(headers: list[str], rows: list[list[str]]) -> None:
    widths = [max(len(str(h)), *(len(str(r[n])) for r in rows)) for n, h in enumerate(headers)]
    print(" | ".join(str(h).ljust(widths[n]) for n, h in enumerate(headers)))
    print("-+-".join("-" * w for w in widths))
    for row in rows:
        print(" | ".join(str(v).ljust(widths[n]) for n, v in enumerate(row)))


def main() -> None:
    out = Path(__file__).resolve().parent / "outputs" / "florastudio_financial_model"
    results = {name: run_scenario(name, s, INPUTS) for name, s in SCENARIOS.items()}

    print("\nFLORASTUDIO PRICING RECOMMENDATION")
    print("Free: garden designer + 3 health checks/month; no longitudinal history.")
    print("Plus: $9.99/month or $79.99/year; unlimited* checks, history, reminders, shopping lists.")
    print("Pro: $17.99/month or $149.99/year; Plus features + multi-garden profiles, exports, priority advice.")
    print("*Fair-use guardrail recommended. Annual pricing is simple and creates a clear 33% saving.")
    print("Use a 7-day Plus trial after the first health check; retain the free cap to demonstrate value without open-ended subsidy.")

    print("\nASSUMPTIONS (all are editable at the top of this file; all are management guesses until validated)")
    print_table(["Input", "Value"], [[k, str(v)] for k, v in INPUTS.items()])

    print("\nUNIT ECONOMICS AT MATURITY")
    ue_rows = []
    for name, s in SCENARIOS.items():
        u = unit_economics(s, INPUTS)
        ue_rows.append([name, money(u["ARPU"]), f'{u["Mature gross margin"]:.1%}', money(u["LTV"]), money(u["CAC"]), f'{u["LTV:CAC"]:.1f}x', f'{u["CAC payback months"]:.1f}'])
    print_table(["Scenario", "ARPU/mo", "Mature GM", "LTV", "CAC", "LTV:CAC", "Payback mo"], ue_rows)

    print("\n24-MONTH P&L SUMMARY")
    pnl_summary = []
    for name, rows in results.items():
        revenue = sum(r.revenue for r in rows)
        cogs = sum(r.cogs for r in rows)
        gp = sum(r.gross_profit for r in rows)
        fixed = sum(r.fixed_costs for r in rows)
        cac = sum(r.cac_spend for r in rows)
        net = sum(r.net_income for r in rows)
        positive_month = next((r.month for r in rows if r.net_income > 0), None)
        pnl_summary.append([name, money(revenue), money(cogs), money(gp), money(fixed), money(cac), money(net), str(positive_month or ">24")])
        write_csv(out / f"pnl_{name.lower()}.csv", [asdict(r) for r in rows])
    print_table(["Scenario", "Revenue", "COGS", "Gross profit", "Fixed", "CAC spend", "Net", "Monthly CF+"], pnl_summary)

    base_rows = results["Base"]
    base_ue = unit_economics(SCENARIOS["Base"], INPUTS)
    maturity_contribution = base_ue["ARPU"] - base_ue["Mature variable cost / paid user"]
    recurring_fixed = INPUTS["fixed_team_cost_monthly"] + INPUTS["fixed_hosting_monthly"] + INPUTS["fixed_tools_admin_monthly"]
    breakeven_paid = recurring_fixed / maturity_contribution
    print(f"\nBASE BREAK-EVEN: ~{breakeven_paid:,.0f} paid users cover recurring fixed costs at mature unit economics.")
    print(f"Monthly cash flow first turns positive in month {next((r.month for r in base_rows if r.net_income > 0), '>24')} (CAC included).")
    print(f"Fallback decay: {base_rows[0].fallback_rate:.1%} launch → {base_rows[11].fallback_rate:.1%} month 12 → {base_rows[23].fallback_rate:.1%} month 24.")
    print(f"Blended gross margin: {base_rows[0].gross_margin:.1%} month 1 → {base_rows[11].gross_margin:.1%} month 12 → {base_rows[23].gross_margin:.1%} month 24.")

    # One-way sensitivity: change each key Base input while holding everything else fixed.
    sensitivity = []
    tests = {
        "Conversion": ("conversion", [0.030, 0.045, 0.060], "scenario"),
        "Paid churn": ("paid_churn", [0.065, 0.045, 0.030], "scenario"),
        "Fallback M12": ("fallback_m12", [0.20, 0.10, 0.05], "scenario"),
    }
    for driver, (key, values, _) in tests.items():
        for label, value in zip(["Downside", "Base", "Upside"], values):
            s = deepcopy(SCENARIOS["Base"])
            s[key] = value
            rows = run_scenario("Sensitivity", s, INPUTS)
            sensitivity.append({"driver": driver, "case": label, "value": value,
                                "month_24_net_income": rows[-1].net_income,
                                "cumulative_24m_net_income": sum(r.net_income for r in rows)})
    write_csv(out / "sensitivity.csv", sensitivity)
    print("\nSENSITIVITY — BASE CASE, ONE VARIABLE AT A TIME")
    print_table(["Driver", "Case", "Input", "M24 net", "24m cumulative net"],
                [[r["driver"], r["case"], f'{r["value"]:.1%}', money(r["month_24_net_income"]), money(r["cumulative_24m_net_income"])] for r in sensitivity])

    # Audit checks.
    checks = []
    for name, rows in results.items():
        checks += [
            (f"{name}: fallback non-increasing", all(rows[n].fallback_rate <= rows[n-1].fallback_rate + 1e-12 for n in range(1, len(rows)))),
            (f"{name}: gross profit = revenue - COGS", all(abs(r.gross_profit - (r.revenue-r.cogs)) < 0.01 for r in rows)),
            (f"{name}: net = GP - fixed - CAC", all(abs(r.net_income - (r.gross_profit-r.fixed_costs-r.cac_spend)) < 0.01 for r in rows)),
            (f"{name}: non-negative users", all(r.free_users >= 0 and r.paid_users >= 0 for r in rows)),
        ]
    write_csv(out / "assumptions.csv", [{"input": k, "value": v, "status": "GUESS — replace with actual data"} for k, v in INPUTS.items()])
    write_csv(out / "checks.csv", [{"check": c, "status": "PASS" if ok else "FAIL"} for c, ok in checks])
    if not all(ok for _, ok in checks):
        raise RuntimeError("Model audit failed; see checks.csv")

    print("\nPLAIN-ENGLISH SUMMARY")
    print("• Price: Plus $9.99/mo or $79.99/yr; Pro $17.99/mo or $149.99/yr; Free capped at 3 checks/mo.")
    print(f'• Expected mature Base gross margin: {base_ue["Mature gross margin"]:.1%}.')
    print(f'• Base LTV:CAC: {base_ue["LTV:CAC"]:.1f}x, with {base_ue["CAC payback months"]:.1f}-month payback.')
    print(f"• Break-even: ~{breakeven_paid:,.0f} paid users; monthly cash flow positive in month {next((r.month for r in base_rows if r.net_income > 0), '>24')}.")
    print("• Biggest risk: conversion/churn economics, not inference cost; validate retention and willingness-to-pay before scaling CAC.")
    print(f"\nCSV outputs written to: {out}")


if __name__ == "__main__":
    main()
