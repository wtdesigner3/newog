"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * 2-Tier Header Navigation based on client requirements:
 * Top-level: Domestic AC, Light Commercial AC, Blogs, About Us, FAQs, Contact
 * Dropdown shows ONLY subcategories (no 3rd tier / sub-sub flyout).
 */
export const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Domestic AC",
    href: "/products/domestic-ac",
    children: [
      {
        label: "Window AC",
        href: "/products/domestic-ac/window-ac",
      },
      {
        label: "Split Hi-Wall Air Conditioner",
        href: "/products/domestic-ac/split-ac",
      },
    ],
  },
  {
    label: "Light Commercial AC",
    href: "/products/light-commercial-ac",
    children: [
      {
        label: "Four Way Cassette AC",
        href: "/products/light-commercial-ac/four-way-cassette-ac",
      },
      {
        label: "Ductable AC",
        href: "/products/light-commercial-ac/ductable-ac",
      },
      {
        label: "One-Way Cassette AC",
        href: "/products/light-commercial-ac/one-way-cassette-ac",
      },
      {
        label: "Floor Standing (Tower) AC",
        href: "/products/light-commercial-ac/floor-standing-ac",
      },
      {
        label: "Survivor AC",
        href: "/products/light-commercial-ac/survivor-ac",
      },
    ],
  },
  { label: "About Us", href: "/about-us" },
  { label: "Blogs", href: "/blogs" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function DesktopNavigation({ navItems = PUBLIC_NAV_ITEMS }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (label) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const isItemActive = (item) => {
    if (item.href === "/" && pathname === "/") return true;
    if (item.href !== "/" && pathname.startsWith(item.href)) return true;
    if (item.children && item.children.some((c) => pathname.startsWith(c.href))) return true;
    return false;
  };

  return (
    <nav
      className="hidden lg:flex items-center gap-1.5 xl:gap-3"
      aria-label="Main Navigation"
    >
      {navItems.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const active = isItemActive(item);
        const isOpen = openDropdown === item.label;

        if (hasChildren) {
          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => handleMouseEnter(item.label)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setOpenDropdown(null);
                }
              }}
            >
              {/* Category Nav Button / Link */}
              <Link
                href={item.href}
                className={`group flex items-center gap-1 px-3 py-1.5 text-[13px] xl:text-[14px] font-semibold tracking-normal rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
                  isOpen
                    ? "text-[#0f7ae0] bg-blue-50/90 shadow-2xs font-bold"
                    : active
                    ? "text-[#0f7ae0] bg-blue-50/80 border border-blue-200/60 font-bold shadow-2xs"
                    : "text-slate-800 hover:text-[#0f7ae0] hover:bg-white/60 hover:shadow-2xs"
                }`}
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={15}
                  strokeWidth={2.4}
                  className={`transition-all duration-200 shrink-0 ${
                    isOpen
                      ? "rotate-180 text-[#0f7ae0]"
                      : active
                      ? "text-[#0f7ae0]"
                      : "text-slate-600 group-hover:text-[#0f7ae0]"
                  }`}
                  aria-hidden="true"
                />
              </Link>

              {/* ── Subcategory Dropdown Panel with Sleek Industrial Top Accent (NO 3rd tier flyout) ── */}
              {isOpen && (
                <div
                  className="absolute top-full left-0 pt-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="bg-white shadow-[0_20px_40px_-10px_rgba(15,23,42,0.18)] border border-slate-200/90 rounded-xl border-t-[3px] border-t-[#0f7ae0] min-w-[270px] p-1.5 overflow-hidden">
                    {item.children.map((child) => {
                      const isChildActive = pathname.startsWith(child.href);

                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          role="menuitem"
                          className={`group/item flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all ${
                            isChildActive
                              ? "text-[#0f7ae0] bg-blue-50/80 font-bold"
                              : "text-slate-800 hover:text-[#0f7ae0] hover:bg-slate-50/90"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                isChildActive
                                  ? "bg-[#0f7ae0] scale-125"
                                  : "bg-slate-300 group-hover/item:bg-[#0f7ae0] group-hover/item:scale-125"
                              }`}
                              aria-hidden="true"
                            />
                            <span className="transition-transform duration-150 group-hover/item:translate-x-0.5">
                              {child.label}
                            </span>
                          </span>

                          <ChevronRight
                            size={14}
                            strokeWidth={2.4}
                            className={`shrink-0 transition-all duration-200 ${
                              isChildActive
                                ? "text-[#0f7ae0] opacity-100 translate-x-0"
                                : "text-slate-400 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:text-[#0f7ae0] group-hover/item:translate-x-0"
                            }`}
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 text-[13px] xl:text-[14px] font-semibold tracking-normal rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
              active
                ? "text-[#0f7ae0] bg-blue-50/80 border border-blue-200/60 font-bold shadow-2xs"
                : "text-slate-800 hover:text-[#0f7ae0] hover:bg-white/60 hover:shadow-2xs"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
