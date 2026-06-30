import { getTranslations } from "next-intl/server";
import { EditorStudio } from "@/components/editor/editor-studio";

export async function generateMetadata() {
  const t = await getTranslations();
  return { title: t("metadata.editor") };
}

export default function EditorPage() {
  return <EditorStudio />;
}
