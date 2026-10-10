import { defaultLocale, locales, type Locale } from "./config";

function isExternal(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);
}

/**
 * Prefix an internal href with the locale segment.
 * The default locale (zh) keeps unprefixed URLs.
 */
export function localizeHref(locale: Locale, href: string): string {
  if (isExternal(href) || locale === defaultLocale) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

/** Strip a leading locale segment (`/en`, `/zh`) from a pathname. */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

/** Same page in another locale. */
export function switchLocaleHref(pathname: string, target: Locale): string {
  return localizeHref(target, stripLocale(pathname));
}

/** `alternates` metadata (canonical + hreflang) for a locale-neutral path such as `/projects`. */
export function buildAlternates(locale: Locale, path: string) {
  return {
    canonical: localizeHref(locale, path),
    languages: {
      "zh-CN": localizeHref("zh", path),
      en: localizeHref("en", path),
      "x-default": localizeHref("zh", path),
    },
  };
}
