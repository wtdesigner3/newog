import React from "react";
import Script from "next/script";
import Link from "next/link";
import {
  FileText,
  ChevronRight,
  ShieldCheck,
  Scale,
  CreditCard,
  Truck,
  Wrench,
  AlertTriangle,
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Download,
} from "lucide-react";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const metadata = {
  title: "Terms & Conditions | OG Heavy Duty",
  description:
    "Read the website, commercial, and product terms of use for OG Heavy Duty Air Conditioners. Review product specification policies, quotation terms, warranty disclaimers, intellectual property, and New Delhi legal jurisdiction.",
  alternates: {
    canonical: "https://ogheavyduty.in/terms-and-condition",
  },
  openGraph: {
    title: "Terms & Conditions | OG Heavy Duty",
    description:
      "Official terms and conditions for OG Heavy Duty Air Conditioners (D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033). Product specifications, warranty scope, commercial terms, and legal governing law.",
    url: "https://ogheavyduty.in/terms-and-condition",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | OG Heavy Duty",
    description:
      "Commercial terms of use, product specifications, and warranty policies for OG Heavy Duty Air Conditioners.",
  },
};

export default function TermsAndConditionPage() {
  const lastUpdated = "November 2, 2026";

  // WebPage Schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions | OG Heavy Duty",
    url: "https://ogheavyduty.in/terms-and-condition",
    description:
      "Official website terms of use, commercial sales terms, warranty conditions, and legal governing law for OG Heavy Duty Air Conditioners.",
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
    dateModified: "2026-11-02",
    inLanguage: "en-IN",
  };

  // Breadcrumb Schema
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
        name: "Terms & Conditions",
        item: "https://ogheavyduty.in/terms-and-condition",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Terms & Conditions" },
  ];

  const TERMS_SECTIONS = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "specifications", label: "2. Technical Specs & Changes" },
    { id: "commercial-pricing", label: "3. Quotations & Payment" },
    { id: "delivery-inspection", label: "4. Delivery & Inspection" },
    { id: "warranty-terms", label: "5. Warranty Scope & Limits" },
    { id: "intellectual-property", label: "6. Intellectual Property" },
    { id: "acceptable-use", label: "7. Acceptable Website Use" },
    { id: "limitation-liability", label: "8. Limitation of Liability" },
    { id: "governing-law", label: "9. Governing Law (New Delhi)" },
    { id: "legal-contact", label: "10. Contact & Official Notices" },
  ];

  return (
    <>
      {/* ─── Structured Data for SEO ─────────────────────────────────── */}
      <Script
        id="terms-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="terms-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Standardized Public Page Hero Banner ─────────────────────── */}
      <PublicPageBanner
        title="Terms & Conditions"
        subtitle="Official website terms of use, commercial sales conditions, technical specification policies, and legal jurisdiction for OG Heavy Duty Air Conditioners."
        badge="COMMERCIAL & WEBSITE TERMS OF USE"
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Content Layout: Standardized 60px Spacing & High-Contrast Slate BG ─ */}
      <SectionContainer className="py-[60px] bg-[#f1f5f9]">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ─── Sticky Sidebar Navigation (4 cols) ─────────────────────── */}
            <aside className="lg:col-span-4 order-2 lg:order-1 lg:sticky lg:top-24 self-start">
              {/* Unified Elevated Sidebar Card (Matches Warranty Terms) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow space-y-6">
                
                {/* Table of Contents */}
                <div>
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                    <Scale size={18} className="text-[#0f7ae0]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Terms of Use Index
                    </h3>
                  </div>

                  <nav aria-label="Terms and Conditions Sections">
                    <ul className="space-y-1 text-xs sm:text-[13px] font-sans">
                      {TERMS_SECTIONS.map((link) => (
                        <li key={link.id}>
                          <a
                            href={`#${link.id}`}
                            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#0f7ae0] hover:bg-blue-50 transition-colors font-medium"
                          >
                            <ChevronRight size={13} className="text-slate-400 shrink-0" />
                            <span>{link.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Quick PDF Download CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <a
                    href="/documents/og-heavy-duty-catalogue-2026-2027.pdf"
                    download
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0f7ae0] transition shadow-2xs"
                  >
                    <Download size={14} />
                    <span>Download Official Catalogue PDF</span>
                  </a>

                  <p className="text-[11px] text-slate-500 text-center font-sans">
                    Effective Date: {lastUpdated} • Certified Valid
                  </p>
                </div>

                {/* Commercial Desk Support */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={15} className="text-[#0f7ae0]" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Commercial Desk Support
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    For legal notices or commercial supply inquiries:
                  </p>
                  <div className="space-y-1.5 text-xs font-sans text-slate-700">
                    <p>
                      <span className="text-slate-500">Helpline: </span>
                      <a href="tel:011-35727834" className="font-bold text-slate-900 hover:text-[#0f7ae0]">
                        011-35727834
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Sales Email: </span>
                      <a href="mailto:sales@ogheavyduty.in" className="font-semibold text-[#0f7ae0] hover:underline">
                        sales@ogheavyduty.in
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Jurisdiction: </span>
                      <span className="font-medium text-slate-800">New Delhi, India</span>
                    </p>
                  </div>
                </div>

              </div>
            </aside>

            {/* ─── Terms Narrative Content (8 cols) ───────────────────── */}
            <article className="lg:col-span-8 order-1 lg:order-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-10 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] prose prose-slate max-w-none prose-headings:scroll-mt-28">
              {/* Section 1 */}
              <section id="acceptance" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">1.</span> Acceptance of Terms
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  By accessing, browsing, or utilizing the website <strong>https://ogheavyduty.in</strong>, downloading technical documents, submitting digital inquiry forms, or purchasing air conditioning equipment from <strong>O.G. HEAVY DUTY</strong>, you agree to be bound by these Terms &amp; Conditions, our <Link href="/privacy-policy" className="text-[#0f7ae0] underline">Privacy Policy</Link>, and all applicable laws and regulations of India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </section>

              {/* Section 2 */}
              <section id="specifications" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">2.</span> Technical Specifications &amp; Continuous Improvement Notice
                </h2>
                <div className="bg-slate-50 border-l-4 border-[#0f7ae0] p-4 rounded-r-lg my-4 text-xs sm:text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Official Specification Disclaimer:</p>
                  <p className="mt-1">
                    The models, dimensions, performance ratings, electrical parameters, and specifications published on this website and in our catalogues are subject to continuous technical improvement without prior notice.
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Cooling capacities (BTU/hr, Watts), energy efficiency ratings (ISEER), sound levels (dB(A)), and airflow rates (CFM) are determined under standard factory test conditions. Operating performance in real-world installations may vary according to actual ambient heat loads, electrical line voltage stability, indoor ceiling heights, solar radiation exposure, and piping run lengths.
                </p>
              </section>

              {/* Section 3 */}
              <section id="commercial-pricing" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">3.</span> Quotations, Pricing &amp; Payment Modes
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Commercial quotations issued by OG Heavy Duty remain valid for the period expressly stated in the written quotation document. Because heavy copper coils and electrical components are tied to international commodity markets, quotations may be subject to revision upon expiry of their validity period.
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 my-4">
                  <p className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-[#0f7ae0]" />
                    Accepted Modes of Payment:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                    <li><strong>Direct In-Store:</strong> Cash, Unified Payments Interface (UPI), Debit Cards, and Credit Cards.</li>
                    <li><strong>EMI Facilities:</strong> Available on major bank debit and credit cards for qualifying transactions.</li>
                    <li><strong>Commercial &amp; Institutional:</strong> Direct bank transfer via RTGS / NEFT against authorized Performa or GST Tax Invoices.</li>
                  </ul>
                </div>
                <p className="text-xs text-slate-500">
                  All commercial equipment sales are executed accompanied by an official Tax Invoice adhering strictly to Indian Goods and Services Tax (GST) rules.
                </p>
              </section>

              {/* Section 4 */}
              <section id="delivery-inspection" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">4.</span> Delivery, Transit Inspection &amp; Site Readiness
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Delivery schedules communicated by our logistics desk represent estimated dispatch timeframes. OG Heavy Duty strives to meet delivery commitments but shall not be liable for transit delays caused by force majeure, severe weather disruptions, municipal transportation restrictions, or strikes.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li><strong>Transit Inspection:</strong> The buyer or receiving representative must inspect exterior wooden crates / carton packaging upon physical delivery and note any overt transit damage on the consignment note before signing.</li>
                  <li><strong>Site Readiness:</strong> Safe execution of HVAC installation requires that the client provides appropriate electrical circuits (with dedicated MCB breakers and reliable earthing), secure wall/rooftop scaffolding, and unimpeded access for technicians.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="warranty-terms" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">5.</span> Warranty Scope &amp; Exclusions
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  OG Heavy Duty equipment is backed by manufacturer warranty coverage against defects in manufacturing, materials, and workmanship when installed and operated according to manufacturer technical guidelines:
                </p>
                <div className="space-y-3 mt-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">Standard Warranty Scope</p>
                    <p className="text-xs text-slate-600">
                      Covers repair or replacement of defective internal mechanical/electrical parts and extended compressor protection as defined in the specific warranty policy document accompanying the equipment.
                    </p>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                    <p className="font-semibold text-amber-900 text-sm mb-1">General Warranty Exclusions</p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-amber-800">
                      <li>Equipment operated with severe input voltage irregularities outside specified tolerances without an appropriate voltage stabilizer.</li>
                      <li>Damage caused by unauthorized third-party repairs, tampering, or internal refrigerant alteration by uncertified personnel.</li>
                      <li>External physical impact, flood, fire, seismic disturbance, or corrosive chemical industrial atmospheres beyond equipment ratings.</li>
                      <li>Normal wear and tear of plastic air filters, remote control handsets, and routine preventive cleaning requirements.</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  For model-specific coverage terms, refer to our official <Link href="/resources?category=warranty" className="text-[#0f7ae0] underline">Warranty Terms &amp; Conditions Document</Link>.
                </p>
              </section>

              {/* Section 6 */}
              <section id="intellectual-property" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">6.</span> Intellectual Property &amp; Trademarks
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  All trademarks, service marks, brand names, trade dress, product nomenclature, logos, technical schematics, 3D renderings, and copywriting displayed on this website are the registered or unregistered intellectual property of <strong>O.G. HEAVY DUTY</strong> or their respective proprietary owners.
                </p>
                <p className="text-sm leading-relaxed text-slate-600 mt-2">
                  Nothing contained on this website should be construed as granting, by implication or estoppel, any license or right to utilize any trademark or copyrighted asset without prior express written authorization from OG Heavy Duty management.
                </p>
              </section>

              {/* Section 7 */}
              <section id="acceptable-use" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">7.</span> Acceptable Website Use &amp; Digital Security
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  When utilizing our website, interactive tools, and submission forms, you agree NOT to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li>Use automated web crawlers, bots, or scrapers to harvest catalog data, pricing, or technical manuals without written permission.</li>
                  <li>Transmit fraudulent, spam, or malicious payloads through public Contact, Career, or Product Enquiry form endpoints.</li>
                  <li>Attempt to bypass, defeat, or probe security rate-limiting, CAPTCHA, authentication mechanisms, or file-upload validations.</li>
                  <li>Attempt to gain unauthorized administrative access to database clusters, server APIs, or internal CMS management systems.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="limitation-liability" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">8.</span> Limitation of Liability
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  To the maximum extent permitted by applicable Indian law, OG Heavy Duty, its directors, officers, engineers, and employees shall not be liable for any indirect, incidental, consequential, special, or punitive damages—including loss of commercial profits, business interruption, or data loss—arising out of the use or inability to use the website, delayed deliveries, or operational interruptions.
                </p>
                <p className="text-sm leading-relaxed text-slate-600 mt-2">
                  In any event, OG Heavy Duty&apos;s total aggregate liability arising out of or related to equipment supply shall not exceed the actual invoice purchase price paid by the customer for the specific unit giving rise to the claim.
                </p>
              </section>

              {/* Section 9 */}
              <section id="governing-law" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">9.</span> Governing Law &amp; Dispute Jurisdiction
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  These Terms &amp; Conditions and all commercial transactions arising hereunder shall be governed by, interpreted, and construed in accordance with the substantive laws of the <strong>Republic of India</strong>, without giving effect to conflict-of-law principles.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-xs sm:text-sm text-slate-800">
                  <p className="font-bold mb-1">Exclusive Jurisdiction:</p>
                  <p>
                    The competent civil courts and commercial tribunals located at <strong>New Delhi, India</strong> shall have sole and exclusive jurisdiction over any suit, action, dispute, or proceeding arising out of or in connection with these Terms, website operations, or commercial sales contracts.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="legal-contact" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">10.</span> Commercial Desk &amp; Legal Notices
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  For formal communications, legal notices, or clarifications regarding these Terms &amp; Conditions, please address correspondence to:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4 space-y-2 text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900 text-base">O.G. HEAVY DUTY</p>
                  <p><strong>Corporate &amp; Commercial Office:</strong> D-14, Rajan Babu Road, Adarsh Nagar, New Delhi – 110033, India</p>
                  <p><strong>Nearest Landmark:</strong> In close proximity to Dominos, Adarsh Nagar</p>
                  <p><strong>Helpline:</strong> 011-35727834 (Monday – Saturday: 10:00 AM – 7:00 PM)</p>
                  <p><strong>Commercial Inquiries:</strong> <a href="mailto:sales@ogheavyduty.in" className="text-[#0f7ae0] underline">sales@ogheavyduty.in</a></p>
                  <p><strong>General Support:</strong> <a href="mailto:info@ogheavyduty.in" className="text-[#0f7ae0] underline">info@ogheavyduty.in</a></p>
                </div>
              </section>

                {/* Terms Updates Notice */}
                <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
                  <p>
                    OG Heavy Duty reserves the right to amend these Terms &amp; Conditions at its sole discretion without prior notice. Visitors are encouraged to periodically review this page to remain informed of any modifications. Continued use of our site following any changes constitutes acceptance of the amended terms.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}

