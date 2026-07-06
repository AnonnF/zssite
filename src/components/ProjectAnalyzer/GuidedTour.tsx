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
      className="flex shrink-0 items-center self-center px-0.5 text-muted/70"
      aria-hidden="true"
    >
      <svg
        width="12"
        height="8"
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
    <section className="guided-tour border-b border-border-soft px-4 py-2.5 md:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-meta uppercase tracking-wider text-muted">
          Guided Tour
          <span className="guided-tour__subtitle"> · Reading path</span>
        </p>
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

      <div className="mt-2 overflow-x-auto pb-0.5">
        <div className="flex min-w-min items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                className={`guided-tour-step shrink-0 px-2 py-1 font-mono text-meta uppercase tracking-wider transition-colors duration-200 ${
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

      <div className="guided-tour-detail mt-2 border-t border-border-soft/80 pt-2">
        <p className="guided-tour-detail__title font-display font-bold text-text">
          {activeStep.title}
        </p>
        <p className="guided-tour-detail__desc mt-1 font-[family-name:var(--font-body-sc)] leading-relaxed text-muted">
          {activeStep.description}
        </p>
        {activeStep.note && (
          <p className="mt-1 font-mono text-meta leading-relaxed text-muted/90">
            {activeStep.note}
          </p>
        )}
      </div>
    </section>
  );
}
