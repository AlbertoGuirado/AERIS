import { HardHat } from "lucide-react";

const clampDetailLevel = (value) => {
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber)) return 3;
  return Math.min(Math.max(Math.trunc(asNumber), 1), 3);
};

export const Building = ({ className = "", detailLevel = 3 }) => {
  const level = clampDetailLevel(detailLevel);
  const showCore = level >= 1;
  const showExpanded = level >= 2;
  const showProgress = level >= 3;
  const labelColor =
    level === 1 ? "text-primary" : "text-primary/80";

  return (
    <section className={`w-full ${className}`}>
      <div className="w-full rounded-3xl border border-dashed border-primary/40 bg-background/60 p-6 text-center shadow-2xl backdrop-blur sm:p-8">
        {showCore && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-16 sm:w-16">
              <HardHat className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <p
              className={`mt-5 text-xs uppercase tracking-[0.35em] ${labelColor}`}
            >
              Section under construction
            </p>
          </>
        )}

        {showExpanded && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
              We are assembling this module
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              We are finishing the last adjustments. Check back soon to explore the
              full module with live mission data.
            </p>
          </>
        )}

        {showProgress && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border/60 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground sm:mt-8 sm:px-5 sm:py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
            Build in progress
          </div>
        )}
      </div>
    </section>
  );
};
