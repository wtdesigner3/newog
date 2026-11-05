import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * SecondaryButton — Secondary / outline industrial button for OG Heavy Duty.
 */
export default function SecondaryButton({
  children,
  href,
  variant = "outline", // "outline" | "ghost" | "white" | "orange-outline"
  size = "md", // "sm" | "md" | "lg"
  icon = false,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  target,
  rel,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium font-sans tracking-wide transition-all duration-200 select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

  const variantStyles = {
    outline:
      "border border-[#0f7ae0] text-[#0f7ae0] bg-transparent hover:bg-[#0f7ae0]/10 focus-visible:ring-[#0f7ae0]",
    "orange-outline": // Deprecated legacy alias mapped strictly to brand blue outline
      "border border-[#0f7ae0] text-[#0f7ae0] bg-transparent hover:bg-[#0f7ae0]/10 focus-visible:ring-[#0f7ae0]",
    white:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm focus-visible:ring-[#0f7ae0]",
    ghost:
      "text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-[#0f7ae0]",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-2 min-h-[36px] gap-1.5",
    md: "text-sm px-4 py-2.5 min-h-[44px] gap-2",
    lg: "text-base px-6 py-3.5 min-h-[50px] gap-2.5 font-semibold",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.outline} ${sizeStyles[size] || sizeStyles.md} ${className}`;

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "boolean") {
      return (
        <ArrowRight
          size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
          className="transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      );
    }
    return icon;
  };

  if (href && !disabled) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || target === "_blank";

    if (isExternal) {
      return (
        <a
          href={href}
          target={target || (href.startsWith("http") ? "_blank" : undefined)}
          rel={rel || (href.startsWith("http") ? "noopener noreferrer" : undefined)}
          className={`group ${combinedClasses}`}
          onClick={onClick}
          {...props}
        >
          <span>{children}</span>
          {renderIcon()}
        </a>
      );
    }

    return (
      <Link href={href} className={`group ${combinedClasses}`} onClick={onClick} {...props}>
        <span>{children}</span>
        {renderIcon()}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`group ${combinedClasses}`}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      {renderIcon()}
    </button>
  );
}

