"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Wind,
} from "lucide-react";
import { PageContainer } from "src/components/public";
import ProductCard from "../catalog/ProductCard";
import { VERIFIED_PRODUCTS } from "src/lib/catalogData";

export const FILTER_TABS = [
  { id: "all", label: "All Models" },
  { id: "split-ac", label: "Split AC" },
  { id: "window-ac", label: "Window AC" },
  { id: "cassette-ac", label: "Cassette AC" },
  { id: "floor-standing-ac", label: "Tower AC" },
  { id: "ductable-ac", label: "Ductable AC" },
  { id: "commercial-range", label: "Survivor Range" },
];

export default function CategoryShowcase({ products: propProducts, badge, title, subtitle }) {
  const allProducts = propProducts && propProducts.length > 0 ? propProducts : VERIFIED_PRODUCTS;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isHovered, setIsHovered] = useState(false);

  // Mouse drag-to-scroll refs & state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDraggingState(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(x - startXRef.current) > 5) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  };

  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const filteredProducts =
    activeFilter === "all"
      ? allProducts
      : allProducts.filter((p) => p.categorySlug === activeFilter);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredProducts]);

  // Autoplay functionality: advances every 4s and pauses on mouse hover / dragging
  useEffect(() => {
    if (isHovered || isDraggingState) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const cardWidth = 350;

      // Loop back smoothly to start if at the end of the carousel
      if (scrollLeft >= scrollWidth - clientWidth - 25) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, isDraggingState, filteredProducts]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 350;
    const delta = direction === "left" ? -cardWidth : cardWidth;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section
      id="products"
      className="relative overflow-hidden py-[60px] bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] text-slate-900 border-b border-slate-200/90"
    >
      {/* Air Conditioning Ambience & Dynamic Frost Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-sky-400/8 rounded-full blur-[120px] pointer-events-none" />

      <PageContainer>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0f7ae0] border border-blue-200/80 mb-4 shadow-xs">
              <Wind size={13} className="text-[#0f7ae0]" />
              <span>{badge || "HEAVY-DUTY HVAC CLASSIFICATIONS"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight leading-[1.15]">
              {title || (
                <>Our Complete <span className="text-[#0f7ae0]">Product Range</span></>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-sans">
              {subtitle || "From severe high-ambient window and split units built for 52°C tropical heatwaves to commercial ceiling cassettes, high-throw towers, and central ductables."}
            </p>
          </div>

          {/* Top Right Controls: Download Catalogue Button + Carousel Navigation */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            <a
              href="/uploads/OG Heavy Duty-updated.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#0f7ae0] text-slate-800 hover:text-white border border-slate-300 shadow-2xs hover:shadow-md font-bold text-xs sm:text-sm transition-all duration-200 group active:scale-95"
            >
              <Download size={16} className="text-[#0f7ae0] group-hover:text-white transition-colors" />
              <span>Download Spec Sheet</span>
            </a>

            <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] cursor-pointer"
                aria-label="Previous products"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] cursor-pointer"
                aria-label="Next products"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills for Quick Classification */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = tab.id === "all" ? allProducts.length : allProducts.filter(p => p.categorySlug === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0f7ae0] text-white shadow-md shadow-blue-500/25"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Horizontal Carousel Track with Native Mouse Drag-to-Scroll & Auto-Play */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUpOrLeave();
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onClickCapture={handleClickCapture}
          className={`flex gap-5 sm:gap-6 overflow-x-auto pb-8 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDraggingState
              ? "cursor-grabbing select-none scroll-auto"
              : "cursor-grab scroll-smooth snap-x snap-mandatory"
          }`}
        >
          {filteredProducts.map((prod) => (
            <div
              key={prod.slug || prod._id}
              className="snap-start shrink-0 w-[285px] sm:w-[325px] lg:w-[350px] flex flex-col"
            >
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
