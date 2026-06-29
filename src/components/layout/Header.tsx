"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const { brand, nav, languageToggle } = siteContent;

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-bg/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6 md:h-16 md:px-12 lg:px-16">
        <Link
          href="/"
          className="group flex items-baseline gap-1 font-display text-lg font-bold tracking-tight md:text-xl"
        >
          <span>{brand.primary}</span>
          <span className="font-mono text-meta font-medium text-muted transition-colors group-hover:text-accent">
            / {brand.secondary}
          </span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-8">
          <ul className="flex items-center gap-4 md:gap-6">
            {nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-body text-body font-medium transition-colors hover:text-text ${
                      isActive
                        ? "nav-link-active"
                        : "text-muted hover:underline hover:decoration-accent hover:underline-offset-4"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center border-l border-border-soft pl-6 font-mono text-meta md:flex">
            <button
              type="button"
              className="font-semibold text-text"
              aria-label="当前语言：中文"
              disabled
            >
              {languageToggle.zh}
            </button>
            <span className="mx-2 text-muted">/</span>
            <button
              type="button"
              className="text-muted transition-colors hover:text-accent"
              aria-label="切换至英文（即将推出）"
              disabled
            >
              {languageToggle.en}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
