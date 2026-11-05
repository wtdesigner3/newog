import Image from "next/image";
import {
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { PageContainer } from "src/components/public";

// Verified client logo assets from legacy tbl_clients (/uploads/clients/)
export const CLIENT_LOGOS = [
  { id: 1, image: "/uploads/clients/1648791211_1.jpg", name: "Institutional Client 1" },
  { id: 2, image: "/uploads/clients/1648791222_2.jpg", name: "Institutional Client 2" },
  { id: 3, image: "/uploads/clients/1648791233_3.jpg", name: "Institutional Client 3" },
  { id: 4, image: "/uploads/clients/1648791243_4.jpg", name: "Institutional Client 4" },
  { id: 5, image: "/uploads/clients/1648791254_5.jpg", name: "Institutional Client 5" },
  { id: 6, image: "/uploads/clients/1648791263_6.jpg", name: "Institutional Client 6" },
  { id: 7, image: "/uploads/clients/1648791275_7.jpg", name: "Institutional Client 7" },
  { id: 8, image: "/uploads/clients/1648791286_8.jpg", name: "Institutional Client 8" },
  { id: 9, image: "/uploads/clients/1648791297_9.jpg", name: "Institutional Client 9" },
  { id: 10, image: "/uploads/clients/1648791308_10.jpg", name: "Institutional Client 10" },
  { id: 11, image: "/uploads/clients/1648791323_11.jpg", name: "Institutional Client 11" },
  { id: 12, image: "/uploads/clients/1648791338_12.jpg", name: "Institutional Client 12" },
];

export const SECTOR_TAGS = [
  "Healthcare & Multi-Speciality Hospitals",
  "Higher Education & University Campuses",
  "Commercial Banquets & Auditoriums",
  "Corporate Headquarters & IT Hubs",
  "Government & Municipal Complexes",
  "Industrial Manufacturing Plants",
];

export default function ClienteleShowcase({ logos: propLogos, badge, title, subtitle }) {
  const sourceLogos = (propLogos && propLogos.length > 0) ? propLogos : CLIENT_LOGOS;
  const half = Math.max(1, Math.ceil(sourceLogos.length / 2));
  const row1 = sourceLogos.slice(0, half);
  const row2 = sourceLogos.slice(half);

  // Repeat for seamless infinite loops
  const row1Logos = [...row1, ...row1, ...row1, ...row1];
  const row2Logos = [...row2, ...row2, ...row2, ...row2];

  return (
    <section
      id="clientele"
      className="relative bg-[#080E21] text-white py-[60px] overflow-hidden border-y border-slate-800"
    >
      {/* Background Blueprint Grid & Ambient Cool Glows */}
      <div className="absolute inset-0 bg-ac-blueprint-dark opacity-75 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle top indicator highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0f7ae0] to-transparent" />

      <PageContainer>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-400 mb-4 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-[#0f7ae0]" />
            <span>{badge || "TRUSTED BY INDUSTRY LEADERS"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {title || (
              <>
                Prestigious Commercial &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f7ae0] to-cyan-400">
                  Institutional Clientele
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            {subtitle || "OG Heavy Duty equipment is installed across premier state institutions, private corporate towers, high-density banquet facilities, and multi-speciality medical centres."}
          </p>
        </div>

        {/* Sector Capability Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-4xl mx-auto">
          {SECTOR_TAGS.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.1] transition-all backdrop-blur-sm shadow-xs"
            >
              <CheckCircle2 size={13} className="text-[#0f7ae0]" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </PageContainer>

      {/* Dual Row Continuous Marquee Sliders: Moving in Opposite Directions with Pause on Hover */}
      <div className="relative w-full overflow-hidden pause-on-hover py-2">
        {/* Row 1: Scrolling Leftwards */}
        <div className="animate-marquee-left flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          {row1Logos.map((client, idx) => (
            <div
              key={`row1-${client.id}-${idx}`}
              className="group bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-center h-20 sm:h-24 w-44 sm:w-56 shrink-0 border border-slate-200/90 shadow-md hover:border-[#0f7ae0] hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={client.image}
                  alt={client.name}
                  width={140}
                  height={80}
                  className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Scrolling Rightwards (Opposite Direction) */}
        <div className="animate-marquee-right flex items-center gap-4 sm:gap-6">
          {row2Logos.map((client, idx) => (
            <div
              key={`row2-${client.id}-${idx}`}
              className="group bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-center h-20 sm:h-24 w-44 sm:w-56 shrink-0 border border-slate-200/90 shadow-md hover:border-[#0f7ae0] hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={client.image}
                  alt={client.name}
                  width={140}
                  height={80}
                  className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <PageContainer>
        <p className="mt-8 text-center text-xs text-slate-400 font-sans">
          <span className="text-[#0f7ae0] font-semibold">✦</span> Pan-India institutional deployments engineered to specifications. Brand names belong to their respective corporate owners.
        </p>
      </PageContainer>
    </section>
  );
}
