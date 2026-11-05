import Link from "next/link";
import { Download, ArrowRight, Sparkles } from "lucide-react";
import { PageContainer } from "src/components/public";

export default function EnquiryCta({ data = null, badge: propBadge, title: propTitle, subtitle: propSubtitle }) {
  const badge = data?.subtitle?.split('|')?.[0]?.trim() || propBadge || "Get a Quote";
  const kickerRight = data?.subtitle?.includes('|') ? data.subtitle.split('|')[1].trim() : (data?.subtitle || "Turnkey HVAC Projects");
  const title = data?.title || propTitle;
  const description = data?.content || propSubtitle;
  const btn1Text = data?.buttonText1 || "Request a Quotation";
  const btn1Url = data?.url1 || "/contact-us";
  const btn2Text = data?.buttonText2 || "Download Catalogue";
  const btn2Url = data?.url2 || "/resources";
  return (
    <section id="enquiry" className="relative py-[60px] bg-white overflow-hidden">
      <PageContainer>
        {/* Full-width Container Card - Aligned with OG Heavy Duty Brand Theme & Logo */}
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#061129] via-[#091b42] to-[#040b1c] border border-blue-500/25 shadow-[0_24px_60px_-12px_rgba(11,19,43,0.45)] py-12 sm:py-16 md:py-20 px-6 sm:px-12 lg:px-16 text-center">
          
          {/* ─── 1. Top Border Specular Highlight (Electric Cyan to Transparent) ─── */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D2FF]/70 to-transparent pointer-events-none" />

          {/* ─── 2. Brand Blueprint Grid Pattern (OG Heavy Duty Logo Blue #0F7AE0) ─── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-45 mix-blend-screen"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cta-brand-grid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="rgba(15, 122, 224, 0.26)"
                  strokeWidth="1"
                />
                {/* Cyan Cooling Intersection Points */}
                <circle cx="48" cy="48" r="1.5" fill="rgba(0, 210, 255, 0.75)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-brand-grid)" />
          </svg>

          {/* ─── 3. Curved Perspective Stage Lines (Concave Blueprint Grid) ─── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Curved Vertical Perspective Ribs */}
            <path d="M100 0 C 180 200, 180 200, 100 400" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
            <path d="M250 0 C 310 200, 310 200, 250 400" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
            <path d="M400 0 C 430 200, 430 200, 400 400" stroke="rgba(15, 122, 224, 0.25)" strokeWidth="1" />
            <path d="M600 0 L 600 400" stroke="rgba(0, 210, 255, 0.25)" strokeWidth="1" />
            <path d="M800 0 C 770 200, 770 200, 800 400" stroke="rgba(15, 122, 224, 0.25)" strokeWidth="1" />
            <path d="M950 0 C 890 200, 890 200, 950 400" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
            <path d="M1100 0 C 1020 200, 1020 200, 1100 400" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />

            {/* Horizontal Blueprint Depth Planes */}
            <line x1="0" y1="80" x2="1200" y2="80" stroke="rgba(15, 122, 224, 0.16)" strokeWidth="1" />
            <line x1="0" y1="180" x2="1200" y2="180" stroke="rgba(15, 122, 224, 0.18)" strokeWidth="1" />
            <line x1="0" y1="280" x2="1200" y2="280" stroke="rgba(0, 210, 255, 0.2)" strokeWidth="1" />
            <line x1="0" y1="360" x2="1200" y2="360" stroke="rgba(0, 210, 255, 0.22)" strokeWidth="1" />
          </svg>

          {/* ─── 4. Brand Ambient Glows: Electric Blue (#0F7AE0) & Ice Cyan (#00D2FF) ─── */}
          <div className="absolute -bottom-24 -left-20 w-[460px] h-[460px] bg-[#0F7AE0]/35 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-20 w-[460px] h-[460px] bg-[#00D2FF]/25 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[240px] bg-[#0F7AE0]/20 rounded-full blur-[90px] pointer-events-none" />

          {/* ─── 5. Foreground Content (Centered, Brand-Aligned) ─── */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Top Segmented Pill Capsule */}
            <div className="inline-flex items-center p-1 rounded-full bg-blue-950/60 border border-blue-400/25 backdrop-blur-md mb-6 sm:mb-7 shadow-sm">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0F7AE0] to-[#0A4B8A] text-white text-xs sm:text-sm font-bold tracking-wide shadow-sm flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-200" />
                <span>{badge}</span>
              </span>
              <span className="px-4 py-1.5 text-blue-100 text-xs sm:text-sm font-medium">
                {kickerRight}
              </span>
            </div>

            {/* Headline: Brand-Themed 2-Line Bold Display */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold font-heading text-white tracking-tight leading-[1.15]">
              {title || (
                <>
                  Heavy-duty engineering,{" "}
                  <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] via-[#38BDF8] to-[#93C5FD]">
                    uninterrupted continuous cooling.
                  </span>
                </>
              )}
            </h2>

            {/* Sub-description */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              {description || "Pan-India turnkey solutions for commercial, industrial, and high-ambient institutions. Engineered to endure 52°C extreme climates."}
            </p>

            {/* Two Action Buttons (Brand Blue & Frost Bordered Glass) */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={btn1Url || "/contact-us"}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#0F7AE0] to-[#0A4B8A] hover:from-[#1185f3] hover:to-[#0c59a3] text-white text-sm sm:text-base font-bold shadow-[0_6px_22px_rgba(15,122,224,0.45)] hover:shadow-[0_8px_30px_rgba(15,122,224,0.6)] transition-all duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
              >
                <span>{btn1Text}</span>
                <ArrowRight size={17} />
              </Link>

              <Link
                href={btn2Url || "/resources"}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-blue-300/25 hover:border-blue-300/40 text-white text-sm sm:text-base font-semibold backdrop-blur-md transition-all duration-200 active:scale-95 hover:scale-[1.02]"
              >
                <Download size={17} className="text-[#00D2FF]" />
                <span>{btn2Text}</span>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
