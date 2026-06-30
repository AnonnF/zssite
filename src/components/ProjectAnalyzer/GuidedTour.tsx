"use client";

import type { ProjectGuidedTourStep } from "@/data/projects/types";

interface GuidedTourProps {
  steps: ProjectGuidedTourStep[];
  activeStepIndex: number;
  onStepSelect: (index: number) => void;
}

function StepArrow() {
  return (
    <div
      className="flex shrink-0 items-center self-center px-1 text-muted"
      aria-hidden="true"
    >
      <svg
        width="16"
        height="10"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 6H16M16 6L11 1.5M16 6L11 10.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function GuidedTour({ steps, activeStepIndex, onStepSelect }: GuidedTourProps) {
  if (steps.length === 0) return null;

  const activeStep = steps[activeStepIndex] ?? steps[0];
  const canGoPrev = activeStepIndex > 0;
  const canGoNext = activeStepIndex < steps.length - 1;

  return (
    <section className="border-b border-border-soft bg-surface/20 px-4 py-4 md:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Guided Tour
          </p>
          <p className="mt-1 font-[family-name:var(--font-body-sc)] text-body text-muted">
            Recommended reading path
          </p>
        </div>
        <div className="tree-header-actions">
          <button
            type="button"
            className="tree-header-action"
            disabled={!canGoPrev}
            aria-label="Previous step"
            onClick={() => onStepSelect(activeStepIndex - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="tree-header-action"
            disabled={!canGoNext}
            aria-label="Next step"
            onClick={() => onStepSelect(activeStepIndex + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="flex min-w-min items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                className={`guided-tour-step shrink-0 px-3 py-1.5 font-mono text-meta uppercase tracking-wider transition-colors duration-200 ${
                  index === activeStepIndex
                    ? "guided-tour-step--active"
                    : "text-muted hover:text-text"
                }`}
                aria-current={index === activeStepIndex ? "step" : undefined}
                onClick={() => onStepSelect(index)}
              >
                {step.label}
              </button>
              {index < steps.length - 1 && <StepArrow />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border border-border-soft bg-bg/40 px-4 py-3">
        <p className="font-display text-body font-bold text-text">{activeStep.title}</p>
        <p className="mt-2 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
          {activeStep.description}
        </p>
        {activeStep.note && (
          <p className="mt-2 font-mono text-meta leading-relaxed text-muted">
            {activeStep.note}
          </p>
        )}
      </div>
    </section>
  );
}
