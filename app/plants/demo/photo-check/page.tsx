import { PageShell } from "@/components/layout/page-shell";
import { PhotoCheck } from "@/components/plants/photo-check";

export const metadata = { title: "Photo health check · MP FloraStudio" };

export default function PhotoCheckPage() {
  return (
    <PageShell>
      <PhotoCheck />
    </PageShell>
  );
}
