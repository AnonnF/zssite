import type { ProjectNarrative } from "@/data/projects/types";

interface ProjectNarrativeProps {
  narrative: ProjectNarrative;
  className?: string;
}

function DecisionItem({
  title,
  decision,
  rationale,
  impact,
}: {
  title: string;
  decision: string;
  rationale: string;
  impact: string;
}) {
  return (
    <article className="narrative-item py-4 first:pt-0 last:pb-0">
      <h4 className="font-display text-body font-bold leading-snug text-text">
        {title}
      </h4>
      <dl className="mt-3 space-y-2.5">
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

function SkillItem({ title, description }: { title: string; description: string }) {
  return (
    <article className="narrative-item py-4 first:pt-0 last:pb-0">
      <h4 className="font-display text-body font-bold leading-snug text-text">
        {title}
      </h4>
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
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      {decisions.length > 0 && (
        <section className="panel-card px-4 py-4 md:px-5 md:py-5">
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Technical Decisions
          </p>
          <div className="mt-4 divide-y divide-border-soft">
            {decisions.map((item) => (
              <DecisionItem key={item.title} {...item} />
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="panel-card px-4 py-4 md:px-5 md:py-5">
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Skills Demonstrated
          </p>
          <div className="mt-4 divide-y divide-border-soft">
            {skills.map((item) => (
              <SkillItem key={item.title} {...item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
