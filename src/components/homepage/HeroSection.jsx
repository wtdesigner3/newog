"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ThermometerSnowflake,
  Wind,
  Layers,
  ArrowRight,
  Download,
} from "lucide-react";
import { PageContainer, PrimaryButton, SecondaryButton } from "src/components/public";

export const SLIDES = [

  {
    id: "commercial-split-cassette",
    image: "/images/banner_ac_commercial.jpg",
    kicker: "Commercial & Corporate Climate Control",
    headingPart1: "Whisper-Quiet ",
    headingHighlight: "Precision Cooling",
    headingPart2: " for Modern Workspaces",
    description:
      "High-efficiency ceiling cassettes and inverter split systems engineered with hydrophilic blue fin coils and 4-way laminar airflow for corporate headquarters, luxury hotels, and hospitals.",
    primaryCta: { label: "Explore Split & Cassette AC", href: "/products/split-ac" },
    secondaryCta: { label: "Download PDF Catalog", href: "/uploads/OG Heavy Duty-updated.pdf", isDownload: true },
    badge: "100% Inner-Grooved Copper",
  },
  {
    id: "industrial-rooftop-ducted",
    image: "/images/banner_ac_industrial.jpg",
    kicker: "Central Ducted & Industrial Systems",
    headingPart1: "Robust High-Tonnage ",
    headingHighlight: "Industrial HVAC Chillers",
    headingPart2: " & Ducted Units",
    description:
      "Engineered for massive cooling loads across manufacturing hubs, server facilities, and commercial buildings with multi-stage compressor staging and 145V–285V voltage tolerance.",
    primaryCta: { label: "Consult HVAC Engineers", href: "#quote" },
    secondaryCta: { label: "View Technical Specs", href: "/resources" },
    badge: "Heavy-Gauge Anti-Rust Chassis",
  },
  {
    id: "tower-window-high-airflow",
    image: "/images/banner_ac_tower.jpg",
    kicker: "High-Capacity Tower & Window Systems",
    headingPart1: "Rapid High-Throw ",
    headingHighlight: "Airflow Circulation",
    headingPart2: " for Large Facilities",
    description:
      "Vertical floor-standing column towers and rugged window air conditioners delivering long-distance air throw for high-density auditoriums, banquet halls, and educational campuses.",
    primaryCta: { label: "Request Equipment Sizing", href: "#quote" },
    secondaryCta: { label: "Explore Window & Tower AC", href: "/products/window-ac" },
    badge: "Pan-India Support & Commissioning",
  },
];

export default function HeroSection({ initialSlide = 0, slides: propSlides }) {
  const activeSlides = (propSlides && propSlides.length > 0) ? propSlides : SLIDES;
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const totalSlides = activeSlides.length;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Deep-link query param support (e.g. /?slide=1)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("slide");
      if (param !== null && !isNaN(Number(param))) {
        const slideIdx = Math.max(0, Math.min(Number(param), totalSlides - 1));
        setCurrentSlide(slideIdx);
      }
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Continuous autorun: auto-advances every 5 seconds (5000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, totalSlides]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  const slide = activeSlides[currentSlide] || activeSlides[0];

  return (
    <section
      className="relative overflow-hidden bg-[#070D1F] text-white h-screen min-h-[100dvh] h-[100dvh] flex items-center"
      aria-label="OG Heavy Duty Featured Air Conditioning Showcase"
      aria-roledescription="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={s.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              aria-hidden={!isActive}
            >
              <Image
                src={s.image}
                alt={(s.headingPart1 || "") + (s.headingHighlight || "") + (s.headingPart2 || "")}
                fill
                priority={true}
                unoptimized={true}
                decoding="sync"
                className={`object-cover object-center ${
                  isActive ? "animate-kenburns" : "scale-100"
                }`}
                sizes="100vw"
              />

              {/* Reduced overlay gradient: left-side reading scrim, right side open & clearly visible */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070D1F]/80 via-[#070D1F]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D1F]/45 via-transparent to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Main Slide Content: Generous left padding to keep clear from edge & arrows */}
      <PageContainer
        size="wide"
        className="relative z-20 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-18 px-4 sm:pl-20 md:pl-24 lg:pl-28 pr-4 sm:pr-12 max-w-full overflow-hidden"
      >
        <div key={currentSlide} className="max-w-2xl lg:max-w-3xl">
          {/* Kicker Pill */}
          <div className="animate-hero-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/35 text-xs sm:text-[13px] font-bold tracking-wider uppercase text-blue-300 mb-5 sm:mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0f7ae0] animate-pulse" />
            <span>{slide.kicker || "Heavy-Duty Air Conditioning Systems"}</span>
          </div>

          {/* Heading with drop shadow for crisp readability over visible imagery */}
          <h1 className="animate-hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-extrabold font-heading tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] break-words">
            {slide.headingPart1}
            {slide.headingHighlight && (
              <span className="text-[#0f7ae0] drop-shadow-[0_2px_12px_rgba(15,122,224,0.4)]">
                {" " + slide.headingHighlight}
              </span>
            )}
            {slide.headingPart2 && (" " + slide.headingPart2)}
          </h1>

          {/* Subtitle with drop shadow */}
          <p className="animate-hero-desc mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-slate-100 leading-relaxed font-sans max-w-2xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            {slide.description}
          </p>

          {/* Call To Action Buttons */}
          <div className="animate-hero-cta mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none">
            {slide.primaryCta && (
              <PrimaryButton
                href={slide.primaryCta.href}
                variant="primary"
                size="lg"
                icon={true}
                className="shadow-xl shadow-blue-950/60 text-sm sm:text-base font-bold justify-center px-6 py-3 sm:py-3.5"
              >
                {slide.primaryCta.label}
              </PrimaryButton>
            )}

            {slide.secondaryCta && (
              slide.secondaryCta.isDownload ? (
                <a
                  href={slide.secondaryCta.href}
                  download
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm sm:text-base transition-all duration-200 backdrop-blur-md shadow-md text-center"
                >
                  <span>{slide.secondaryCta.label}</span>
                  <Download size={18} className="text-[#0f7ae0]" />
                </a>
              ) : (
                <SecondaryButton
                  href={slide.secondaryCta.href}
                  variant="white"
                  size="lg"
                  icon={true}
                  className="justify-center text-sm sm:text-base font-bold px-5 sm:px-6 py-3 sm:py-3.5"
                >
                  {slide.secondaryCta.label}
                </SecondaryButton>
              )
            )}
          </div>

          {/* Quality Badge Pill */}
          <div className="animate-hero-badge mt-7 sm:mt-8 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs sm:text-[13px] text-slate-200 backdrop-blur-md shadow-sm max-w-full">
            <ShieldCheck size={16} className="text-[#0f7ae0]" />
            <span className="font-semibold">{slide.badge || "100% Inner-Grooved Copper"}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Pan-India Industrial Support</span>
          </div>
        </div>
      </PageContainer>

      {/* Navigation Arrows: Hidden on small mobile to give 100% clean view, visible from sm up with safe margins */}
      <div className="hidden sm:flex absolute inset-y-0 left-3 sm:left-5 lg:left-6 right-3 sm:right-5 lg:right-6 z-30 items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#070D1F]/70 hover:bg-[#0f7ae0] border border-white/20 text-white transition-all duration-200 backdrop-blur-md shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0]"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#070D1F]/70 hover:bg-[#0f7ae0] border border-white/20 text-white transition-all duration-200 backdrop-blur-md shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0]"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center gap-2.5">
        {activeSlides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${isActive ? "w-8 bg-[#0f7ae0]" : "w-2.5 bg-white/40 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
