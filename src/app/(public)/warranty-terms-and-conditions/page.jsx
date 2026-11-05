import React from "react";
import Script from "next/script";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Clock,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  Download,
  Building2,
  Sparkles,
  ExternalLink,
  Cpu,
  Flame,
} from "lucide-react";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const metadata = {
  title: "Warranty Terms & Conditions | OG Heavy Duty Air Conditioners",
  description:
    "Official manufacturer warranty policy for OG Heavy Duty Air Conditioners. Review standard 1-year comprehensive unit coverage, 5-year heavy-duty compressor warranty, 100% copper condenser protection, installation guidelines, and claim procedure.",
  alternates: {
    canonical: "https://ogheavyduty.in/warranty-terms-and-conditions",
  },
  openGraph: {
    title: "Warranty Terms & Conditions | OG Heavy Duty Air Conditioners",
    description:
      "Official warranty certificate and terms for OG Heavy Duty air conditioners. Comprehensive coverage on split, window, cassette, and commercial ductable units.",
    url: "https://ogheavyduty.in/warranty-terms-and-conditions",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warranty Terms & Conditions | OG Heavy Duty",
    description:
      "Review manufacturer warranty terms, compressor protection, and service claim procedures for OG Heavy Duty air conditioning equipment.",
  },
};

export default function WarrantyTermsPage() {
  const lastUpdated = "November 2026";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Warranty Terms & Conditions | OG Heavy Duty",
    url: "https://ogheavyduty.in/warranty-terms-and-conditions",
    description:
      "Official manufacturer warranty coverage, terms, exclusions, and claim process for OG Heavy Duty Air Conditioners.",
    publisher: {
      "@type": "Organization",
      name: "OG Heavy Duty",
      url: "https://ogheavyduty.in",
      logo: "https://ogheavyduty.in/images/og-logo.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "D-14, Rajan Babu Road, Adarsh Nagar",
        addressLocality: "New Delhi",
        postalCode: "110033",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "011-35727834",
        contactType: "customer service",
        email: "info@ogheavyduty.in",
      },
    },
    dateModified: "2026-11-04",
    inLanguage: "en-IN",
  };

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
        name: "Warranty Terms & Conditions",
        item: "https://ogheavyduty.in/warranty-terms-and-conditions",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Warranty Terms & Conditions" },
  ];

  const SECTIONS = [
    { id: "coverage-periods", label: "1. Warranty Scope & Periods" },
    { id: "compressor-warranty", label: "2. Extended Compressor Coverage" },
    { id: "copper-coil-protection", label: "3. 100% Copper Heat Exchangers" },
    { id: "installation-mandate", label: "4. Installation & Commissioning" },
    { id: "claim-procedure", label: "5. How to File a Warranty Claim" },
    { id: "warranty-exclusions", label: "6. Exclusions & Limitations" },
    { id: "commercial-institutional", label: "7. Commercial & Bulk Contracts" },
    { id: "contact-helpline", label: "8. Authorized Service Helpline" },
  ];

  return (
    <>
      <Script
        id="warranty-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="warranty-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Standardized Public Page Banner ─────────────────────────────── */}
      <PublicPageBanner
        title="Warranty Terms & Conditions"
        subtitle="Official manufacturer warranty policy, standard unit coverage, extended compressor protection, maintenance guidelines, and RMA service claim procedures."
        badge="OFFICIAL MANUFACTURER WARRANTY POLICY"
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Content Section: Standardized 60px Spacing & High-Contrast Slate BG ─ */}
      <SectionContainer className="py-[60px] bg-[#f1f5f9]">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ─── Sticky Sidebar Navigation (4 cols) ─────────────────────── */}
            <aside className="lg:col-span-4 order-2 lg:order-1 lg:sticky lg:top-24 self-start">
              
              {/* Unified Elevated Sidebar Card (Eliminates Sticky Overlap) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow space-y-6">
                
                {/* Table of Contents Header & Links */}
                <div>
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                    <ShieldCheck size={18} className="text-[#0f7ae0]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Warranty Policy Index
                    </h3>
                  </div>

                  <nav aria-label="Warranty Policy Table of Contents">
                    <ul className="space-y-1 text-xs sm:text-[13px] font-sans">
                      {SECTIONS.map((sec) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#0f7ae0] hover:bg-blue-50 transition-colors font-medium"
                          >
                            <ChevronRight size={13} className="text-slate-400 shrink-0" />
                            <span>{sec.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* PDF Certificate Download CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <a
                    href="/documents/og-heavy-duty-catalogue-2026-2027.pdf"
                    download
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0f7ae0] transition shadow-2xs"
                  >
                    <Download size={14} />
                    <span>Download Official Policy PDF</span>
                  </a>

                  <p className="text-[11px] text-slate-500 text-center font-sans">
                    Policy Revision: {lastUpdated} • Certified Valid
                  </p>
                </div>

                {/* Service Helpline Desk */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={15} className="text-[#0f7ae0]" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Warranty Support Helpline
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Direct manufacturer technical desk for claims &amp; service inquiries:
                  </p>
                  <div className="space-y-1.5 text-xs font-sans text-slate-700">
                    <p>
                      <span className="text-slate-500">Helpline: </span>
                      <a href="tel:011-35727834" className="font-bold text-slate-900 hover:text-[#0f7ae0]">
                        011-35727834
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">WhatsApp: </span>
                      <a href="tel:+919319977568" className="font-bold text-slate-900 hover:text-[#0f7ae0]">
                        +91 93199 77568
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Claims Email: </span>
                      <a href="mailto:info@ogheavyduty.in" className="font-semibold text-[#0f7ae0] hover:underline">
                        info@ogheavyduty.in
                      </a>
                    </p>
                  </div>
                </div>

              </div>
            </aside>

            {/* ─── Main Narrative Content (8 cols) ────────────────────────── */}
            <article className="lg:col-span-8 order-1 lg:order-2 space-y-6">
              
              {/* Highlight Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center mb-3">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">1 Year Comprehensive Unit</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Covers internal electrical and mechanical components including PCB boards, blower motors, and sensors against manufacturing defects.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center mb-3">
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">5 Years Compressor Coverage</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Multi-year manufacturer warranty on heavy-duty rotary, dual-rotary, and scroll compressors engineered for 52°C heatwave continuous operation.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center mb-3">
                    <Flame size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">100% Inner-Grooved Copper</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Defects in factory brazing and copper metallurgical structural integrity on condenser and evaporator coils covered under standard warranty.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center mb-3">
                    <Wrench size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Authorized Field Support</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    On-site diagnostics and repairs conducted exclusively by factory-trained HVAC engineers using genuine OEM replacement parts.
                  </p>
                </div>
              </div>

              {/* Comprehensive Policy Document Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-10 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] space-y-10">
                
                {/* 1. Scope & Periods */}
                <section id="coverage-periods" className="scroll-mt-28">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Warranty Scope &amp; Period of Validity
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      OG Heavy Duty warrants to the original institutional, commercial, or retail purchaser that all new air conditioning equipment manufactured and supplied by OG Heavy Duty shall be free from manufacturing defects in materials, components, and workmanship under normal use and recommended operating conditions.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 mt-3">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3.5">Product Category</th>
                            <th className="py-2.5 px-3.5">Standard Comprehensive Unit</th>
                            <th className="py-2.5 px-3.5">Compressor Warranty</th>
                            <th className="py-2.5 px-3.5">Coil Metallurgy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-900">Heavy Duty Split AC (1.5T – 2.0T)</td>
                            <td className="py-2.5 px-3.5">12 Months (1 Year)</td>
                            <td className="py-2.5 px-3.5 text-[#0f7ae0] font-bold">5 Years (60 Months)</td>
                            <td className="py-2.5 px-3.5">100% Inner-Grooved Copper</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-900">Heavy Duty Window AC (1.5T – 2.0T)</td>
                            <td className="py-2.5 px-3.5">12 Months (1 Year)</td>
                            <td className="py-2.5 px-3.5 text-[#0f7ae0] font-bold">5 Years (60 Months)</td>
                            <td className="py-2.5 px-3.5">100% Inner-Grooved Copper</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-900">Ceiling Cassette AC (2.0T – 4.0T)</td>
                            <td className="py-2.5 px-3.5">12 Months (1 Year)</td>
                            <td className="py-2.5 px-3.5 text-[#0f7ae0] font-bold">5 Years (60 Months)</td>
                            <td className="py-2.5 px-3.5">100% Inner-Grooved Copper</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-900">Tower / Floor Standing AC (3.0T – 4.0T)</td>
                            <td className="py-2.5 px-3.5">12 Months (1 Year)</td>
                            <td className="py-2.5 px-3.5 text-[#0f7ae0] font-bold">5 Years (60 Months)</td>
                            <td className="py-2.5 px-3.5">100% Inner-Grooved Copper</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-900">Ductable Split Systems (5.5T – 11.0T)</td>
                            <td className="py-2.5 px-3.5">12 Months (1 Year)</td>
                            <td className="py-2.5 px-3.5 text-[#0f7ae0] font-bold">Per Project SLA Contract</td>
                            <td className="py-2.5 px-3.5">100% Heavy-Gauge Copper</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      * The warranty period commences on the date of official commercial invoice issued by OG Heavy Duty or an authorized dealer.
                    </p>
                  </div>
                </section>

                {/* 2. Compressor Warranty */}
                <section id="compressor-warranty" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Extended 5-Year Compressor Warranty
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      The refrigeration compressor is the mechanical heart of an air conditioner. OG Heavy Duty units utilize tropicalized, heavy-duty rotary, dual-rotary, and hermetic scroll compressors specifically calibrated to maintain pull-down capacity up to 52°C ambient heatwave temperatures.
                    </p>
                    <p>
                      During the extended 5-year compressor warranty window (Months 13 through 60), OG Heavy Duty will repair or replace a failed compressor unit experiencing internal mechanical seizure, motor winding breakdown, or failure under proper operating conditions.
                    </p>
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs">
                      <strong>Note on Associated Consumables:</strong> After the initial 1-year comprehensive period, replacement compressor units are provided free of charge under warranty. Associated ancillary labor, nitrogen flushing, evacuation vacuuming, filter drier replacement, and refrigerant top-up gas charges are billed according to standard institutional service rates.
                    </div>
                  </div>
                </section>

                {/* 3. Copper Coil Protection */}
                <section id="copper-coil-protection" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      100% Inner-Grooved Copper Heat Exchanger Assurance
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      Unlike lightweight commercial units that utilize aluminum microchannel tubes, every OG Heavy Duty cooling machine is engineered exclusively with <strong>100% Cu-DHP inner-grooved copper condenser and evaporator coils</strong>.
                    </p>
                    <p>
                      The manufacturer guarantees that all heat exchanger coil assemblies are factory leak-tested under 450+ PSI hydrostatic and helium testing protocols. Warranty protection covers brazed joints and copper tubing against manufacturing pinhole defects. In coastal or industrial chemical atmospheres, optional hydrophilic anti-corrosion blue fin coatings are recommended to maximize atmospheric longevity.
                    </p>
                  </div>
                </section>

                {/* 4. Mandatory Installation Guidelines */}
                <section id="installation-mandate" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Mandatory Installation &amp; Commissioning Guidelines
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      Air conditioning machines require precise refrigeration balance. To ensure warranty validity, installation must adhere strictly to standard HVAC commissioning protocols:
                    </p>
                    <ul className="space-y-2 list-disc pl-5 text-slate-700">
                      <li>
                        <strong>Mandatory Deep Vacuuming:</strong> The copper interconnecting line set and indoor unit must be evacuated to below 500 microns using a two-stage rotary vacuum pump prior to opening service valves. Purging with refrigerant gas is strictly prohibited and voids compressor coverage.
                      </li>
                      <li>
                        <strong>Appropriate Electrical Safeguards:</strong> Units must be connected to an independent circuit with a dedicated MCB (Miniature Circuit Breaker) and adequate earth grounding. In regions prone to voltage surges (outside 220V–240V &plusmn;10%), an automatic voltage stabilizer of appropriate rating must be installed.
                      </li>
                      <li>
                        <strong>Proper Outdoor Condenser Clearances:</strong> Outdoor condensing units require minimum clearances (30 cm rear, 60 cm discharge face) to prevent thermal short-circuiting during peak summer heatwaves.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 5. Claim Procedure */}
                <section id="claim-procedure" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      5
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Step-by-Step Warranty Claim Procedure
                    </h2>
                  </div>
                  <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      If your OG Heavy Duty unit demonstrates an operational defect, follow these verified steps to initiate a service docket:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                        <span className="text-xs font-bold text-[#0f7ae0] block mb-1">Step 1: Locate Invoice</span>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Retrieve your purchase invoice or serial number label located on the unit chassis.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                        <span className="text-xs font-bold text-[#0f7ae0] block mb-1">Step 2: Log Complaint</span>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Call 011-35727834 or email info@ogheavyduty.in detailing error codes or symptoms.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                        <span className="text-xs font-bold text-[#0f7ae0] block mb-1">Step 3: Site Inspection</span>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          An authorized technician visits for diagnostic inspection and repair using OEM parts.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6. Exclusions */}
                <section id="warranty-exclusions" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      6
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Warranty Exclusions &amp; Limitations
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      The manufacturer warranty does not apply to damage, component failures, or performance loss resulting from:
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                      <li>External electrical anomalies, lightning strikes, phase loss, or severe undervoltage.</li>
                      <li>Accidental physical impact, tampering, alteration, or transit damage after customer receipt.</li>
                      <li>Refrigerant charging with unapproved gas blends or counterfeit lubricants.</li>
                      <li>Servicing, brazing, or disassembly conducted by unauthorized, non-certified personnel.</li>
                      <li>Failure to clean air filters or condenser coils resulting in persistent compressor thermal overload.</li>
                      <li>Cosmetic degradation of outer cabinets, plastic front louvers, or decorative finishes due to normal environmental exposure.</li>
                    </ul>
                  </div>
                </section>

                {/* 7. Institutional & Bulk Contracts */}
                <section id="commercial-institutional" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      7
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Institutional &amp; Commercial Project Terms
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      For bulk institutional orders (universities, hospitals, CPWD, defense facilities, corporate campuses), specialized Annual Maintenance Contracts (AMC) and Comprehensive SLA Warranty Extensions are executed as part of the commercial supply tender.
                    </p>
                    <p>
                      In institutional contracts, OG Heavy Duty provides priority 24-hour response SLAs, scheduled seasonal preventive checkups, and dedicated spare parts depots.
                    </p>
                  </div>
                </section>

                {/* 8. Authorized Service Helpline */}
                <section id="contact-helpline" className="scroll-mt-28 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] font-bold text-xs flex items-center justify-center shrink-0">
                      8
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                      Authorized Headquarters &amp; Service Contacts
                    </h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-9">
                    <p>
                      All warranty claims, replacement approvals, and technical escalations are managed centrally through our New Delhi engineering headquarters:
                    </p>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <p className="font-bold text-slate-900">OG Heavy Duty Air Conditioners</p>
                      <p className="text-slate-600">D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033</p>
                      <p className="text-slate-600">
                        Central Helpline: <a href="tel:011-35727834" className="font-bold text-slate-900 hover:text-[#0f7ae0]">011-35727834</a> | Mobile: <a href="tel:+919319977568" className="font-bold text-slate-900 hover:text-[#0f7ae0]">+91 93199 77568</a>
                      </p>
                      <p className="text-slate-600">
                        Technical Service Email: <a href="mailto:info@ogheavyduty.in" className="font-semibold text-[#0f7ae0] hover:underline">info@ogheavyduty.in</a>
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Operating Hours: Monday – Saturday: 10:00 AM – 7:30 PM | Sunday: 10:00 AM – 7:00 PM
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            </article>

          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}

