import { PageShell } from "@/components/layout/page-shell";
import { PlantDetail } from "@/components/plants/plant-detail";
import { PLANTS_BY_ID, DEMO_PLANT_ID } from "@/lib/mock/plants";

export const metadata = { title: "Plant detail · MP FloraStudio" };

export default function PlantDetailPage() {
  const plant = PLANTS_BY_ID[DEMO_PLANT_ID];
  return (
    <PageShell>
      <PlantDetail initial={{ ...plant }} />
    </PageShell>
  );
}
