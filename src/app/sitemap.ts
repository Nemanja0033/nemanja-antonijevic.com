import type { MetadataRoute } from "next";
import { alternates, localePath, locales } from "@/i18n";
import { availableIn, getSitePaths } from "@/lib/paths";
import { site } from "@/lib/site";

// Every page in every language, each with its hreflang alternates
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLanguage = await Promise.all(
    locales.map(async (lang) =>
      Promise.all(
        (await getSitePaths(lang)).map(async ({ path, lastModified }) => {
          const { languages } = alternates(lang, path, await availableIn(path));
          return {
            url: `${site.url}${localePath(lang, path)}`,
            lastModified,
            alternates: {
              languages: Object.fromEntries(
                Object.entries(languages).map(([key, href]) => [key, `${site.url}${href}`]),
              ),
            },
          };
        }),
      ),
    ),
  );
  return perLanguage.flat();
}
