"use client";

import { useRef, useState, useEffect } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { PageContainer } from "src/components/public";

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Rajesh Malhotra",
    role: "Managing Director",
    company: "Grand Imperial Banquets, Delhi NCR",
    equipment: "5.0 Ton Heavy-Duty Tower ACs",
    highlight: "14-Hour Continuous 50°C Run",
    stars: 5,
    quote:
      "During the severe 50°C Delhi heatwave in June, ordinary commercial ACs were repeatedly tripping at our banquet facility. OG Heavy Duty’s 5.0 Ton floor-standing tower units ran non-stop for 14 hours daily with zero thermal cutoff. Flawless cooling pull-down.",
    initials: "RM",
  },
  {
    id: 2,
    name: "Dr. Arvind Singhal",
    role: "Head of Infrastructure & Facilities",
    company: "Lifeline Super-Speciality Hospital",
    equipment: "4.0 Ton Ceiling Cassette Systems",
    highlight: "24/7 Healthcare Duty Cycle",
    stars: 5,
    quote:
      "Our operation theaters and ICU recovery wards demand 24/7 continuous duty and whisper-quiet laminar airflow. OG Heavy Duty’s 4-way ceiling cassettes with hydrophilic blue fin coils have delivered steady performance without mold buildup or maintenance downtime.",
    initials: "AS",
  },
  {
    id: 3,
    name: "Er. Sandeep Verma",
    role: "Chief MEP Project Consultant",
    company: "Northern Apex University Campus",
    equipment: "11.0 Ton Ducted Split Systems",
    highlight: "High Static Pressure Central Ducting",
    stars: 5,
    quote:
      "We retrofitted our 800-seat university auditorium with OG Heavy Duty 11.0 Ton ductable units. The external static pressure handled our custom acoustic ducting with ease, and power draw remained within the calculated specs despite extreme summer heat.",
    initials: "SV",
  },
  {
    id: 4,
    name: "Pooja Iyer",
    role: "VP of Administration & Infrastructure",
    company: "TechVanguard Corporate Park, Gurugram",
    equipment: "2.0 Ton Inverter Split ACs",
    highlight: "170V Stabilizer-Free Operation",
    stars: 5,
    quote:
      "Energy efficiency and voltage stability were our top selection criteria. Grid voltage drops to 170V during summer peaks in our industrial zone, but OG Heavy Duty's dual rotary inverter split units ran stabilizer-free with zero compressor strain.",
    initials: "PI",
  },
];

export default function TestimonialSection({ items = null, badge = null, title = null, subtitle = null }) {
  const displayList = items && items.length > 0 ? items : TESTIMONIALS;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
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
  }, []);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 400;
    const delta = direction === "left" ? -cardWidth : cardWidth;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDraggingState(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
  };

  return (
    <section
      id="testimonials"
      className="relative bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] py-[60px] overflow-hidden border-y border-slate-200/90"
    >
      {/* Ambient Cool Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

      <PageContainer>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0f7ae0] mb-3 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#0f7ae0]" />
              <span>VERIFIED COMMERCIAL CLIENT EXPERIENCES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
              Trusted by Facility Managers &amp;{" "}
              <span className="text-[#0f7ae0]">MEP Engineers</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-sans">
              Discover why premier commercial banquets, universities, healthcare centers, and corporate parks rely on OG Heavy Duty for continuous cooling during peak heatwaves.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-[#0f7ae0] text-slate-700 hover:text-white shadow-2xs hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Track */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex gap-6 overflow-x-auto pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDraggingState
              ? "cursor-grabbing select-none scroll-auto"
              : "cursor-grab scroll-smooth snap-x snap-mandatory"
          }`}
        >
          {displayList.map((item, idx) => {
            const initials = item.initials || item.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'OG';
            const starsCount = Math.max(1, Math.min(5, Number(item.stars) || 5));

            return (
              <div
                key={item._id || item.id || idx}
                className="group snap-start shrink-0 w-[320px] sm:w-[410px] rounded-2xl border border-slate-300/90 bg-white shadow-[0_10px_28px_-6px_rgba(15,23,42,0.1),0_4px_10px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_40px_-8px_rgba(15,122,224,0.18)] hover:border-[#0f7ae0] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Gold Stars + Highlight Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(starsCount)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {item.highlight && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f7ae0] bg-blue-50/90 border border-blue-200/90 px-2.5 py-0.5 rounded-md shadow-2xs">
                        {item.highlight}
                      </span>
                    )}
                  </div>

                  {/* Quote Icon & Content */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-[#0f7ae0]/15 absolute -top-2 -left-1 pointer-events-none" />
                    <p className="relative z-10 text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-sans pl-1 italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author Information Shelf */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0f7ae0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate leading-snug">
                      {[item.role, item.company].filter(Boolean).join(', ') || item.equipment}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}

