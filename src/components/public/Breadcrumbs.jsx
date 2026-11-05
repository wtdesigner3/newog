import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumbs — Accessible, schema-compliant breadcrumb navigation component.
 *
 * @param {Array<{ label: string, href?: string }>} items
 * @param {string} className
 * @param {string} theme - "light" (on white/muted) | "dark" (on dark/navy banners)
 */
export default function Breadcrumbs({
  items = [],
  className = "",
  theme = "light",
}) {
  if (!items || items.length === 0) return null;

  const isDark = theme === "dark";

  // Filter out leading "Home" item if provided to avoid duplicate "Home > Home"
  const normalizedItems = items.filter(
    (item, idx) => !(idx === 0 && (item.label?.toLowerCase() === "home" || item.href === "/"))
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-sm font-sans ${className}`}
    >
      <ol
        className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home Item */}
        <li
          className="inline-flex items-center"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            className={`inline-flex items-center gap-1 transition-colors duration-150 ${
              isDark
                ? "text-slate-300 hover:text-white"
                : "text-slate-500 hover:text-[#0f7ae0]"
            }`}
            itemProp="item"
          >
            <Home size={14} className="shrink-0" aria-hidden="true" />
            <span itemProp="name" className="sr-only sm:not-sr-only">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {normalizedItems.map((item, index) => {
          const isLast = index === normalizedItems.length - 1;
          const position = index + 2;

          return (
            <li
              key={index}
              className="inline-flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight
                size={14}
                className={`mx-1 shrink-0 ${
                  isDark ? "text-slate-400" : "text-slate-400"
                }`}
                aria-hidden="true"
              />

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`transition-colors duration-150 ${
                    isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-[#0f7ae0]"
                  }`}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                  itemProp="name"
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

