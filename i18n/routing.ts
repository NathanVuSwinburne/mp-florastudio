import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  // English stays at "/", Vietnamese is served under "/vi" so existing links keep working.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
