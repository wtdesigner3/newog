import React from "react";
import Link from "next/link";
import Script from "next/script";
import {
  Briefcase,
  Target,
  Wrench,
  TrendingUp,
  Building,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import CareerForm from "../../../components/forms/CareerForm";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const metadata = {
  title: "Careers & Openings | OG Heavy Duty Air Conditioners",
  description:
    "Join OG Heavy Duty Air Conditioners. Explore career opportunities in HVAC engineering, sales, field service, manufacturing, and production quality control.",
  alternates: {
    canonical: "https://ogheavyduty.in/career",
  },
  openGraph: {
    title: "Careers & Openings | OG Heavy Duty Air Conditioners",
    description:
      "Build your career in India's leading high-ambient air conditioning manufacturer. Apply now for engineering, technician, and commercial sales roles.",
    url: "https://ogheavyduty.in/career",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers & Openings | OG Heavy Duty",
    description:
      "Join the engineering team at OG Heavy Duty Air Conditioners. Apply online with your resume.",
  },
};

const OPEN_ROLES = [
  {
    title: "HVAC Service & Commissioning Engineer",
    department: "Field Engineering",
    location: "Delhi NCR / Pan-India",
    experience: "2–5 Years",
    type: "Full-time",
    description:
      "Installation, diagnostic troubleshooting, vacuuming, and commissioning of light commercial cassette and ductable split systems.",
  },
  {
    title: "Commercial HVAC Sales Executive",
    department: "Institutional Sales",
    location: "New Delhi Headquarters",
    experience: "1–4 Years",
    type: "Full-time",
    description:
      "B2B sales engagements with government departments, educational institutions, hospitals, and commercial contractors.",
  },
  {
    title: "Quality Assurance & Testing Inspector",
    department: "Plant Operations",
    location: "Manufacturing Unit",
    experience: "2–6 Years",
    type: "Full-time",
    description:
      "Helium leak testing, sound chamber testing, electrical safety inspection, and compliance checking for copper heat exchanger coils.",
  },
];

export default function CareerPage() {
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
        name: "Careers",
        item: "https://ogheavyduty.in/career",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Careers" },
  ];

  return (
    <>
      <Script
        id="career-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Standardized Public Page Banner ─────────────────────────────── */}
      <PublicPageBanner
        title="Careers & Job Openings"
        subtitle="Build the future of high-ambient HVAC engineering. Explore open positions across technical commissioning, plant manufacturing, and commercial sales."
        badge="JOIN OUR ENGINEERING & SALES TEAMS"
        bgImage="/uploads/breadcrumb/1648815831_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Content Section: Standardized 60px Spacing & High-Contrast Slate BG ─ */}
      <SectionContainer className="py-[60px] bg-[#f1f5f9]">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ─── Left Column: Culture & Open Positions (5 cols) ─────────── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Culture & Work Ethic Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow">
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f7ae0] block">
                      Manufacturing Excellence
                    </span>
                    <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-tight">
                      Why Build Your Career at OG?
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <Wrench size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Hands-on HVAC Engineering</p>
                      <p className="text-slate-500 mt-0.5 leading-relaxed font-sans">
                        Direct exposure to 100% inner-grooved copper tube fabrication, vacuuming, and dual-rotary refrigeration circuits.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Merit-Based Progression</p>
                      <p className="text-slate-500 mt-0.5 leading-relaxed font-sans">
                        Fast-track internal advancement for skilled technicians, field application engineers, and regional sales managers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <Building size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Prestigious Institutional Projects</p>
                      <p className="text-slate-500 mt-0.5 leading-relaxed font-sans">
                        Deploy heavy-duty cooling machines for central universities, government ministries, hospitals, and national transit networks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Job Openings Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center shrink-0">
                      <Target size={16} />
                    </span>
                    <h3 className="text-base font-bold font-heading text-slate-900 leading-tight">
                      Featured Open Roles
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0f7ae0] border border-blue-200/80">
                    {OPEN_ROLES.length} Active
                  </span>
                </div>

                <div className="space-y-3.5">
                  {OPEN_ROLES.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/60 hover:bg-blue-50/30 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-slate-900 text-sm">{role.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100/70 text-[#0f7ae0] text-[10px] font-bold shrink-0">
                          {role.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 mb-2 font-sans">
                        <span className="inline-flex items-center gap-1">
                          <Building size={12} className="text-slate-400" />
                          <span>{role.department}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span>{role.location}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{role.experience}</span>
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-sans line-clamp-2">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500 font-sans">
                    Don&apos;t see your exact role? Submit a <strong>General Application</strong> via the form.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Right Column: Job Application Form (7 cols) ─────────────── */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-9 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow">
                <div className="mb-5 pb-4 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0f7ae0] border border-blue-200/80 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={12} />
                    <span>Direct Recruitment Portal</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
                    Submit Job Application
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-sans">
                    Attach your resume (PDF format, up to 5 MB). Our HR desk reviews every submission and schedules preliminary technical screenings.
                  </p>
                </div>

                <CareerForm />
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}
