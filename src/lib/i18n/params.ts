import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Resolve and validate the `[locale]` route param; 404s on unknown locales. */
export async function resolveLocale(
  params: Promise<{ locale: string }>
): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
