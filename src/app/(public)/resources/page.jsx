import React from "react";
import Link from "next/link";
import Script from "next/script";
import { BookOpen, FileText, AlertTriangle, ShieldCheck, ChevronRight, Download, Headphones, CheckCircle2 } from "lucide-react";
import { getResources, getResourceCategories } from "@/lib/services/resourceService";
import ResourceFilterExplorer from "../../../components/resources/ResourceFilterExplorer";

export const metadata = {
  title: "Technical Resources, Manuals & Downloads | OG Heavy Duty",
  description:
    "Download official OG Heavy Duty air conditioner product catalogues, user operation and installation manuals, diagnostic error codes, and warranty policies.",
  alternates: {
    canonical: "https://ogheavyduty.in/resources",
  },
  openGraph: {
    title: "Technical Resources & Download Center | OG Heavy Duty",
    description:
      "Access verified manufacturer catalogues, operation manuals, wiring instructions, diagnostic error codes, and warranty terms for OG Heavy Duty cooling equipment.",
    url: "https://ogheavyduty.in/resources",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Resources & Download Center | OG Heavy Duty",
    description:
      "Official technical manuals, error code diagnostic guides, and product catalogues for OG Heavy Duty air conditioners.",
  },
};

export default async function ResourcesPage() {
  const resources = await getResources();
  const categories = await getResourceCategories();

  // Breadcrumb Schema for SEO
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
        name: "Technical Resources",
        item: "https://ogheavyduty.in/resources",
      },
    ],
  };

  return (
    <>
      <Script
        id="resources-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-slate-50 min-h-screen pb-20">
        {/* ─── Page Hero Banner ────────────────────────────────────────── */}
        <div className="bg-[#0B132B] text-white relative overflow-hidden py-14 sm:py-20 border-b border-slate-800">
          <div className="absolute inset-0 bg-radial from-[#0f7ae0]/15 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight size={13} className="text-slate-600" aria-hidden="true" />
                </li>
                <li className="text-blue-300" aria-current="page">
                  Technical Resources
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
                <CheckCircle2 size={13} aria-hidden="true" />
                <span>Official Manufacturer Documentation Library</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
                Technical Resources &amp;{" "}
                <span className="text-[#0f7ae0]">Download Center</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Access verified manufacturer catalogues, comprehensive installation and user operation manuals,
                diagnostic error code charts, and commercial warranty policies for OG Heavy Duty air conditioning equipment.
              </p>

              {/* Verified Library Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  10 Verified Technical Assets
                </span>
                <span className="text-slate-600">•</span>
                <span>Direct PDF Downloads</span>
                <span className="text-slate-600">•</span>
                <span>Zero Broken Links</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Resources Explorer Container ─────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <ResourceFilterExplorer resources={resources} categories={categories} />

          {/* ─── Engineering Submittal & Support Assistance Callout ───────── */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0f7ae0] uppercase tracking-wider">
                <Headphones size={15} aria-hidden="true" />
                <span>Technical Engineering Support</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Require Custom Engineering Submittals or Wiring Schematics?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you need architectural project submittals, customized three-phase electrical schematics, or legacy equipment documentation not listed above, our central engineering desk is ready to assist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/contact"
                className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0f7ae0] hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f7ae0]"
              >
                <span>Request Engineering Submittal</span>
                <ChevronRight size={14} aria-hidden="true" />
              </Link>

              <a
                href="tel:01135727834"
                className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
              >
                <span>Call Desk: 011-35727834</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
