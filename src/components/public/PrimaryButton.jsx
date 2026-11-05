import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * PrimaryButton — Core industrial action button for OG Heavy Duty.
 * Styled with Brand Blue (#0f7ae0) and Deep Navy (#0B132B).
 */
export default function PrimaryButton({
  children,
  href,
  variant = "primary", // "primary" | "navy" | "dark" | "outline" | "white"
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
    primary:
      "bg-[#0f7ae0] text-white hover:bg-[#0c68c2] shadow-sm hover:shadow-md focus-visible:ring-[#0f7ae0]",
    orange: // Deprecated legacy alias mapped strictly to primary blue
      "bg-[#0f7ae0] text-white hover:bg-[#0c68c2] shadow-sm hover:shadow-md focus-visible:ring-[#0f7ae0]",
    navy:
      "bg-[#0B132B] text-white hover:bg-[#1C2541] shadow-sm hover:shadow-md focus-visible:ring-[#0B132B]",
    dark:
      "bg-[#111827] text-white hover:bg-[#1f2937] shadow-sm hover:shadow-md focus-visible:ring-[#111827]",
    outline:
      "bg-white text-[#0f7ae0] border border-[#0f7ae0] hover:bg-[#e8f2fc] focus-visible:ring-[#0f7ae0]",
    white:
      "bg-white text-[#0B132B] hover:bg-slate-100 shadow-sm hover:shadow focus-visible:ring-white",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-2 min-h-[36px] gap-1.5",
    md: "text-sm px-5 py-2.5 min-h-[44px] gap-2",
    lg: "text-base px-6 py-3.5 min-h-[50px] gap-2.5 font-semibold",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`;

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

