/**
 * SectionHeading — Standardized section header with industrial brand badge, title, and descriptor.
 *
 * @param {string} badge - Optional small uppercase pill badge or kicker (e.g. "ENGINEERING EXCELLENCE")
 * @param {string} title - Primary H2 heading text
 * @param {string} description - Descriptive paragraph text
 * @param {"center" | "left"} align - Text alignment
 * @param {"light" | "dark"} theme - "light" for white/gray backgrounds, "dark" for navy/black
 * @param {string} className - Additional CSS classes
 */
export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}) {
  const isDark = theme === "dark";
  const isCenter = align === "center";

  return (
    <div
      className={`mb-10 sm:mb-12 md:mb-16 ${
        isCenter ? "text-center max-w-3xl mx-auto" : "text-left max-w-2xl"
      } ${className}`}
    >
      {badge && (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 select-none ${
            isDark
              ? "bg-[#0f7ae0]/20 text-blue-400 border border-[#0f7ae0]/30"
              : "bg-[#e8f2fc] text-[#0f7ae0] border border-[#0f7ae0]/20"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0f7ae0]" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans tracking-tight mb-3 sm:mb-4 ${
            isDark ? "text-white" : "text-[#1a1a1a]"
          }`}
        >
          {title}
        </h2>
      )}

      {description && (
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isDark ? "text-slate-300" : "text-[#666666]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

