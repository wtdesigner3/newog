"use client";

import { useState, useEffect, useRef } from "react";
import {
  ThermometerSnowflake,
  Layers,
  Building2,
  MapPin,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Globe2,
  CheckCircle2,
  TrendingUp,
  Compass,
} from "lucide-react";
import { PageContainer } from "src/components/public";

const ICON_MAP = {
  ThermometerSnowflake,
  Layers,
  Building2,
  MapPin,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Globe2,
  CheckCircle2,
  TrendingUp,
  Compass,
};

export const ACHIEVEMENTS_DATA = [
  {
    icon: ThermometerSnowflake,
    target: 52,
    suffix: "°C",
    label: "Extreme Ambient Ceiling",
    subtext: "Continuous cooling engineered & tested up to 52°C tropical peak",
    badge: "Thermal Standard",
  },
  {
    icon: Layers,
    target: 100,
    suffix: "%",
    label: "Pure Copper Construction",
    subtext: "Inner-grooved condenser & evaporator rifled copper coils",
    badge: "Cu-DHP Grade",
  },
  {
    icon: Building2,
    target: 50000,
    suffix: "+",
    formatNumber: true,
    label: "Commercial Units Deployed",
    subtext: "Operational across universities, hospitals, corporate & state complexes",
    badge: "Proven Scale",
  },
  {
    icon: MapPin,
    isText: true,
    textValue: "Pan-India",
    label: "Service & Distribution",
    subtext: "Rapid technician dispatch, certified spares & authorized partner hubs",
    badge: "National Reach",
  },
];

function AnimatedCounter({
  target,
  suffix = "",
  formatNumber = false,
  isText = false,
  textValue = "",
  isVisible = false,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible || isText) return;

    let startTime = null;
    const duration = 2000; // 2.0s smooth decelerating counter

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Decelerating easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * target);
      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [isVisible, target, isText]);

  if (isText) {
    return (
      <span className="inline-flex items-center justify-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0f7ae0]" />
        </span>
        <span>{textValue}</span>
      </span>
    );
  }

  const formatted = formatNumber ? count.toLocaleString("en-IN") : count;

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

export default function MilestonesStrip({ items = null }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const displayList = items && Array.isArray(items) && items.length > 0 ? items : ACHIEVEMENTS_DATA;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#080E21] text-white py-[60px] overflow-hidden border-y border-slate-800"
    >
      {/* Background Blueprint Grid & Ambient Cool Glows */}
      <div className="absolute inset-0 bg-ac-blueprint-dark opacity-75 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-[400px] h-[250px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle top indicator highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0f7ae0] to-transparent" />

      <PageContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {displayList.map((item, idx) => {
            const Icon = (typeof item.icon === 'function' || typeof item.icon === 'object') && item.icon !== null
              ? item.icon
              : (ICON_MAP[item.icon] || Award);

            const isText = Boolean(item.isText || item.valueType === 'text');
            const textVal = item.textValue || (isText ? String(item.target || '') : '');
            const targetVal = Number(item.target) || 0;

            return (
              <div
                key={item.id || idx}
                className={`flex flex-col items-center text-center group ${
                  idx > 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                {/* Icon & Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 text-[#0f7ae0] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80">
                    {item.badge}
                  </span>
                </div>

                {/* Animated Value */}
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38bdf8] tabular-nums">
                  <AnimatedCounter
                    target={targetVal}
                    suffix={item.suffix || ""}
                    formatNumber={item.formatNumber}
                    isText={isText}
                    textValue={textVal}
                    isVisible={isVisible}
                  />
                </p>

                {/* Label */}
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 mt-2 font-sans">
                  {item.label}
                </h3>

                {/* Subtext */}
                <p className="text-xs text-slate-400 mt-1 max-w-[220px] font-sans leading-relaxed">
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
