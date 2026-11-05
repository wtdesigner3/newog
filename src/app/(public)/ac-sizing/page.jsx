import React from "react";
import Link from "next/link";
import Script from "next/script";
import {
  Calculator,
  ChevronRight,
  ShieldCheck,
  Thermometer,
  Sun,
  Users,
  Compass,
  ArrowRight,
  Info,
} from "lucide-react";
import ACSizingTool from "../../../components/forms/ACSizingTool";

export const metadata = {
  title: "Guided AC Sizing & Heat Load Tool | OG Heavy Duty",
  description:
    "Interactive HVAC cooling-load information collector for commercial, institutional, and residential air conditioners. Capture room dimensions, ceiling height, and solar exposure for technical review.",
  alternates: {
    canonical: "https://ogheavyduty.in/ac-sizing",
  },
  openGraph: {
    title: "Guided AC Sizing & Consultation | OG Heavy Duty",
    description:
      "Submit preliminary room dimensions and environmental factors to receive a certified thermal sizing consultation from OG Heavy Duty engineers.",
    url: "https://ogheavyduty.in/ac-sizing",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guided AC Sizing Tool | OG Heavy Duty",
    description:
      "Interactive preliminary HVAC cooling load collector for OG Heavy Duty air conditioners.",
  },
};

export default function ACSizingPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ogheavyduty.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guided AC Sizing",
        item: "https://ogheavyduty.in/ac-sizing",
      },
    ],
  };

  return (
    <>
      <Script
        id="ac-sizing-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-slate-50 font-sans pb-24">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 font-medium">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#0f7ae0] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0]"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} className="text-slate-400" />
                </li>
                <li aria-current="page" className="text-slate-900 font-semibold">
                  Guided AC Sizing Tool
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#0b192c] to-[#132742] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0f7ae0]/20 text-[#38bdf8] border border-[#0f7ae0]/40 mb-4">
              <Calculator size={13} aria-hidden="true" />
              <span>Preliminary Heat-Load Information Collector</span>
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Guided <span className="text-[#0f7ae0]">AC Sizing</span> & Consultation
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Air conditioning tonnage is not merely a square-footage estimate. Use this guided tool to record room dimensions, ceiling height, direct sunlight, and occupancy to receive an engineered recommendation.
            </p>
          </div>
        </section>

        {/* Interactive Tool Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <ACSizingTool />
        </section>

        {/* Engineering Education Section: Why HVAC Calculations Matter (Standardized 60px Spacing) */}
        <section className="py-[60px] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Why Real HVAC Engineering Matters
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              Generic online calculators use arbitrary square-footage rules that lead to severe undercooling during peak summer heatwaves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="p-3 bg-blue-50 text-[#0f7ae0] rounded-xl w-fit mb-4">
                <Sun size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Solar Radiation Gain</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Top-floor rooms under an uninsulated concrete roof absorb intense conductive heat, requiring 20% to 35% higher sensible cooling capacity compared to mid-floor spaces.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="p-3 bg-sky-50 text-[#0f7ae0] rounded-xl w-fit mb-4">
                <Thermometer size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">High-Ambient Deration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard air conditioners suffer severe capacity drop when ambient temperatures exceed 43°C. OG Heavy Duty units are calibrated to maintain robust heat rejection even at 50°C+.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sensible & Latent Heat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every occupant introduces approximately 400–500 BTU/hr of body heat and moisture. Retail showrooms and restaurants require precision latent load accounting.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

