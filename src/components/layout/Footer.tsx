import Link from "next/link";
import { siteContent } from "@/content/site";

export function Footer() {
  const { copyright, links } = siteContent.footer;

  return (
    <footer className="border-t border-border-soft bg-bg-secondary/40">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
        <div>
          <p className="font-mono text-meta uppercase tracking-[0.1em] text-muted">
            Engineering Archive
          </p>
          <p className="mt-1 font-mono text-meta text-muted">{copyright}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-mono text-meta font-medium uppercase tracking-wider text-text transition-colors hover:text-accent hover:underline hover:decoration-accent hover:underline-offset-4"
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
