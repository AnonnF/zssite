import type { ProjectNarrative, ProjectSkillHighlight, ProjectTechnicalDecision } from "@/data/projects/types";
import { ReviewBadge } from "./ReviewBadge";

interface ProjectNarrativeProps {
  narrative: ProjectNarrative;
  className?: string;
}

function DecisionItem({
  title,
  decision,
  rationale,
  impact,
  review,
}: ProjectTechnicalDecision) {
  return (
    <article className="narrative-item py-5 first:pt-0 last:pb-0">
      <div className="narrative-item__header">
        <h4 className="font-display text-body font-bold leading-snug text-text">
          {title}
        </h4>
        <ReviewBadge review={review} />
      </div>
      <dl className="mt-3 space-y-3">
        <div>
          <dt className="font-mono text-meta uppercase tracking-wider text-muted">
            Decision
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {decision}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-meta uppercase tracking-wider text-muted">
            Rationale
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {rationale}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-meta uppercase tracking-wider text-muted">
            Impact
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {impact}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function SkillItem({ title, description, review }: ProjectSkillHighlight) {
  return (
    <article className="narrative-item py-5 first:pt-0 last:pb-0">
      <div className="narrative-item__header">
        <h4 className="font-display text-body font-bold leading-snug text-text">
          {title}
        </h4>
        <ReviewBadge review={review} />
      </div>
      <p className="mt-2 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
        {description}
      </p>
    </article>
  );
}

export function ProjectNarrative({ narrative, className = "" }: ProjectNarrativeProps) {
  const decisions = narrative.technicalDecisions ?? [];
  const skills = narrative.skills ?? [];

  if (decisions.length === 0 && skills.length === 0) return null;

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {decisions.length > 0 && (
        <section
          id="technical-decisions"
          className="panel-card scroll-mt-24 px-4 py-5 md:px-6 md:py-6"
        >
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Technical Decisions
          </p>
          <div className="mt-5 divide-y divide-border-soft">
            {decisions.map((item) => (
              <DecisionItem key={item.title} {...item} />
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section
          id="skills-demonstrated"
          className="panel-card scroll-mt-24 px-4 py-5 md:px-6 md:py-6"
        >
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Skills Demonstrated
          </p>
          <div className="mt-5 divide-y divide-border-soft">
            {skills.map((item) => (
              <SkillItem key={item.title} {...item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
