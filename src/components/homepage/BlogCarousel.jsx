"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowIcon,
  ArrowRight,
} from "lucide-react";

export default function BlogCarousel({ blogs = [] }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

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
  }, [blogs]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 380;
    const delta = direction === "left" ? -cardWidth : cardWidth;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollContainerRef.current) return;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDraggingState(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    dragDistanceRef.current = Math.abs(walk);
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
  };

  const handleCardClick = (e) => {
    if (dragDistanceRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative">
      {/* Top Right Navigation Controls (Integrated alongside section header) */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Showing {blogs.length} Engineering Articles
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Link
            href="/blogs"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:shadow-sm font-bold text-xs sm:text-sm transition-all duration-200 group active:scale-95"
          >
            <span>All Articles</span>
            <ArrowRight size={14} className="text-[#0f7ae0] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Previous blog articles"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Next blog articles"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Blog Carousel Track */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex gap-6 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDraggingState
            ? "cursor-grabbing select-none scroll-auto"
            : "cursor-grab scroll-smooth snap-x snap-mandatory"
        }`}
      >
        {blogs.map((blog) => (
          <article
            key={blog.id || blog.slug}
            className="group snap-start shrink-0 w-[290px] sm:w-[350px] lg:w-[380px] flex flex-col rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(15,122,224,0.18)] hover:border-[#0f7ae0]/60 transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            {/* Card Image Container */}
            <Link
              href={`/blogs/${blog.slug}`}
              onClickCapture={handleCardClick}
              className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 block"
            >
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
                sizes="(max-width: 768px) 300px, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

              {/* Category Pill on Image */}
              <div className="absolute top-3.5 left-3.5 pointer-events-none">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/95 backdrop-blur-md text-[#0f7ae0] shadow-sm border border-white/50">
                  {blog.category}
                </span>
              </div>
            </Link>

            {/* Card Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Meta: Date & Read Time */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#0f7ae0]" />
                    <span>{blog.date}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    <span>{blog.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors line-clamp-2 leading-snug mb-2.5">
                  <Link href={`/blogs/${blog.slug}`} onClickCapture={handleCardClick}>
                    {blog.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-2 leading-relaxed font-sans mb-5">
                  {blog.excerpt}
                </p>
              </div>

              {/* Bottom Read Action Link */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/blogs/${blog.slug}`}
                  onClickCapture={handleCardClick}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f7ae0] group-hover:text-[#0a4b8a] transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowIcon size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-[11px] font-semibold text-slate-400">
                  OG Engineering
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

