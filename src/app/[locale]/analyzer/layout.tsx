import { notFound, redirect } from "next/navigation";
import { isPublicAnalyzerEnabled } from "@/lib/siteFeatures";

export default async function AnalyzerLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isPublicAnalyzerEnabled()) {
    notFound();
  }

  // Analyzer UI is not translated; send English visitors to the Chinese route.
  if (locale !== "zh") {
    redirect("/analyzer");
  }

  return children;
}
