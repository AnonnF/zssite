import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { EntryCards } from "@/components/home/EntryCards";
import { AboutPreview } from "@/components/home/AboutPreview";
import { buildAlternates } from "@/lib/i18n/href";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { alternates: buildAlternates(locale, "/") };
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <>
      <Hero locale={locale} />
      <EntryCards locale={locale} />
      <AboutPreview locale={locale} />
    </>
  );
}
