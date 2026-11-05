/**
 * PageContainer — Standardized responsive container for OG Heavy Duty public pages.
 * Guarantees aligned max-widths and consistent horizontal gutter padding across breakpoints.
 */
export default function PageContainer({
  children,
  className = "",
  size = "default", // "narrow" (1024px) | "default" (1280px) | "wide" (1400px) | "full"
  as: Component = "div",
  ...props
}) {
  const sizeMap = {
    narrow: "max-w-5xl",
    default: "max-w-7xl",
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeMap[size] || sizeMap.default} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

