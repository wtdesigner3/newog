import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Users,
  Target,
  Compass,
  Leaf,
  ThermometerSnowflake,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Globe2,
  Quote,
  Building2,
  GraduationCap,
} from "lucide-react";

import { connectDB } from "../../lib/config";
import About from "../../models/About";
import HomeAbout from "../../models/HomeAbout";
import Milestone from "../../models/Milestone";
import {
  PublicPageBanner,
  PageContainer,
  SectionHeading,
  PrimaryButton,
  SecondaryButton,
} from "src/components/public";
import { MilestonesStrip } from "src/components/homepage";

// Revalidate cache every 1 hour (3600s)
export const revalidate = 3600;

// Deduplicate DB query
const getAboutData = cache(async () => {
  try {
    await connectDB();
    const [aboutPage, homeAbout, milestonesDocs] = await Promise.all([
      About.findOne({ section: "about" }).lean(),
      HomeAbout.findOne().lean(),
      Milestone.find({ status: "active" }).sort({ sort: 1, createdAt: 1 }).lean(),
    ]);

    const milestones = milestonesDocs && milestonesDocs.length > 0
      ? milestonesDocs.map((d) => ({
          id: String(d._id),
          badge: d.badge,
          valueType: d.valueType,
          target: d.target,
          suffix: d.suffix,
          formatNumber: d.formatNumber,
          isText: d.valueType === 'text',
          textValue: d.textValue,
          label: d.label,
          subtext: d.subtext,
          icon: d.icon,
        }))
      : null;

    return { aboutPage, homeAbout, milestones };
  } catch (err) {
    return { aboutPage: null, homeAbout: null, milestones: null };
  }
});

export async function generateMetadata() {
  const { aboutPage: dbData, homeAbout } = await getAboutData();

  const title =
    dbData?.metatag ||
    (homeAbout?.title ? `${homeAbout.title} | About Us | OG Heavy Duty` : "About Us | OG Heavy Duty — Heavy-Duty Commercial & Industrial Air Conditioners");
  const description =
    dbData?.metaDescription ||
    homeAbout?.short_description ||
    "Discover OG Heavy Duty's manufacturing heritage, executive leadership by Mr. Sanjay Kumar (Founder, ex-Director at Mitsubishi Heavy Industries India) and Mr. Shubham Goel (Director), Make in India commitment, and heavy-duty HVAC systems engineered for severe tropical climates.";

  return {
    title,
    description,
    keywords: dbData?.metakeywords?.length ? dbData.metakeywords : undefined,
    alternates: {
      canonical: "https://ogheavyduty.in/about-us",
    },
    openGraph: {
      title,
      description,
      url: "https://ogheavyduty.in/about-us",
      siteName: "OG Heavy Duty",
      type: "website",
      images: [
        {
          url: "/uploads/about/1648793586_mission.jpg",
          width: 1200,
          height: 630,
          alt: "About OG Heavy Duty Air Conditioners",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/uploads/about/1648793586_mission.jpg"],
    },
    robots: "index, follow",
  };
}

export default async function AboutUsPage() {
  const { aboutPage: dbData, homeAbout, milestones } = await getAboutData();

  // Structured data JSON-LD schema
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://ogheavyduty.in/about-us#webpage",
        "url": "https://ogheavyduty.in/about-us",
        "name": "About OG Heavy Duty",
        "description":
          "Corporate background, executive leadership, and manufacturing engineering capabilities of OG Heavy Duty air conditioners.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://ogheavyduty.in/#website",
          "url": "https://ogheavyduty.in",
          "name": "OG Heavy Duty",
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://ogheavyduty.in",
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "About Us",
              "item": "https://ogheavyduty.in/about-us",
            },
          ],
        },
      },
      {
        "@type": "HVACBusiness",
        "@id": "https://ogheavyduty.in/#organization",
        "name": "OG Heavy Duty",
        "url": "https://ogheavyduty.in",
        "logo": "https://ogheavyduty.in/images/og-logo.png",
        "telephone": "011-35727834",
        "email": "info@ogheavyduty.in",
        "founder": {
          "@type": "Person",
          "name": "Mr. Sanjay Kumar",
          "jobTitle": "Founder",
          "description":
            "Seasoned leader in the air conditioning industry with over 35 years of experience; former Director at Mitsubishi Heavy Industries India.",
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "D-14, Rajan Babu Road, Adarsh Nagar",
          "addressLocality": "New Delhi",
          "postalCode": "110033",
          "addressCountry": "IN",
        },
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About Us" },
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─── 1. PAGE BANNER: Image in Background with Cinematic Brand Overlay ─── */}
      <PublicPageBanner
        title="Engineering Resilience for Tropical Climates"
        subtitle="Over 30 years of heavy-duty commercial HVAC manufacturing, purpose-built for continuous duty up to 52°C ambient."
        badge="ABOUT OG HEAVY DUTY"
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── 2. ABOUT DESCRIPTION SECTION: Guaranteed Sticky Image + Deep Technical Narrative ─── */}
      <section
        id="about-description"
        className="relative py-[60px] bg-white border-b border-slate-200/80"
      >
        <PageContainer>
          {/* Grid without align-items constraint: Column tracks stretch to 100% natural height */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Natural 100% height grid cell for sticky tracking */}
            <div className="lg:col-span-6 relative">
              {/* Sticky Container: Pinned at top-28 (112px) throughout the full scroll of the right column */}
              <div
                className="lg:sticky lg:top-28 z-20 space-y-4"
                style={{ position: "sticky", top: "112px" }}
              >
                <div className="relative mx-auto max-w-lg lg:max-w-none">
                  {/* Architectural Accent Offset Frame */}
                  <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-blue-100/70 via-slate-100/50 to-sky-50/40 rounded-3xl -rotate-1 sm:-rotate-1.5 border border-blue-200/50 -z-10" />

                  {/* Main Clean Image Container */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-xl group">
                    <Image
                      src={homeAbout?.image || "/images/home1/about-img.jpg"}
                      alt={homeAbout?.alt || "OG Heavy Duty Manufacturing & Precision Engineering Build"}
                      fill
                      unoptimized={true}
                      priority={true}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />

                    {/* Gradient Scrim for Visual Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

                    {/* Corner Pill: Minimal & Modern */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-md border border-slate-200/80 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-[#0f7ae0]" />
                        <span>Heavy-Duty Engineering</span>
                      </span>
                    </div>
                  </div>

                  {/* Floating Glass Badge */}
                  <div className="absolute -bottom-5 sm:-bottom-7 -right-2 sm:-right-5 z-20 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-xl p-3.5 sm:p-4.5 flex items-center gap-3.5 sm:gap-4 max-w-xs transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center shrink-0">
                      <ThermometerSnowflake size={24} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg sm:text-xl font-black font-heading text-slate-900 leading-none">{homeAbout?.experience_years || "30+ Years"}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f7ae0] bg-blue-50 px-2 py-0.5 rounded">Proven</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-tight">
                        {homeAbout?.experience_text || "Severe Tropical Heatwave Resilience (52°C Tested)"}
                      </p>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Right Column: Deep Value Narrative & Verified Technical Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0f7ae0] border border-blue-200/80 text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles size={13} />
                  <span>{homeAbout?.badge || "PIONEERING HIGH-AMBIENT HVAC"}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight leading-[1.15]">
                  {homeAbout?.title || "High-Performance Cooling Aligned with Make in India"}
                </h2>
              </div>

              {/* Dynamic Content Narrative */}
              {(() => {
                const hasShort = Boolean(homeAbout?.short_description?.trim());
                const hasFull = Boolean(homeAbout?.description?.trim());

                if (hasShort && hasFull) {
                  return (
                    <div className="space-y-5">
                      <div className="p-4.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed shadow-xs">
                        {homeAbout.short_description}
                      </div>
                      {homeAbout.description.includes("<") && homeAbout.description.includes(">") ? (
                        <div
                          className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans prose prose-slate max-w-none space-y-4"
                          dangerouslySetInnerHTML={{ __html: homeAbout.description }}
                        />
                      ) : (
                        <div className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                          {homeAbout.description}
                        </div>
                      )}
                    </div>
                  );
                }

                if (hasFull) {
                  return homeAbout.description.includes("<") && homeAbout.description.includes(">") ? (
                    <div
                      className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans prose prose-slate max-w-none space-y-4"
                      dangerouslySetInnerHTML={{ __html: homeAbout.description }}
                    />
                  ) : (
                    <div className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                      {homeAbout.description}
                    </div>
                  );
                }

                if (hasShort) {
                  return (
                    <div className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                      {homeAbout.short_description}
                    </div>
                  );
                }

                return (
                  <>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                      O.G. Heavy Duty Air Conditioner is an authoritative Indian manufacturer committed to delivering high-performance, reliable, and energy-efficient climate control systems. Proudly aligned with the <strong>Make in India</strong> initiative and actively promoting <strong>Vocal for Local</strong>, we engineer cooling machines purpose-built for continuous duty in India&apos;s most punishing environments.
                    </p>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                      With over 30 years of specialized manufacturing experience, OG Heavy Duty has become the trusted HVAC partner for major Government Departments, central universities, and large commercial establishments across the country. Where ordinary air conditioning units suffer thermal tripping above 45°C, our tropicalized engineering guarantees continuous pull-down even at peak 52°C ambient temperatures.
                    </p>
                  </>
                );
              })()}




              {/* Action Buttons: Unified on a single line/row */}
              <div className="pt-3 flex flex-row items-center gap-3 sm:gap-4 flex-nowrap">
                <PrimaryButton
                  href="/products/split-ac"
                  variant="primary"
                  size="md"
                  icon={true}
                  className="whitespace-nowrap shrink-0 !w-auto inline-flex"
                >
                  Explore Heavy Duty AC Range
                </PrimaryButton>
                <SecondaryButton
                  href="/contact-us"
                  variant="outline"
                  size="md"
                  icon={true}
                  className="whitespace-nowrap shrink-0 !w-auto inline-flex"
                >
                  Consult HVAC Engineers
                </SecondaryButton>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ─── 3. MILESTONES STRIP: Core Engineering Achievements (Dark Blueprint) ─── */}
      <MilestonesStrip items={milestones} />

      {/* ─── 4. STRATEGIC DIRECTION: 3-Column Clean Mission, Vision & Values: Standardized 60px Spacing ─── */}
      <section
        id="mission-vision"
        className="relative py-[60px] bg-[#f1f5f9] border-b border-slate-200/90 overflow-hidden"
      >
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#0f7ae0] border border-blue-200/80 mb-3 shadow-2xs">
              <Compass size={12} />
              <span>Core Foundation</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight leading-tight">
              Mission, Vision &amp; Core Values
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-sans mt-3 leading-relaxed">
              Guiding principles driving our engineering precision, sustainability, and industrial trust.
            </p>
          </div>

          {/* Clean & Modern 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* ─── Column 1: Mission ─── */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-slate-200/90 shadow-[0_14px_36px_-6px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_50px_-8px_rgba(15,122,224,0.22),0_8px_20px_-4px_rgba(15,23,42,0.08)] hover:border-[#0f7ae0] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between overflow-hidden ring-1 ring-black/[0.03]"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#061129] via-[#0f7ae0] to-[#00D2FF]" />

              <div>
                {/* Header: Flat-Icon Medallion + Mission Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0f7ae0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {/* Precision Radar / Target SVG Flat-Icon */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0f7ae0] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full shadow-2xs">
                    Our Mission
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors leading-tight mb-2.5">
                  High-Ambient Reliability
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                  To engineer robust, heavy-duty climate control systems that maintain deep thermal pull-down under India&apos;s severe 52°C tropical extremes without compressor tripouts.
                </p>
              </div>

              {/* Signature Single Highlight */}
              <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs font-bold text-slate-800 shadow-2xs">
                <CheckCircle2 size={15} className="text-[#0f7ae0] shrink-0" />
                <span>52°C Non-Tripping Operation</span>
              </div>
            </div>

            {/* ─── Column 2: Vision ─── */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-slate-200/90 shadow-[0_14px_36px_-6px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_50px_-8px_rgba(15,122,224,0.22),0_8px_20px_-4px_rgba(15,23,42,0.08)] hover:border-[#0f7ae0] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between overflow-hidden ring-1 ring-black/[0.03]"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#061129] via-[#0f7ae0] to-[#00D2FF]" />

              <div>
                {/* Header: Flat-Icon Medallion + Vision Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0f7ae0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {/* Eco Leaf SVG Flat-Icon */}
                    <Leaf size={24} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0f7ae0] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full shadow-2xs">
                    Our Vision
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors leading-tight mb-2.5">
                  Sustainable Cold Innovation
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                  To be India&apos;s benchmark heavy-duty HVAC brand, championing low-GWP refrigerants (R32 / R410A) and energy-conserving inverter drives for industrial decarbonization.
                </p>
              </div>

              {/* Signature Single Highlight */}
              <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs font-bold text-slate-800 shadow-2xs">
                <CheckCircle2 size={15} className="text-[#0f7ae0] shrink-0" />
                <span>Zero-ODP &amp; High-SEER Inverters</span>
              </div>
            </div>

            {/* ─── Column 3: Values ─── */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-slate-200/90 shadow-[0_14px_36px_-6px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_50px_-8px_rgba(15,122,224,0.22),0_8px_20px_-4px_rgba(15,23,42,0.08)] hover:border-[#0f7ae0] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between overflow-hidden ring-1 ring-black/[0.03]"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#061129] via-[#0f7ae0] to-[#00D2FF]" />

              <div>
                {/* Header: Flat-Icon Medallion + Values Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0f7ae0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {/* Shield / Copper Integrity SVG Flat-Icon */}
                    <ShieldCheck size={24} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0f7ae0] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full shadow-2xs">
                    Core Values
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors leading-tight mb-2.5">
                  Uncompromised Integrity
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                  100% inner-grooved Cu-DHP copper with zero aluminum shortcuts, honest industrial engineering, and dependable pan-India institutional customer partnerships.
                </p>
              </div>

              {/* Signature Single Highlight */}
              <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs font-bold text-slate-800 shadow-2xs">
                <CheckCircle2 size={15} className="text-[#0f7ae0] shrink-0" />
                <span>100% Inner-Grooved Copper</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}