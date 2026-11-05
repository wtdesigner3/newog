import Link from "next/link";
import {
  ThermometerSnowflake,
  Layers,
  ShieldCheck,
  Zap,
  Wind,
  Cpu,
  CheckCircle2,
  Fan,
  Sparkles,
} from "lucide-react";
import {
  PageContainer,
  PrimaryButton,
} from "src/components/public";

export const ENGINEERING_PILLARS = [
  {
    icon: ThermometerSnowflake,
    title: "52°C Severe Ambient Cooling",
    tagline:
      "Uninterrupted cooling pull-down with zero thermal tripping during peak 52°C tropical heatwaves.",
    tag: "52°C Rated",
    theme: "blue",
  },
  {
    icon: Layers,
    title: "100% Inner-Grooved Copper",
    tagline:
      "Full Cu-DHP rifled copper condenser & evaporator coils for 2x faster heat transfer and zero corrosion risk.",
    tag: "100% Cu-DHP",
    theme: "navy",
  },
  {
    icon: ShieldCheck,
    title: "Heavy-Gauge Galvanized Casing",
    tagline:
      "7-stage zinc phosphatized powder-coated steel chassis built to endure monsoons, salt, and humidity.",
    tag: "Anti-Rust",
    theme: "blue",
  },
  {
    icon: Zap,
    title: "145V – 285V Voltage Stability",
    tagline:
      "High-torque windings and contactors withstand severe industrial sags and surges stabilizer-free.",
    tag: "Wide Voltage",
    theme: "navy",
  },
  {
    icon: Wind,
    title: "Hydrophilic Blue Fin Shield",
    tagline:
      "Moisture-repelling barrier prevents fin bridging, stops mold buildup, and optimizes laminar airflow.",
    tag: "Blue Fin",
    theme: "blue",
  },
  {
    icon: Cpu,
    title: "24/7 Heavy-Duty Duty Cycle",
    tagline:
      "Commercial continuous-duty engineering built for non-stop cooling in hospitals, server hubs, and banquets.",
    tag: "24/7 Duty",
    theme: "navy",
  },
];

export default function EngineeringDifferentiators({ items: propItems, badge, title, subtitle, callout = null }) {
  const pillars = (propItems && propItems.length > 0) ? propItems : ENGINEERING_PILLARS;

  return (
    <section
      id="engineering"
      className="relative bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] py-[60px] overflow-hidden border-b border-slate-200/80"
    >
      {/* Ambient Cool Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

      <PageContainer>
        {/* Section Header - Clean & Compact */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0f7ae0] mb-3 shadow-xs">
            <ThermometerSnowflake className="w-4 h-4 text-[#0f7ae0]" />
            <span>{badge || "ENGINEERING BENCHMARK"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            {title || (
              <>
                Heavy-Duty Architecture For{" "}
                <span className="text-[#0f7ae0] relative inline-block">
                  Demanding Climates
                </span>
              </>
            )}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-sans max-w-xl mx-auto">
            {subtitle || "Six verified engineering benchmarks that keep OG Heavy Duty systems performing where standard air conditioners degrade."}
          </p>
        </div>

        {/* 6-Pillar Compact Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon || ThermometerSnowflake;
            const isNavy = pillar.theme === "navy" || idx % 2 === 1;

            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_10px_28px_-6px_rgba(15,23,42,0.1),0_4px_10px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_22px_44px_-8px_rgba(15,122,224,0.2),0_6px_14px_-3px_rgba(15,122,224,0.08)] hover:border-[#0f7ae0] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top indicator bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0f7ae0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Top Row: Icon + Mini Spec Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${isNavy
                          ? "bg-[#0B132B] text-white shadow-sm"
                          : "bg-blue-50 text-[#0f7ae0] border border-blue-200/70 shadow-xs"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-md group-hover:border-blue-200 group-hover:bg-blue-50/70 group-hover:text-[#0f7ae0] transition-colors">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  {/* Mini Tagline */}
                  <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                    {pillar.tagline}
                  </p>
                </div>

                {/* Subtle verification indicator at bottom */}
                <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold group-hover:text-[#0f7ae0] transition-colors">
                    <CheckCircle2 size={12} className="text-[#0f7ae0]" />
                    <span>OG Heavy Duty Standard</span>
                  </span>
                  <span className="text-[#0f7ae0] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs">
                    Verified →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Callout Banner */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-[#0B132B] p-6 sm:p-8 text-white border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Blueprint background grid */}
          <div className="absolute inset-0 bg-ac-blueprint-dark opacity-40 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              <Fan className="w-3.5 h-3.5 animate-fan-slow text-blue-400" />
              <span>{callout?.badge || "MEP & HVAC ENGINEERING SUPPORT"}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
              {callout?.title || "Require custom institutional HVAC specifications?"}
            </h4>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {callout?.content || "Our engineering desk assists MEP consultants, architects, and facilities managers with heat load calculations, static pressure sizing, and duct equipment layouts."}
            </p>
          </div>

          <PrimaryButton
            href={callout?.buttonUrl || "/contact-us"}
            variant="primary"
            size="md"
            icon={true}
            className="relative z-10 shrink-0 whitespace-nowrap shadow-lg shadow-blue-500/25"
          >
            {callout?.buttonText || "Consult Engineering Desk"}
          </PrimaryButton>
        </div>
      </PageContainer>
    </section>
  );
}
