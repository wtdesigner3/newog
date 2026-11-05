"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

/**
 * RelatedProductsCarousel — Interactive, touch-and-drag enabled carousel for related HVAC products.
 * Includes smooth arrow controls, responsive card sizing, and scroll-snap alignment.
 */
export default function RelatedProductsCarousel({
  products = [],
  categoryName = "Air Conditioners",
  categorySlug = "split-ac",
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

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
  }, [products, checkScroll]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    // Step by approximately one card width + gap (approx 340px + 24px = 364px)
    const cardStep = 364;
    const delta = direction === "left" ? -cardStep : cardStep;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollContainerRef.current) return;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    dragDistanceRef.current = Math.abs(walk);
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClickCapture = (e) => {
    // If the user was dragging the slider, prevent firing the link click
    if (dragDistanceRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="pt-10 border-t border-slate-200">
      {/* Carousel Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0f7ae0] block mb-1">
            Alternative Capacities &amp; Heavy-Duty Range
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
            Related {categoryName?.replace("Air Conditioners", "AC") || "Heavy-Duty"} Systems
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Explore {products.length} calibrated tropical cooling configurations engineered for severe ambient heat.
          </p>
        </div>

        {/* Carousel Action & Arrow Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/products/${categorySlug}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0f7ae0] shadow-2xs font-bold text-xs transition-colors"
          >
            <span>All {categoryName?.replace("Air Conditioners", "AC")}</span>
            <ArrowRight size={13} />
          </Link>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "border-slate-300 bg-white text-slate-800 hover:border-[#0f7ae0] hover:bg-[#0f7ae0] hover:text-white shadow-2xs active:scale-95 cursor-pointer"
                  : "border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed opacity-60"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                canScrollRight
                  ? "border-slate-300 bg-white text-slate-800 hover:border-[#0f7ae0] hover:bg-[#0f7ae0] hover:text-white shadow-2xs active:scale-95 cursor-pointer"
                  : "border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed opacity-60"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClickCapture={handleCardClickCapture}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {products.map((item) => (
            <div
              key={item.slug}
              className="snap-start w-[275px] sm:w-[315px] lg:w-[340px] shrink-0 flex flex-col"
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

