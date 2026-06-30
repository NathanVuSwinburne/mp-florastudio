import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/layout/page-shell";
import { PhotoCheck } from "@/components/plants/photo-check";

export async function generateMetadata() {
  const t = await getTranslations();
  return { title: t("metadata.photoCheck") };
}

export default function PhotoCheckPage() {
  return (
    <PageShell>
      <PhotoCheck />
    </PageShell>
  );
}
