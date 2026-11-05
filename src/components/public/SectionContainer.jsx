/**
 * SectionContainer — Semantic section wrapper establishing vertical rhythm and thematic backgrounds.
 * Standardized to 60px vertical padding (py-[60px]) across the entire site for visual consistency.
 */
export default function SectionContainer({
  children,
  id,
  className = "",
  variant = "white", // "white" | "muted" | "dark" | "blue" | "transparent"
  padding = "default", // "none" | "default" | "sm" | "md" | "lg"
  as: Component = "section",
  ...props
}) {
  const variantStyles = {
    white: "bg-white text-slate-900",
    muted: "bg-[#f8f9fa] text-slate-900 border-y border-slate-200/70",
    dark: "bg-[#111827] text-white border-y border-slate-800",
    blue: "bg-[#0f7ae0] text-white",
    transparent: "bg-transparent",
  };

  const paddingStyles = {
    none: "py-0",
    sm: "py-[60px]",
    md: "py-[60px]",
    lg: "py-[60px]",
    default: "py-[60px]",
  };

  return (
    <Component
      id={id}
      className={`relative w-full ${variantStyles[variant] || variantStyles.white} ${paddingStyles[padding] || paddingStyles.default} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
