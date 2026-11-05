import { AlertTriangle, ArrowLeft, Home, Search } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

/**
 * NotFoundState — Standardized empty state and 404 message for OG Heavy Duty.
 */
export default function NotFoundState({
  title = "Page Not Found",
  description = "The requested specification sheet, model catalog, or page could not be located or may have been updated.",
  code = "404",
  actionText = "Back to Homepage",
  actionHref = "/",
  secondaryActionText = "Browse Products",
  secondaryActionHref = "/products/split-ac",
  className = "",
}) {
  return (
    <div
      className={`min-h-[420px] w-full flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {code && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0f7ae0] border border-blue-200 mb-4">
          <AlertTriangle size={14} className="shrink-0" />
          <span>Error {code}</span>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold font-sans text-[#1a1a1a] tracking-tight mb-3 max-w-xl">
        {title}
      </h1>

      <p className="text-sm sm:text-base text-[#666666] max-w-lg mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionHref && (
          <PrimaryButton href={actionHref} icon={<Home size={16} />}>
            {actionText}
          </PrimaryButton>
        )}
        {secondaryActionHref && (
          <SecondaryButton href={secondaryActionHref} icon={<Search size={16} />}>
            {secondaryActionText}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}

