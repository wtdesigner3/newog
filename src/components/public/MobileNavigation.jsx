"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ChevronRight, Phone, Mail, FileText, ArrowRight } from "lucide-react";
import { PUBLIC_NAV_ITEMS } from "./DesktopNavigation";
import { MEGA_MENU_CATEGORIES } from "./ProductMegaMenu";
import PrimaryButton from "./PrimaryButton";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function MobileNavigation({
  isOpen,
  onClose,
  navItems = PUBLIC_NAV_ITEMS,
  logoSrc = "/images/og-logo.png",
  contactPhone = "011-35727834",
  contactEmail = "info@ogheavyduty.in",
  catalogueUrl = "/uploads/OG Heavy Duty-updated.pdf",
}) {
  const { openQuoteModal } = useQuoteModal();
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState({ Products: true });
  const [expandedProductCategory, setExpandedProductCategory] = useState({ "split-ac": true });

  const toggleProductCategory = (catSlug) => {
    setExpandedProductCategory((prev) => ({
      ...prev,
      [catSlug]: !prev[catSlug],
    }));
  };

  // Close drawer on route navigation
  useEffect(() => {
    if (isOpen) onClose();
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const toggleCategory = (label) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <Link href="/" onClick={onClose} className="inline-block">
            <Image
              src={logoSrc}
              alt="OG Heavy Duty"
              width={140}
              height={45}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {navItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isExpanded = Boolean(expandedCategories[item.label]);
            const active =
              (item.href === "/" && pathname === "/") ||
              (item.href !== "/" && pathname.startsWith(item.href)) ||
              (item.children && item.children.some((c) => pathname.startsWith(c.href)));

            if (hasChildren) {
              return (
                <div key={item.label} className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleCategory(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors min-h-[44px] ${
                      active
                        ? "text-[#0f7ae0] bg-blue-50/70"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={19}
                      strokeWidth={2.4}
                      className={`transition-all duration-200 ${
                        isExpanded ? "rotate-180 text-[#0f7ae0]" : "text-slate-700"
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded && (
                    <div className="pl-3 pr-1 py-1 mt-1 space-y-1.5 border-l-2 border-slate-200 ml-3">
                      {item.label === "Products" ? (
                        <>
                          {MEGA_MENU_CATEGORIES.map((category) => {
                            const isCatOpen = Boolean(expandedProductCategory[category.slug]);
                            const Icon = category.icon;

                            return (
                              <div key={category.slug} className="rounded-lg bg-slate-50/80 border border-slate-100 overflow-hidden">
                                <div className="flex items-center justify-between px-2.5 py-2">
                                  <Link
                                    href={`/products/${category.slug}`}
                                    onClick={onClose}
                                    className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#0f7ae0] flex-1 truncate"
                                  >
                                    <Icon size={14} className="text-[#0f7ae0] shrink-0" />
                                    <span className="truncate">{category.name}</span>
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => toggleProductCategory(category.slug)}
                                    className="p-1 text-slate-400 hover:text-[#0f7ae0] rounded"
                                    aria-label={`Toggle ${category.name} subcategories`}
                                  >
                                    <ChevronDown
                                      size={16}
                                      strokeWidth={2.2}
                                      className={`transition-all duration-200 ${
                                        isCatOpen ? "rotate-180 text-[#0f7ae0]" : "text-slate-600"
                                      }`}
                                    />
                                  </button>
                                </div>

                                {isCatOpen && (
                                  <div className="px-3 pb-2 pt-0.5 space-y-1 border-t border-slate-100 bg-white">
                                    {category.subcategories.map((sub) => (
                                      <Link
                                        key={sub.slug}
                                        href={`/products/${category.slug}`}
                                        onClick={onClose}
                                        className="block py-1.5 px-2 text-[11px] text-slate-600 hover:text-[#0f7ae0] rounded font-medium truncate"
                                      >
                                        • {sub.name}
                                      </Link>
                                    ))}
                                    <Link
                                      href={`/products/${category.slug}`}
                                      onClick={onClose}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f7ae0] pt-1"
                                    >
                                      <span>View All {category.shortName}</span>
                                      <ChevronRight size={11} />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={`block px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[38px] flex items-center ${
                                childActive
                                  ? "text-[#0f7ae0] font-semibold bg-blue-50/80"
                                  : "text-slate-600 hover:text-[#0f7ae0] hover:bg-slate-50"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })
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
                onClick={onClose}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors min-h-[44px] ${
                  active
                    ? "text-[#0f7ae0] bg-blue-50/70"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600">
            <a
              href={`tel:${contactPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 py-1 hover:text-[#0f7ae0] transition-colors"
            >
              <Phone size={14} className="text-[#0f7ae0]" />
              <span>{contactPhone}</span>
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 py-1 hover:text-[#0f7ae0] transition-colors"
            >
              <Mail size={14} className="text-[#0f7ae0]" />
              <span>{contactEmail}</span>
            </a>
          </div>

          <div className="pt-2 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                openQuoteModal({ enquiryType: "Commercial / Project Quotation" });
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Get a Quote</span>
              <ArrowRight size={14} />
            </button>

            {catalogueUrl && (
              <a
                href={catalogueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors min-h-[40px]"
              >
                <FileText size={14} className="text-[#0f7ae0]" />
                <span>Download Catalogue</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

