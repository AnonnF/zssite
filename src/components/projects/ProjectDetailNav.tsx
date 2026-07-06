"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectDetailNavSection } from "@/data/projects";

interface ProjectDetailNavProps {
  sections: ProjectDetailNavSection[];
  variant: "desktop" | "mobile";
  className?: string;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProjectDetailNav({
  sections,
  variant,
  className = "",
}: ProjectDetailNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const observed = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (observed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    for (const el of observed) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = useCallback((id: string) => {
    setActiveId(id);
    scrollToSection(id);
  }, []);

  if (sections.length === 0) return null;

  if (variant === "mobile") {
    return (
      <nav
        aria-label="Page sections"
        className={`page-nav-mobile sticky top-14 z-10 -mx-6 border-b border-border-soft bg-bg/95 px-6 py-2 backdrop-blur-sm md:-mx-12 md:px-12 xl:hidden ${className}`}
      >
        <div className="flex gap-0.5 overflow-x-auto pb-0.5">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`page-nav-link page-nav-link--mobile shrink-0 ${
                activeId === section.id ? "page-nav-link--active" : ""
              }`}
              onClick={() => handleClick(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Page sections"
      className={`project-detail-nav-desktop ${className}`}
    >
      <p className="project-detail-nav-desktop__label">On this page</p>
      <ul className="project-detail-nav-desktop__list">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              className={`page-nav-link page-nav-link--desktop w-full text-left ${
                activeId === section.id ? "page-nav-link--active" : ""
              }`}
              onClick={() => handleClick(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
