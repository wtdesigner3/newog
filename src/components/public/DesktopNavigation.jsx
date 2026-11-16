"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * 2-Tier Header Navigation based on client requirements:
 * Top-level: Domestic AC, Light Commercial AC, Blogs, About Us, FAQs, Contact
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
        series: [
          { label: "Fixed speed series", href: "/products/domestic-ac/window-ac?tech=fixed-speed" },
          { label: "Variable speed series", href: "/products/domestic-ac/window-ac?tech=variable-speed" },
        ],
      },
      {
        label: "Split Hi-Wall Air Conditioner",
        href: "/products/domestic-ac/split-ac",
        series: [
          { label: "Fixed speed series", href: "/products/domestic-ac/split-ac?tech=fixed-speed" },
          { label: "Variable speed series", href: "/products/domestic-ac/split-ac?tech=variable-speed" },
        ],
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
        series: [
          { label: "Fixed speed series", href: "/products/light-commercial-ac/four-way-cassette-ac?tech=fixed-speed" },
        ],
      },
      {
        label: "Ductable AC",
        href: "/products/light-commercial-ac/ductable-ac",
        series: [
          { label: "Fixed speed series", href: "/products/light-commercial-ac/ductable-ac?tech=fixed-speed" },
        ],
      },
      {
        label: "One-Way Cassette AC",
        href: "/products/light-commercial-ac/one-way-cassette-ac",
        series: [
          { label: "Fixed speed series", href: "/products/light-commercial-ac/one-way-cassette-ac?tech=fixed-speed" },
        ],
      },
      {
        label: "Floor Standing (Tower) AC",
        href: "/products/light-commercial-ac/floor-standing-ac",
        series: [
          { label: "Fixed speed series", href: "/products/light-commercial-ac/floor-standing-ac?tech=fixed-speed" },
        ],
      },
      {
        label: "Survivor AC",
        href: "/products/light-commercial-ac/survivor-ac",
        series: [
          { label: "Fixed speed series", href: "/products/light-commercial-ac/survivor-ac?tech=fixed-speed" },
        ],
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
  const [hoveredSub, setHoveredSub] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (label) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredSub(null);
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setHoveredSub(null);
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
                  setHoveredSub(null);
                }
              }}
            >
              <Link
                href={item.href}
                className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] xl:text-[14px] font-semibold tracking-normal rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
                  active || isOpen
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

              {/* ── Subcategory Dropdown Panel with Blue Top Border ── */}
              {isOpen && (
                <div
                  className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="bg-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] border border-slate-200/90 rounded-b-md border-t-[3px] border-t-[#0f7ae0] min-w-[240px] py-1.5">
                    {item.children.map((child) => {
                      const isHovered = hoveredSub === child.label;
                      const isChildActive = pathname.startsWith(child.href);

                      return (
                        <div
                          key={child.label}
                          className="relative group/sub"
                          onMouseEnter={() => setHoveredSub(child.label)}
                        >
                          <Link
                            href={child.href}
                            role="menuitem"
                            className={`flex items-center justify-between px-4 py-2.5 text-[13.5px] font-medium transition-colors ${
                              isHovered || isChildActive
                                ? "text-[#0f7ae0] bg-blue-50/50 font-bold"
                                : "text-slate-800 hover:text-[#0f7ae0] hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {isHovered && (
                                <span className="text-[#0f7ae0] font-black text-sm">
                                  —
                                </span>
                              )}
                              <span>{child.label}</span>
                            </span>
                            {child.series && child.series.length > 0 && (
                              <ChevronRight
                                size={14}
                                className={`transition-transform duration-150 ${
                                  isHovered
                                    ? "text-[#0f7ae0] translate-x-0.5"
                                    : "text-slate-400 group-hover/sub:text-[#0f7ae0]"
                                }`}
                              />
                            )}
                          </Link>

                          {/* ── Sub-Series Flyout to the Right with Blue Top Border ── */}
                          {child.series && child.series.length > 0 && isHovered && (
                            <div className="absolute left-full top-0 ml-1 z-50 animate-in fade-in slide-in-from-left-1 duration-150">
                              <div className="bg-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] border border-slate-200/90 rounded-b-md border-t-[3px] border-t-[#0f7ae0] min-w-[210px] py-1.5">
                                {child.series.map((s) => (
                                  <Link
                                    key={s.label}
                                    href={s.href}
                                    role="menuitem"
                                    className="block px-4 py-2.5 text-[13px] font-medium text-slate-700 hover:text-[#0f7ae0] hover:bg-blue-50/40 transition-colors whitespace-nowrap"
                                  >
                                    {s.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
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
