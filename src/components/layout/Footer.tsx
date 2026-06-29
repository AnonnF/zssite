import Link from "next/link";
import { siteContent } from "@/content/site";

export function Footer() {
  const { copyright, links } = siteContent.footer;

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
        <p className="font-mono text-meta text-muted">{copyright}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-mono text-meta font-medium uppercase tracking-wider text-text transition-opacity hover:opacity-60"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
