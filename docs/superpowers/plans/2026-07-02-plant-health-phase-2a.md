# Plant Health Monitoring — Phase 2a Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock AI photo check with a real, on-device plant-health
classifier: train a 3-class CNN offline (Track A) and run it in-browser to drive
the health-check screen (Track B).

**Architecture:** A MobileNet-based transfer-learning model classifies a plant
photo into `{healthy, stressed, diseased}` with a confidence. The model is
exported to TensorFlow.js and runs entirely in the browser. A shared, pure
mapping layer converts `(class, confidence)` into a 0–100 health score, a
`PlantStatus`, and an "uncertain" state below a confidence threshold. The web UI
loads the model once, runs inference on the user's photo, and renders the result
in place of the mock.

**Tech Stack:** Python 3.11 + TensorFlow/Keras + pytest (Track A); Next.js 16 +
TypeScript + `@tensorflow/tfjs` + Vitest (Track B).

## Global Constraints

- **Next.js version:** 16.2.9 (App Router). Before writing or editing anything
  under `app/`, read the relevant guide in `node_modules/next/dist/docs/` — per
  `AGENTS.md`, this Next.js differs from prior versions. Copy verbatim: *"Read
  the relevant guide in `node_modules/next/dist/docs/` before writing any code."*
- **Model I/O contract (must match exactly across Python and TS):**
  - Input tensor: shape `[1, 224, 224, 3]`, RGB, float32, each channel scaled to
    `[0, 1]` by dividing by 255. No mean/std normalization.
  - Output tensor: shape `[1, 3]`, softmax probabilities in class order
    `["healthy", "stressed", "diseased"]`.
- **Confidence gate threshold:** `0.6`. Max probability `< 0.6` ⇒ label
  `"uncertain"`.
- **Health-score formula (identical in Python and TS), input `conf` = max softmax
  probability, output rounded int clamped to `[0, 100]`:**
  - `healthy`   → `5 + 95 * conf`   (e.g. conf 0.9 → 91)
  - `stressed`  → `50`
  - `diseased`  → `100 - 95 * conf`  (e.g. conf 0.9 → 15)
  - `uncertain` → `null` (no score shown)
- **Status mapping:** `healthy → "thriving"`, `stressed → "okay"`,
  `diseased → "needs"`, `uncertain → null`.
- **Class order constant** `["healthy", "stressed", "diseased"]` is the single
  source of truth; never reorder.
- Do not commit datasets or trained binaries larger than a few MB to git. The
  exported web model (quantized, a few MB) IS committed under `public/models/`.

---

# Part A — ML Training Pipeline (Python, `ml/` directory)

> Track A produces `ml/artifacts/tfjs_model/` (model.json + weight shards),
> consumed by Track B Task B4. Track B can begin in parallel using the stub
> model from Task B6 and swap in the real artifact later.

### Task A1: Python project scaffold + label-mapping module

**Files:**
- Create: `ml/requirements.txt`
- Create: `ml/pytest.ini`
- Create: `ml/florastudio_ml/__init__.py`
- Create: `ml/florastudio_ml/labels.py`
- Test: `ml/tests/test_labels.py`

**Interfaces:**
- Produces:
  - `CLASS_ORDER: list[str] = ["healthy", "stressed", "diseased"]`
  - `map_source_label(source_label: str) -> str | None` — maps a raw
    dataset label to one of `CLASS_ORDER`, or `None` to drop the sample.

- [ ] **Step 1: Create `ml/requirements.txt`**

```
tensorflow==2.16.1
tensorflowjs==4.17.0
pillow==10.3.0
numpy==1.26.4
pytest==8.2.0
```

- [ ] **Step 2: Create `ml/pytest.ini`**

```ini
[pytest]
testpaths = tests
pythonpath = .
```

- [ ] **Step 3: Create `ml/florastudio_ml/__init__.py`** (empty file)

- [ ] **Step 4: Write the failing test** — `ml/tests/test_labels.py`

```python
from florastudio_ml.labels import CLASS_ORDER, map_source_label


def test_class_order_is_fixed():
    assert CLASS_ORDER == ["healthy", "stressed", "diseased"]


def test_healthy_labels_map_to_healthy():
    assert map_source_label("Tomato___healthy") == "healthy"
    assert map_source_label("Apple___healthy") == "healthy"


def test_disease_labels_map_to_diseased():
    assert map_source_label("Tomato___Late_blight") == "diseased"
    assert map_source_label("Apple___Black_rot") == "diseased"


def test_early_symptom_labels_map_to_stressed():
    assert map_source_label("Tomato___Leaf_Mold") == "stressed"


def test_unknown_label_is_dropped():
    assert map_source_label("Background_without_leaves") is None
```

- [ ] **Step 5: Run test to verify it fails**

Run: `cd ml && python -m pytest tests/test_labels.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'florastudio_ml.labels'`

- [ ] **Step 6: Write minimal implementation** — `ml/florastudio_ml/labels.py`

```python
"""Maps raw dataset class labels into FloraStudio's 3 health classes."""

CLASS_ORDER = ["healthy", "stressed", "diseased"]

# Substrings that mark an early / mild stress condition rather than clear disease.
_STRESSED_MARKERS = ("leaf_mold", "spider_mites", "nutrient", "yellow")
# Labels that carry no plant signal and must be dropped.
_DROP_MARKERS = ("background", "without_leaves")


def map_source_label(source_label: str) -> str | None:
    key = source_label.lower()
    if any(m in key for m in _DROP_MARKERS):
        return None
    if "healthy" in key:
        return "healthy"
    if any(m in key for m in _STRESSED_MARKERS):
        return "stressed"
    return "diseased"
```

- [ ] **Step 7: Run test to verify it passes**

Run: `cd ml && python -m pytest tests/test_labels.py -v`
Expected: PASS (5 passed)

- [ ] **Step 8: Commit**

```bash
git add ml/requirements.txt ml/pytest.ini ml/florastudio_ml/__init__.py ml/florastudio_ml/labels.py ml/tests/test_labels.py
git commit -m "feat(ml): add label-mapping module and Python scaffold"
```

---

### Task A2: Dataset build script (download + relabel into 3 classes)

**Files:**
- Create: `ml/florastudio_ml/build_dataset.py`
- Create: `ml/README.md`
- Test: `ml/tests/test_build_dataset.py`

**Interfaces:**
- Consumes: `map_source_label`, `CLASS_ORDER` from Task A1.
- Produces:
  - `relabel_directory(src_root: Path, dst_root: Path) -> dict[str, int]` —
    copies images from `src_root/<source_label>/*.jpg` into
    `dst_root/<mapped_class>/`, returning a per-class count. Drops samples whose
    label maps to `None`.

- [ ] **Step 1: Write the failing test** — `ml/tests/test_build_dataset.py`

```python
from pathlib import Path
from florastudio_ml.build_dataset import relabel_directory


def _make_img(path: Path):
    from PIL import Image
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", (8, 8), (0, 128, 0)).save(path)


def test_relabel_directory_maps_and_counts(tmp_path):
    src = tmp_path / "src"
    dst = tmp_path / "dst"
    _make_img(src / "Tomato___healthy" / "a.jpg")
    _make_img(src / "Tomato___Late_blight" / "b.jpg")
    _make_img(src / "Background_without_leaves" / "c.jpg")

    counts = relabel_directory(src, dst)

    assert counts == {"healthy": 1, "stressed": 0, "diseased": 1}
    assert (dst / "healthy" / "a.jpg").exists()
    assert (dst / "diseased" / "b.jpg").exists()
    assert not (dst / "background").exists()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ml && python -m pytest tests/test_build_dataset.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'florastudio_ml.build_dataset'`

- [ ] **Step 3: Write minimal implementation** — `ml/florastudio_ml/build_dataset.py`

```python
"""Relabel a source image tree into FloraStudio's 3 health classes."""
import shutil
from pathlib import Path

from florastudio_ml.labels import CLASS_ORDER, map_source_label

_IMG_EXT = {".jpg", ".jpeg", ".png"}


def relabel_directory(src_root: Path, dst_root: Path) -> dict[str, int]:
    counts = {c: 0 for c in CLASS_ORDER}
    for class_dir in sorted(p for p in src_root.iterdir() if p.is_dir()):
        mapped = map_source_label(class_dir.name)
        if mapped is None:
            continue
        out_dir = dst_root / mapped
        out_dir.mkdir(parents=True, exist_ok=True)
        for img in class_dir.iterdir():
            if img.suffix.lower() in _IMG_EXT:
                shutil.copy2(img, out_dir / img.name)
                counts[mapped] += 1
    return counts
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ml && python -m pytest tests/test_build_dataset.py -v`
Expected: PASS (1 passed)

- [ ] **Step 5: Document the full data sources** — `ml/README.md`

````markdown
# FloraStudio ML — Health Classifier (Phase 2a)

## Data sources
- **PlantVillage** (crop leaves, lab conditions) — base volume.
- **PlantDoc** (field-realistic) — domain realism.
- **Custom garden set** — a few hundred self-labeled ornamental-garden photos
  placed under `data/custom/<healthy|stressed|diseased>/`.

## Build the training tree
1. Download PlantVillage + PlantDoc into `data/raw/<source_label>/`.
2. Run relabeling:
   ```bash
   python -m florastudio_ml.build_dataset data/raw data/train
   ```
3. Merge the custom set into `data/train/` (same 3-class folder layout).

Datasets are gitignored; only code and the exported web model are committed.
````

- [ ] **Step 6: Add a CLI entrypoint** — append to `ml/florastudio_ml/build_dataset.py`

```python
if __name__ == "__main__":
    import sys
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    print(relabel_directory(src, dst))
```

- [ ] **Step 7: Commit**

```bash
git add ml/florastudio_ml/build_dataset.py ml/README.md ml/tests/test_build_dataset.py
git commit -m "feat(ml): add dataset relabel script"
```

---

### Task A3: Training script (MobileNet transfer learning) + smoke test

**Files:**
- Create: `ml/florastudio_ml/model.py`
- Create: `ml/florastudio_ml/train.py`
- Test: `ml/tests/test_model.py`

**Interfaces:**
- Consumes: `CLASS_ORDER` from Task A1.
- Produces:
  - `build_model(input_size: int = 224) -> keras.Model` — MobileNetV2 base
    (frozen) + global pool + dropout + dense-3 softmax. Output shape `[None, 3]`.
  - `INPUT_SIZE: int = 224`
  - `train.py` CLI: `python -m florastudio_ml.train data/train artifacts/keras_model`

- [ ] **Step 1: Write the failing test** — `ml/tests/test_model.py`

```python
import numpy as np
from florastudio_ml.model import build_model, INPUT_SIZE


def test_input_size_is_224():
    assert INPUT_SIZE == 224


def test_model_output_shape_is_three_classes():
    model = build_model()
    x = np.zeros((2, INPUT_SIZE, INPUT_SIZE, 3), dtype="float32")
    y = model.predict(x, verbose=0)
    assert y.shape == (2, 3)


def test_model_output_is_softmax():
    model = build_model()
    x = np.zeros((1, INPUT_SIZE, INPUT_SIZE, 3), dtype="float32")
    y = model.predict(x, verbose=0)
    assert abs(float(y.sum()) - 1.0) < 1e-4
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ml && python -m pytest tests/test_model.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'florastudio_ml.model'`

- [ ] **Step 3: Write minimal implementation** — `ml/florastudio_ml/model.py`

```python
"""3-class plant health classifier: MobileNetV2 transfer learning."""
from tensorflow import keras
from florastudio_ml.labels import CLASS_ORDER

INPUT_SIZE = 224


def build_model(input_size: int = INPUT_SIZE) -> keras.Model:
    base = keras.applications.MobileNetV2(
        input_shape=(input_size, input_size, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False  # freeze for transfer learning
    inputs = keras.Input(shape=(input_size, input_size, 3))
    x = base(inputs, training=False)
    x = keras.layers.GlobalAveragePooling2D()(x)
    x = keras.layers.Dropout(0.2)(x)
    outputs = keras.layers.Dense(len(CLASS_ORDER), activation="softmax")(x)
    model = keras.Model(inputs, outputs)
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ml && python -m pytest tests/test_model.py -v`
Expected: PASS (3 passed). First run downloads ImageNet weights (~14 MB).

- [ ] **Step 5: Write the training CLI** — `ml/florastudio_ml/train.py`

```python
"""Fine-tune the health classifier on a 3-class image-folder dataset.

Preprocessing MUST match the web client: RGB, 224x224, pixels scaled to [0,1].
"""
import sys
from pathlib import Path

from tensorflow import keras
from florastudio_ml.model import build_model, INPUT_SIZE
from florastudio_ml.labels import CLASS_ORDER


def make_dataset(data_dir: Path, subset: str):
    return keras.utils.image_dataset_from_directory(
        data_dir,
        labels="inferred",
        label_mode="categorical",
        class_names=CLASS_ORDER,  # lock class order to our contract
        image_size=(INPUT_SIZE, INPUT_SIZE),
        batch_size=32,
        validation_split=0.2,
        subset=subset,
        seed=1337,
    ).map(lambda x, y: (x / 255.0, y))  # scale to [0,1]


def main(data_dir: str, out_dir: str, epochs: int = 8):
    train_ds = make_dataset(Path(data_dir), "training")
    val_ds = make_dataset(Path(data_dir), "validation")
    model = build_model()
    model.fit(train_ds, validation_data=val_ds, epochs=epochs)
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    model.save(Path(out_dir) / "model.keras")
    print(f"Saved model to {out_dir}/model.keras")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
```

- [ ] **Step 6: Commit**

```bash
git add ml/florastudio_ml/model.py ml/florastudio_ml/train.py ml/tests/test_model.py
git commit -m "feat(ml): add MobileNetV2 model builder and training CLI"
```

---

### Task A4: Evaluation script (per-class recall on a held-out real-garden set)

**Files:**
- Create: `ml/florastudio_ml/evaluate.py`
- Test: `ml/tests/test_evaluate.py`

**Interfaces:**
- Consumes: `CLASS_ORDER` from Task A1.
- Produces:
  - `per_class_recall(y_true: list[int], y_pred: list[int]) -> dict[str, float]`
    — recall per class keyed by class name; a class with no true samples maps to
    `float("nan")`.

- [ ] **Step 1: Write the failing test** — `ml/tests/test_evaluate.py`

```python
import math
from florastudio_ml.evaluate import per_class_recall


def test_perfect_predictions_give_recall_one():
    r = per_class_recall([0, 1, 2], [0, 1, 2])
    assert r == {"healthy": 1.0, "stressed": 1.0, "diseased": 1.0}


def test_missed_diseased_lowers_its_recall():
    # two diseased (idx 2); one predicted healthy (idx 0)
    r = per_class_recall([2, 2], [2, 0])
    assert r["diseased"] == 0.5


def test_absent_class_is_nan():
    r = per_class_recall([0, 0], [0, 0])
    assert math.isnan(r["diseased"])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ml && python -m pytest tests/test_evaluate.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'florastudio_ml.evaluate'`

- [ ] **Step 3: Write minimal implementation** — `ml/florastudio_ml/evaluate.py`

```python
"""Evaluation metrics for the health classifier. Recall on `diseased` is the
priority metric — a missed sick plant is worse than a false alarm."""
import sys
from pathlib import Path

from florastudio_ml.labels import CLASS_ORDER


def per_class_recall(y_true: list[int], y_pred: list[int]) -> dict[str, float]:
    result: dict[str, float] = {}
    for idx, name in enumerate(CLASS_ORDER):
        total = sum(1 for t in y_true if t == idx)
        if total == 0:
            result[name] = float("nan")
            continue
        hit = sum(1 for t, p in zip(y_true, y_pred) if t == idx and p == idx)
        result[name] = hit / total
    return result


def main(model_path: str, test_dir: str):
    import numpy as np
    from tensorflow import keras
    from florastudio_ml.model import INPUT_SIZE

    model = keras.models.load_model(model_path)
    ds = keras.utils.image_dataset_from_directory(
        Path(test_dir),
        labels="inferred",
        label_mode="int",
        class_names=CLASS_ORDER,
        image_size=(INPUT_SIZE, INPUT_SIZE),
        batch_size=32,
        shuffle=False,
    ).map(lambda x, y: (x / 255.0, y))
    y_true, y_pred = [], []
    for xb, yb in ds:
        probs = model.predict(xb, verbose=0)
        y_pred.extend(int(i) for i in np.argmax(probs, axis=1))
        y_true.extend(int(i) for i in yb.numpy())
    print("per-class recall:", per_class_recall(y_true, y_pred))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ml && python -m pytest tests/test_evaluate.py -v`
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add ml/florastudio_ml/evaluate.py ml/tests/test_evaluate.py
git commit -m "feat(ml): add per-class recall evaluation"
```

---

### Task A5: Export to TensorFlow.js + health-score parity check

**Files:**
- Create: `ml/florastudio_ml/export_web.py`
- Create: `ml/florastudio_ml/scoring.py`
- Test: `ml/tests/test_scoring.py`

**Interfaces:**
- Consumes: `CLASS_ORDER` from Task A1.
- Produces:
  - `health_score(label: str, conf: float) -> int | None` — the shared formula
    (Global Constraints). This is the reference the TS version (Task B2) is
    checked against.
  - `export_web.py` CLI: `python -m florastudio_ml.export_web
    artifacts/keras_model/model.keras ../public/models/health-v1` — writes a
    TF.js graph model.

- [ ] **Step 1: Write the failing test** — `ml/tests/test_scoring.py`

```python
import pytest
from florastudio_ml.scoring import health_score


def test_healthy_high_confidence():
    assert health_score("healthy", 0.9) == 91


def test_diseased_high_confidence():
    assert health_score("diseased", 0.9) == 15


def test_stressed_is_neutral():
    assert health_score("stressed", 0.42) == 50


def test_uncertain_is_none():
    assert health_score("uncertain", 0.55) is None


def test_scores_clamped_to_range():
    assert health_score("healthy", 1.0) == 100
    assert health_score("diseased", 1.0) == 5
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ml && python -m pytest tests/test_scoring.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'florastudio_ml.scoring'`

- [ ] **Step 3: Write minimal implementation** — `ml/florastudio_ml/scoring.py`

```python
"""Shared health-score formula. Keep IDENTICAL to lib/ml/scoring.ts."""


def health_score(label: str, conf: float) -> int | None:
    if label == "uncertain":
        return None
    if label == "healthy":
        raw = 5 + 95 * conf
    elif label == "diseased":
        raw = 100 - 95 * conf
    else:  # stressed
        raw = 50
    return max(0, min(100, round(raw)))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ml && python -m pytest tests/test_scoring.py -v`
Expected: PASS (5 passed)

- [ ] **Step 5: Write the export CLI** — `ml/florastudio_ml/export_web.py`

```python
"""Convert a saved Keras model to a TensorFlow.js graph model for the browser."""
import subprocess
import sys
from pathlib import Path


def main(keras_path: str, out_dir: str):
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "tensorflowjs_converter",
            "--input_format=keras",
            "--quantize_uint8",
            keras_path,
            out_dir,
        ],
        check=True,
    )
    print(f"Exported TF.js model to {out_dir}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
```

- [ ] **Step 6: Run the full Python suite**

Run: `cd ml && python -m pytest -v`
Expected: PASS (all tasks A1–A5 tests green)

- [ ] **Step 7: Commit**

```bash
git add ml/florastudio_ml/scoring.py ml/florastudio_ml/export_web.py ml/tests/test_scoring.py
git commit -m "feat(ml): add web export and shared health-score formula"
```

> **Manual (engineer, with GPU + downloaded data) — not a code step:** run
> `build_dataset` → `train` → `evaluate` (confirm `diseased` recall is
> acceptable) → `export_web` into `public/models/health-v1/`. This produces the
> real artifact consumed by Task B4.

---

# Part B — Web Integration (Next.js / TypeScript)

### Task B1: Vitest scaffold + shared scoring/gate module (TDD)

**Files:**
- Modify: `package.json` (add devDeps + `test` script)
- Create: `vitest.config.ts`
- Create: `lib/ml/scoring.ts`
- Test: `lib/ml/scoring.test.ts`

**Interfaces:**
- Produces:
  - `CLASS_ORDER = ["healthy", "stressed", "diseased"] as const`
  - `type HealthLabel = "healthy" | "stressed" | "diseased" | "uncertain"`
  - `CONFIDENCE_THRESHOLD = 0.6`
  - `labelFromProbs(probs: number[]): { label: HealthLabel; confidence: number }`
  - `healthScore(label: HealthLabel, conf: number): number | null`
  - `statusFromLabel(label: HealthLabel): PlantStatus | null`

- [ ] **Step 1: Add Vitest deps and script** — modify `package.json`

Add to `devDependencies`:
```json
"vitest": "^2.1.0",
"@vitest/coverage-v8": "^2.1.0"
```
Add to `scripts`:
```json
"test": "vitest run"
```
Then run: `npm install`

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
});
```

- [ ] **Step 3: Write the failing test** — `lib/ml/scoring.test.ts`

```ts
import { describe, it, expect } from "vitest";
import {
  labelFromProbs,
  healthScore,
  statusFromLabel,
  CONFIDENCE_THRESHOLD,
} from "@/lib/ml/scoring";

describe("labelFromProbs", () => {
  it("picks the argmax class above threshold", () => {
    expect(labelFromProbs([0.9, 0.05, 0.05])).toEqual({
      label: "healthy",
      confidence: 0.9,
    });
    expect(labelFromProbs([0.1, 0.2, 0.7])).toEqual({
      label: "diseased",
      confidence: 0.7,
    });
  });

  it("returns uncertain below threshold", () => {
    const r = labelFromProbs([0.4, 0.35, 0.25]);
    expect(r.label).toBe("uncertain");
    expect(r.confidence).toBeCloseTo(0.4);
  });
});

describe("healthScore (matches Python reference)", () => {
  it("healthy@0.9 -> 91", () => expect(healthScore("healthy", 0.9)).toBe(91));
  it("diseased@0.9 -> 15", () => expect(healthScore("diseased", 0.9)).toBe(15));
  it("stressed -> 50", () => expect(healthScore("stressed", 0.42)).toBe(50));
  it("uncertain -> null", () => expect(healthScore("uncertain", 0.5)).toBeNull());
  it("clamps to range", () => {
    expect(healthScore("healthy", 1)).toBe(100);
    expect(healthScore("diseased", 1)).toBe(5);
  });
});

describe("statusFromLabel", () => {
  it("maps classes to PlantStatus", () => {
    expect(statusFromLabel("healthy")).toBe("thriving");
    expect(statusFromLabel("stressed")).toBe("okay");
    expect(statusFromLabel("diseased")).toBe("needs");
    expect(statusFromLabel("uncertain")).toBeNull();
  });
});

it("threshold is 0.6", () => expect(CONFIDENCE_THRESHOLD).toBe(0.6));
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/ml/scoring`.

- [ ] **Step 5: Write minimal implementation** — `lib/ml/scoring.ts`

```ts
import type { PlantStatus } from "@/lib/types";

export const CLASS_ORDER = ["healthy", "stressed", "diseased"] as const;
export const CONFIDENCE_THRESHOLD = 0.6;

export type HealthLabel = (typeof CLASS_ORDER)[number] | "uncertain";

export function labelFromProbs(probs: number[]): {
  label: HealthLabel;
  confidence: number;
} {
  let bestIdx = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[bestIdx]) bestIdx = i;
  }
  const confidence = probs[bestIdx];
  if (confidence < CONFIDENCE_THRESHOLD) return { label: "uncertain", confidence };
  return { label: CLASS_ORDER[bestIdx], confidence };
}

export function healthScore(label: HealthLabel, conf: number): number | null {
  if (label === "uncertain") return null;
  let raw: number;
  if (label === "healthy") raw = 5 + 95 * conf;
  else if (label === "diseased") raw = 100 - 95 * conf;
  else raw = 50; // stressed
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function statusFromLabel(label: HealthLabel): PlantStatus | null {
  if (label === "healthy") return "thriving";
  if (label === "stressed") return "okay";
  if (label === "diseased") return "needs";
  return null;
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test`
Expected: PASS (all scoring tests green).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/ml/scoring.ts lib/ml/scoring.test.ts
git commit -m "feat(ml-web): add Vitest and shared scoring/gate module"
```

---

### Task B2: Image preprocessing (canvas → normalized Float32Array)

**Files:**
- Create: `lib/ml/preprocess.ts`
- Test: `lib/ml/preprocess.test.ts`

**Interfaces:**
- Produces:
  - `INPUT_SIZE = 224`
  - `pixelsToInput(rgba: Uint8ClampedArray, size: number): Float32Array` —
    converts an RGBA pixel buffer of length `size*size*4` into a length
    `size*size*3` Float32Array (RGB, values `/255`), dropping the alpha channel.

- [ ] **Step 1: Write the failing test** — `lib/ml/preprocess.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { pixelsToInput, INPUT_SIZE } from "@/lib/ml/preprocess";

describe("pixelsToInput", () => {
  it("input size is 224", () => expect(INPUT_SIZE).toBe(224));

  it("drops alpha and scales RGB to [0,1]", () => {
    // one white pixel (255,255,255,255) then one black (0,0,0,255)
    const rgba = new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]);
    const out = pixelsToInput(rgba, 1); // size arg only affects length assert here
    expect(Array.from(out.slice(0, 6))).toEqual([1, 1, 1, 0, 0, 0]);
  });

  it("produces size*size*3 floats", () => {
    const rgba = new Uint8ClampedArray(2 * 2 * 4);
    const out = pixelsToInput(rgba, 2);
    expect(out.length).toBe(2 * 2 * 3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/ml/preprocess`.

- [ ] **Step 3: Write minimal implementation** — `lib/ml/preprocess.ts`

```ts
export const INPUT_SIZE = 224;

/**
 * Convert an RGBA pixel buffer to a normalized RGB Float32Array in [0,1],
 * matching the Python training preprocessing exactly (divide by 255, no
 * mean/std). Alpha is dropped.
 */
export function pixelsToInput(
  rgba: Uint8ClampedArray,
  size: number,
): Float32Array {
  const out = new Float32Array(size * size * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    out[j] = rgba[i] / 255;
    out[j + 1] = rgba[i + 1] / 255;
    out[j + 2] = rgba[i + 2] / 255;
  }
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/ml/preprocess.ts lib/ml/preprocess.test.ts
git commit -m "feat(ml-web): add image preprocessing to model input"
```

---

### Task B3: TF.js model loader + inference wrapper

**Files:**
- Modify: `package.json` (add `@tensorflow/tfjs`)
- Create: `lib/ml/classifier.ts`
- Test: `lib/ml/classifier.test.ts`

**Interfaces:**
- Consumes: `labelFromProbs`, `healthScore`, `statusFromLabel` (B1); `INPUT_SIZE`,
  `pixelsToInput` (B2).
- Produces:
  - `type HealthPrediction = { label: HealthLabel; confidence: number;
    healthScore: number | null; status: PlantStatus | null }`
  - `predictFromImageData(imageData: ImageData, runModel: (input: Float32Array)
    => Promise<number[]>): Promise<HealthPrediction>` — pure orchestrator;
    `runModel` is injected so it is testable without a real model.
  - `loadModel(url?: string): Promise<(input: Float32Array) => Promise<number[]>>`
    — loads the TF.js model once (module-level cache) and returns a `runModel`.

- [ ] **Step 1: Add tfjs dependency** — modify `package.json`

Add to `dependencies`: `"@tensorflow/tfjs": "^4.22.0"`, then run `npm install`.

- [ ] **Step 2: Write the failing test** — `lib/ml/classifier.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { predictFromImageData } from "@/lib/ml/classifier";
import { INPUT_SIZE } from "@/lib/ml/preprocess";

function fakeImageData(): ImageData {
  const data = new Uint8ClampedArray(INPUT_SIZE * INPUT_SIZE * 4).fill(200);
  return { data, width: INPUT_SIZE, height: INPUT_SIZE } as ImageData;
}

describe("predictFromImageData", () => {
  it("maps a confident healthy model output to a prediction", async () => {
    const runModel = async () => [0.92, 0.05, 0.03];
    const p = await predictFromImageData(fakeImageData(), runModel);
    expect(p.label).toBe("healthy");
    expect(p.status).toBe("thriving");
    expect(p.healthScore).toBe(92); // 5 + 95*0.92 = 92.4 -> 92
  });

  it("maps low confidence to uncertain with null score", async () => {
    const runModel = async () => [0.4, 0.35, 0.25];
    const p = await predictFromImageData(fakeImageData(), runModel);
    expect(p.label).toBe("uncertain");
    expect(p.status).toBeNull();
    expect(p.healthScore).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/ml/classifier`.

- [ ] **Step 4: Write minimal implementation** — `lib/ml/classifier.ts`

```ts
import * as tf from "@tensorflow/tfjs";
import {
  labelFromProbs,
  healthScore,
  statusFromLabel,
  type HealthLabel,
} from "@/lib/ml/scoring";
import { INPUT_SIZE, pixelsToInput } from "@/lib/ml/preprocess";
import type { PlantStatus } from "@/lib/types";

export type HealthPrediction = {
  label: HealthLabel;
  confidence: number;
  healthScore: number | null;
  status: PlantStatus | null;
};

const DEFAULT_MODEL_URL = "/models/health-v1/model.json";

export async function predictFromImageData(
  imageData: ImageData,
  runModel: (input: Float32Array) => Promise<number[]>,
): Promise<HealthPrediction> {
  const input = pixelsToInput(imageData.data, INPUT_SIZE);
  const probs = await runModel(input);
  const { label, confidence } = labelFromProbs(probs);
  return {
    label,
    confidence,
    healthScore: healthScore(label, confidence),
    status: statusFromLabel(label),
  };
}

let _cached: Promise<(input: Float32Array) => Promise<number[]>> | null = null;

export function loadModel(url: string = DEFAULT_MODEL_URL) {
  if (_cached) return _cached;
  _cached = tf.loadGraphModel(url).then((model) => {
    return async (input: Float32Array) => {
      return tf.tidy(() => {
        const t = tf.tensor4d(input, [1, INPUT_SIZE, INPUT_SIZE, 3]);
        const out = model.predict(t) as tf.Tensor;
        return Array.from(out.dataSync());
      }) as unknown as number[];
    };
  });
  return _cached;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS (the pure `predictFromImageData` path; `loadModel` is not exercised
here).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/ml/classifier.ts lib/ml/classifier.test.ts
git commit -m "feat(ml-web): add TF.js loader and inference orchestrator"
```

---

### Task B4: Browser image capture helper (HTMLImageElement → ImageData)

**Files:**
- Create: `lib/ml/capture.ts`

**Interfaces:**
- Produces:
  - `imageToImageData(img: HTMLImageElement, size: number): ImageData` — draws
    the image into an offscreen `size×size` canvas and returns its `ImageData`.
    (Browser-only; not unit-tested — exercised via the manual check in B6.)

- [ ] **Step 1: Write implementation** — `lib/ml/capture.ts`

```ts
import { INPUT_SIZE } from "@/lib/ml/preprocess";

/** Draw an image into a square canvas and extract pixel data for the model. */
export function imageToImageData(
  img: HTMLImageElement,
  size: number = INPUT_SIZE,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  ctx.drawImage(img, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size);
}

/** Load an object-URL / data-URL into a decoded HTMLImageElement. */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image failed to load"));
    img.src = src;
  });
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ml/capture.ts
git commit -m "feat(ml-web): add browser image capture helper"
```

---

### Task B5: Wire real inference into the photo-check screen

**Files:**
- Modify: `components/plants/photo-check.tsx`
- Reference (read first): `node_modules/next/dist/docs/` (per Global Constraints),
  `lib/types.ts`, `lib/mock/plants.ts` (`statusFromHealth`).

**Interfaces:**
- Consumes: `loadModel`, `predictFromImageData`, `HealthPrediction` (B3);
  `imageToImageData`, `loadImageElement` (B4).
- Behavior: when the user has uploaded a real photo (`image` is set), `runScan`
  runs the model instead of `randomScan`. Sample SVG arts (no real photo) keep
  the existing mock path. An `"uncertain"` result renders an honest
  "not sure — here's what to check" state instead of a health number.

- [ ] **Step 1: Read the Next docs note and current component**

Run: confirm `components/plants/photo-check.tsx` `runScan` currently calls
`setTimeout(() => { setResult(randomScan(t)); setPhase("result"); }, 2200)`.
Read the client-component guidance in `node_modules/next/dist/docs/` before
editing (this file is already `"use client"`).

- [ ] **Step 2: Add prediction state and imports** — edit the top of `PhotoCheck`

Add imports after the existing `@/lib/*` imports:
```tsx
import { loadModel, predictFromImageData, type HealthPrediction } from "@/lib/ml/classifier";
import { imageToImageData, loadImageElement } from "@/lib/ml/capture";
```
Add state alongside the existing `useState` hooks:
```tsx
const [prediction, setPrediction] = useState<HealthPrediction | null>(null);
```

- [ ] **Step 3: Replace `runScan` with real inference (falling back to mock for samples)**

```tsx
const runScan = async () => {
  setPhase("scanning");
  // Sample SVG arts have no real photo -> keep the demo mock path.
  if (!image) {
    setTimeout(() => {
      setResult(randomScan(t));
      setPrediction(null);
      setPhase("result");
    }, 2200);
    return;
  }
  try {
    const [runModel, imgEl] = await Promise.all([
      loadModel(),
      loadImageElement(image),
    ]);
    const imageData = imageToImageData(imgEl);
    const p = await predictFromImageData(imageData, runModel);
    setPrediction(p);
    setResult(null);
    setPhase("result");
  } catch {
    // Model failed to load / run -> honest fallback, not a fake result.
    setPrediction({ label: "uncertain", confidence: 0, healthScore: null, status: null });
    setResult(null);
    setPhase("result");
  }
};
```

- [ ] **Step 4: Reset `prediction` in `reset`**

In the existing `reset` function add: `setPrediction(null);`

- [ ] **Step 5: Render the prediction (and uncertain state) in the result panel**

Replace the result-panel body so it prefers a real `prediction`:
```tsx
{phase !== "result" || (!result && !prediction) ? (
  <div className="grid h-full min-h-[300px] place-items-center text-center text-plum-400">
    <div>
      <ScanLine className="mx-auto h-8 w-8 text-blush-300" />
      <p className="mt-3 text-sm">{t("photoCheck.resultsPlaceholder")}</p>
    </div>
  </div>
) : prediction ? (
  <PredictionView prediction={prediction} />
) : (
  <ResultView result={result!} />
)}
```

- [ ] **Step 6: Add the `PredictionView` component** — append to `photo-check.tsx`

```tsx
function PredictionView({ prediction }: { prediction: HealthPrediction }) {
  const tr = useTranslations();
  if (prediction.label === "uncertain") {
    return (
      <div className="animate-rise">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fbf1dd] text-[#c79a3e]">
            <Eye className="h-5 w-5" />
          </span>
          <h2 className="font-display text-2xl text-plum-900">
            {tr("photoCheck.uncertainTitle")}
          </h2>
        </div>
        <p className="mt-3 text-sm text-plum-600">{tr("photoCheck.uncertainBody")}</p>
      </div>
    );
  }
  const status = prediction.status!;
  const score = prediction.healthScore!;
  return (
    <div className="animate-rise">
      <div className="flex items-center gap-4">
        <PlantAvatar art="monstera" status={status} size="md" />
        <div>
          <Badge variant={status}>{statusLabel(tr, status)}</Badge>
          <h2 className="mt-1 font-display text-2xl text-plum-900">
            {tr("photoCheck.healthScore", { value: score })}
          </h2>
          <p className="text-xs text-plum-400">
            {tr("photoCheck.confidence", { value: Math.round(prediction.confidence * 100) })}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Add the three new i18n keys**

Add `photoCheck.uncertainTitle`, `photoCheck.uncertainBody`, and
`photoCheck.healthScore` (with a `{value}` placeholder) to every locale messages
file used by `next-intl` (mirror how existing `photoCheck.*` keys are defined).

- [ ] **Step 8: Type-check and run the web test suite**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors; all Vitest tests pass.

- [ ] **Step 9: Commit**

```bash
git add components/plants/photo-check.tsx messages
git commit -m "feat(ml-web): run on-device model in photo health check"
```

---

### Task B6: Ship a stub model + manual browser verification

**Files:**
- Create: `public/models/health-v1/` (stub now; replaced by the real Task A5 export)
- Create: `ml/florastudio_ml/make_stub_model.py`

**Interfaces:**
- Produces: a valid TF.js graph model at `public/models/health-v1/model.json`
  with the exact I/O contract, so Track B is runnable before real training
  finishes.

- [ ] **Step 1: Write a stub-model generator** — `ml/florastudio_ml/make_stub_model.py`

```python
"""Emit an UNTRAINED but contract-correct model, so the web app runs end-to-end
before real training completes. Replace with the Task A5 export for production."""
import sys
from pathlib import Path

from florastudio_ml.model import build_model
from florastudio_ml.export_web import main as export_web


def main(out_dir: str):
    keras_path = Path(out_dir).parent / "_stub.keras"
    build_model().save(keras_path)
    export_web(str(keras_path), out_dir)


if __name__ == "__main__":
    main(sys.argv[1])
```

- [ ] **Step 2: Generate the stub into the app's public dir**

Run: `cd ml && python -m florastudio_ml.make_stub_model ../public/models/health-v1`
Expected: `public/models/health-v1/model.json` + weight shard(s) created.

- [ ] **Step 3: Manual browser verification**

Run: `npm run dev`, open `http://localhost:3000/en/plants/demo/photo-check`,
upload a real plant photo, click Run scan. Confirm: a health score + confidence
render (values will be arbitrary — it's an untrained stub), and no console
errors. Upload nothing / pick a sample art → the demo mock still shows.

- [ ] **Step 4: Commit**

```bash
git add ml/florastudio_ml/make_stub_model.py public/models/health-v1
git commit -m "chore(ml-web): add contract-correct stub model for local runs"
```

> **Production swap (engineer):** once Task A5's real training + export is done,
> overwrite `public/models/health-v1/` with the trained artifact and re-run
> Step 3 to confirm sensible predictions.

---

## Self-Review Notes

- **Spec coverage:** Model A training (A1–A5), on-device inference (B1–B6),
  confidence gate + uncertain UX (B1 gate, B5/B6 UI), health-score mapping
  (shared, A5+B1, parity-tested), evaluation incl. `diseased`-recall priority
  (A4). Deferred per spec/non-goals: Plant Carer Agent, flywheel, care
  recommender — **not** in this plan (they are Phase 2b/2c).
- **Type consistency:** `CLASS_ORDER`, `HealthLabel`, `healthScore`,
  `statusFromLabel`, `labelFromProbs`, `predictFromImageData`,
  `HealthPrediction`, `INPUT_SIZE`, `pixelsToInput` are defined once and reused
  with matching signatures across tasks.
- **Cross-language parity:** `health_score` (Python, A5) and `healthScore` (TS,
  B1) use the identical formula and are each tested against the same anchor
  values (healthy@0.9→91, diseased@0.9→15).
