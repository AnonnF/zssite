import { notFound } from "next/navigation";
import { isPublicAnalyzerEnabled } from "@/lib/siteFeatures";

export default function AnalyzerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isPublicAnalyzerEnabled()) {
    notFound();
  }

  return children;
}
