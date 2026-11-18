"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ArrowRight } from "lucide-react";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function PublicHeader({
  settings = null,
  logoSrc = "/images/og-logo-black-medium-2x.png",
}) {
  const { openQuoteModal } = useQuoteModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verified brand data fallbacks
  const primaryPhone = settings?.primaryPhone || "011-35727834";
  const primaryEmail = settings?.primaryEmail || "info@ogheavyduty.in";
  // High-legibility, readable black-text logo variant for the solid white header
  const logo = "/images/og-logo-black-readable-2x.png";
  const catalogueUrl = settings?.pdf1Url || "/uploads/OG Heavy Duty-updated.pdf";

  return (
    <header className="fixed top-2.5 sm:top-3 inset-x-0 z-50 px-3 sm:px-6 lg:px-8 pointer-events-none select-none transition-all duration-300">
      {/* ─── Slim Floating Island Pill Capsule (Solid Pure White Background) ─── */}
      <div
        className={`pointer-events-auto mx-auto w-full max-w-7xl rounded-full transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-1.5 sm:py-2 bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] ${isScrolled
          ? "shadow-[0_12px_36px_rgba(0,0,0,0.14)] scale-[0.99] border-slate-300"
          : ""
          }`}
      >
        {/* Brand Logo - Generous, Crisp & Ultra-Legible Black Text Subtitle */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] rounded-full pl-0.5 sm:pl-1 pr-1.5"
          aria-label="OG Heavy Duty Homepage"
        >
          <Image
            src={logo}
            alt="OG Heavy Duty Air Conditioners"
            width={280}
            height={125}
            className="h-12 sm:h-14 md:h-16 lg:h-[66px] w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
            style={{ maxHeight: "66px", width: "auto" }}
            priority
          />
        </Link>

        {/* Center Desktop Navigation - 6 Primary Links with Enhanced Font Size */}
        <DesktopNavigation />

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Substantial, Balanced & Modern Rounded Pill Button ("Get a Quote") */}
          <button
            type="button"
            onClick={() => openQuoteModal({ enquiryType: "Commercial / Project Quotation" })}
            className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-[13.5px] font-bold text-white bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#0d6ecb] hover:to-[#0855a3] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_14px_rgba(15,122,224,0.38)] hover:shadow-[0_6px_20px_rgba(15,122,224,0.48)] border border-blue-400/30 transition-all duration-200 active:scale-95 group tracking-wide cursor-pointer"
          >
            <span>Get a Quote</span>
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-slate-700 hover:text-[#0f7ae0] hover:bg-slate-100 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0]"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ─── Mobile Slide-out Drawer ──────────────────────────────────── */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        logoSrc={logo}
        contactPhone={primaryPhone}
        contactEmail={primaryEmail}
        catalogueUrl={catalogueUrl}
      />
    </header>
  );
}
