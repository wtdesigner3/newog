"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import ProductMegaMenu from "./ProductMegaMenu";

/**
 * Verified navigation items based on actual OG Heavy Duty structure.
 */
export const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Products",
    href: "/products/split-ac",
    children: [
      {
        label: "Window Air Conditioners",
        href: "/products/window-ac",
        description: "Heavy-duty window AC units engineered for severe ambient cooling up to 50°C",
      },
      {
        label: "Split Air Conditioners",
        href: "/products/split-ac",
        description: "High-efficiency inverter & fixed-speed heavy-duty split cooling systems",
      },
      {
        label: "Cassette Air Conditioners",
        href: "/products/cassette-ac",
        description: "Ceiling-recessed 4-way airflow cooling for commercial offices and retail",
      },
      {
        label: "Floor Standing / Tower AC",
        href: "/products/floor-standing-ac",
        description: "High-tonnage vertical tower units for commercial halls and banquet spaces",
      },
      {
        label: "Ductable Air Conditioners",
        href: "/products/ductable-ac",
        description: "Central ducted systems for institutions, hospitals, and large commercial spaces",
      },
    ],
  },
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
  }, [pathname]);

  const isItemActive = (item) => {
    if (item.href === "/" && pathname === "/") return true;
    if (item.href !== "/" && pathname.startsWith(item.href)) return true;
    if (item.children && item.children.some((c) => pathname.startsWith(c.href))) return true;
    return false;
  };

  return (
    <nav
      className="hidden lg:flex items-center gap-3 xl:gap-5"
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
              <button
                type="button"
                className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] xl:text-[14px] font-semibold tracking-normal rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
                  active || isOpen
                    ? "text-[#0f7ae0] bg-blue-50/80 border border-blue-200/60 font-bold shadow-xs"
                    : "text-slate-800 hover:text-[#0f7ae0] hover:bg-white/60 hover:shadow-2xs"
                }`}
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.4}
                  className={`transition-all duration-200 shrink-0 ${
                    isOpen
                      ? "rotate-180 text-[#0f7ae0]"
                      : active
                      ? "text-[#0f7ae0]"
                      : "text-slate-700 group-hover:text-[#0f7ae0]"
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Mega Dropdown Panel */}
              {isOpen && (
                <div
                  className={`absolute top-full pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    item.label === "Products"
                      ? "left-1/2 -translate-x-1/2 w-auto pointer-events-auto"
                      : "left-1/2 -translate-x-1/2 w-[460px]"
                  }`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  {item.label === "Products" ? (
                    <ProductMegaMenu onClose={() => setOpenDropdown(null)} />
                  ) : (
                    <div className="bg-white/85 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80 overflow-hidden p-3 divide-y divide-slate-100/80">
                      <div className="grid grid-cols-1 gap-1">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              role="menuitem"
                              className={`group flex flex-col p-2.5 rounded-xl transition-all duration-150 ${
                                childActive
                                  ? "bg-blue-50/80 border-l-3 border-[#0f7ae0]"
                                  : "hover:bg-slate-50 hover:translate-x-0.5"
                              }`}
                            >
                              <span
                                className={`text-sm font-semibold tracking-wide ${
                                  childActive
                                    ? "text-[#0f7ae0]"
                                    : "text-slate-900 group-hover:text-[#0f7ae0]"
                                }`}
                              >
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 text-[12.5px] xl:text-[13.5px] font-semibold tracking-normal rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
              active
                ? "text-[#0f7ae0] bg-blue-50/80 border border-blue-200/60 font-bold shadow-xs"
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

