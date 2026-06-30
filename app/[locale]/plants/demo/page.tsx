import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/layout/page-shell";
import { PlantDetail } from "@/components/plants/plant-detail";
import { PLANTS_BY_ID, DEMO_PLANT_ID } from "@/lib/mock/plants";
import { localizePlant, type Translator } from "@/lib/i18n-content";

export async function generateMetadata() {
  const t = await getTranslations();
  return { title: t("metadata.plantDetail") };
}

export default async function PlantDetailPage() {
  const t = (await getTranslations()) as unknown as Translator;
  const plant = localizePlant(t, PLANTS_BY_ID[DEMO_PLANT_ID]);
  return (
    <PageShell>
      <PlantDetail initial={plant} />
    </PageShell>
  );
}
