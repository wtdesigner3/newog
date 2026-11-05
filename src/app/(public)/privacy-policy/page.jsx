import React from "react";
import Script from "next/script";
import Link from "next/link";
import {
  ShieldCheck,
  ChevronRight,
  Lock,
  FileText,
  UserCheck,
  Eye,
  Server,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  HelpCircle,
  Download,
} from "lucide-react";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const metadata = {
  title: "Privacy Policy | OG Heavy Duty",
  description:
    "Read the official privacy policy of OG Heavy Duty Air Conditioners. Learn how we collect, process, protect, and handle your digital inquiry, contact, and career application data under India's Digital Personal Data Protection Act (DPDP Act 2023).",
  alternates: {
    canonical: "https://ogheavyduty.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | OG Heavy Duty",
    description:
      "Official privacy policy for OG Heavy Duty Air Conditioners (D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033). Information on data protection, cookies, user rights, and DPDP Act 2023 compliance.",
    url: "https://ogheavyduty.in/privacy-policy",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | OG Heavy Duty",
    description:
      "Privacy policy, data collection disclosures, and DPDP Act 2023 compliance for OG Heavy Duty Air Conditioners.",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 2, 2026";

  // WebPage Schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy | OG Heavy Duty",
    url: "https://ogheavyduty.in/privacy-policy",
    description:
      "Official privacy policy and personal data protection disclosures for OG Heavy Duty Air Conditioners under the Digital Personal Data Protection Act, 2023.",
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
        name: "Privacy Policy",
        item: "https://ogheavyduty.in/privacy-policy",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy" },
  ];

  const PRIVACY_SECTIONS = [
    { id: "corporate-identity", label: "1. Corporate Identity & Scope" },
    { id: "regulatory-framework", label: "2. Regulatory Framework (DPDP 2023)" },
    { id: "data-we-collect", label: "3. Personal Data We Collect" },
    { id: "purpose-of-processing", label: "4. Purpose & Lawful Grounds" },
    { id: "sharing-disclosure", label: "5. Data Sharing & Disclosures" },
    { id: "data-security", label: "6. Security & Storage Standards" },
    { id: "data-retention", label: "7. Data Retention Policy" },
    { id: "cookie-policy", label: "8. Cookies & Telemetry" },
    { id: "user-rights", label: "9. Your Rights as Data Principal" },
    { id: "grievance-officer", label: "10. Grievance Redressal & Contact" },
  ];

  return (
    <>
      {/* ─── Structured Data for SEO ─────────────────────────────────── */}
      <Script
        id="privacy-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="privacy-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Standardized Public Page Hero Banner ─────────────────────── */}
      <PublicPageBanner
        title="Privacy Policy"
        subtitle="OG Heavy Duty is committed to safeguarding personal data and maintaining strict digital privacy standards in compliance with India's Digital Personal Data Protection Act, 2023 (DPDP Act 2023)."
        badge="DATA PROTECTION & DPDP ACT 2023 COMPLIANCE"
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
                    <ShieldCheck size={18} className="text-[#0f7ae0]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Privacy Policy Index
                    </h3>
                  </div>

                  <nav aria-label="Privacy Policy Sections">
                    <ul className="space-y-1 text-xs sm:text-[13px] font-sans">
                      {PRIVACY_SECTIONS.map((link) => (
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

                {/* Grievance & Direct Inquiries */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={15} className="text-[#0f7ae0]" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Grievance &amp; Compliance Desk
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Direct inquiries regarding data privacy &amp; user rights:
                  </p>
                  <div className="space-y-1.5 text-xs font-sans text-slate-700">
                    <p>
                      <span className="text-slate-500">Helpline: </span>
                      <a href="tel:011-35727834" className="font-bold text-slate-900 hover:text-[#0f7ae0]">
                        011-35727834
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Email: </span>
                      <a href="mailto:info@ogheavyduty.in" className="font-semibold text-[#0f7ae0] hover:underline">
                        info@ogheavyduty.in
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Location: </span>
                      <span className="font-medium text-slate-800">Adarsh Nagar, New Delhi</span>
                    </p>
                  </div>
                </div>

              </div>
            </aside>

            {/* ─── Policy Narrative Content (8 cols) ───────────────────── */}
            <article className="lg:col-span-8 order-1 lg:order-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-10 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] prose prose-slate max-w-none prose-headings:scroll-mt-28">
              {/* Pre-Deployment Compliance Notice */}
              <div className="p-4 mb-8 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed shadow-xs not-prose">
                <p className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                  <span>Pre-Deployment Operational Notice</span>
                </p>
                <p>
                  This Privacy Policy reflects active technical architecture, private document storage safeguards, and statutory provisions under India&apos;s Digital Personal Data Protection Act, 2023 and Information Technology Act, 2000. Formal review and approval by qualified Indian corporate legal counsel is required prior to public production deployment.
                </p>
              </div>

              {/* Section 1 */}
              <section id="corporate-identity" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">1.</span> Corporate Identity & Scope
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  This Privacy Policy applies to the official website (<strong>https://ogheavyduty.in</strong>) and digital services operated by <strong>O.G. HEAVY DUTY</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), having its principal commercial establishment at:
                </p>
                <div className="bg-slate-50 border-l-4 border-[#0f7ae0] p-4 rounded-r-lg my-4 text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900">O.G. HEAVY DUTY</p>
                  <p>D-14, Rajan Babu Road, Adarsh Nagar, New Delhi – 110033, India</p>
                  <p className="mt-1">Nearest Landmark: In close proximity to Dominos, Adarsh Nagar</p>
                  <p>Contact Phone: 011-35727834 | Email: info@ogheavyduty.in</p>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  This Policy governs how we collect, process, manage, and safeguard information obtained through our public website, online contact forms, career submission portals, interactive AC sizing estimators, and technical resource downloads.
                </p>
              </section>

              {/* Section 2 */}
              <section id="regulatory-framework" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">2.</span> Regulatory Framework (DPDP Act, 2023)
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  We adhere strictly to the statutory requirements of India&apos;s <strong>Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)</strong> and the <strong>Information Technology Act, 2000</strong> (including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011). Under these frameworks:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                  <li>You are acknowledged as the <strong>Data Principal</strong> having statutory rights over your personal data.</li>
                  <li>O.G. Heavy Duty operates as the <strong>Data Fiduciary</strong> determining the purpose and means of data processing.</li>
                  <li>Personal data is processed solely for lawful purposes for which you have provided explicit, unambiguous consent or as permitted by applicable statutory law.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="data-we-collect" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">3.</span> Personal Data We Collect
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Depending on how you interact with our website, we may collect the following categories of personal data:
                </p>
                <div className="space-y-3 mt-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">A. Inquiries & Customer Communications</p>
                    <p className="text-xs text-slate-600">
                      Full name, business or residential email address, phone number, city/state, organization name, and specific cooling requirement details submitted through our Contact or Product Enquiry forms.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">B. Career & Employment Applications</p>
                    <p className="text-xs text-slate-600">
                      Full name, contact phone, email, resume/curriculum vitae (CV) document (uploaded in PDF format only, maximum 5 MB), professional work history, educational credentials, and portfolio links submitted for advertised vacancies.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">C. Interactive AC Sizing Tool Data</p>
                    <p className="text-xs text-slate-600">
                      Room dimensions (length, width, height), window exposure parameters, application environment (residential, server room, commercial office), and resulting heat load estimates calculated during browser sessions.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900 text-sm mb-1">D. Automated Telemetry & Technical Identifiers</p>
                    <p className="text-xs text-slate-600">
                      Internet Protocol (IP) address, browser user-agent, operating system, referring URL, time spent per page, and network routing metadata collected automatically to ensure web server stability, security rate-limiting, and DDoS defense.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="purpose-of-processing" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">4.</span> Purpose and Lawful Grounds for Processing
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  We process personal data only when we have a legitimate, documented reason under Indian law:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li><strong>Responding to Queries:</strong> To provide technical consultations, equipment quotations, and model specifications requested by you.</li>
                  <li><strong>Commercial Fulfillment:</strong> To coordinate site surveys, execute commercial invoices, and schedule dispatch of air conditioning systems.</li>
                  <li><strong>Talent Recruitment:</strong> To evaluate candidates for engineering, sales, technician, and administrative positions at OG Heavy Duty.</li>
                  <li><strong>Warranty & Service Operations:</strong> To authenticate warranty claims, reference diagnostic error codes, and schedule authorized maintenance visits.</li>
                  <li><strong>Security & Abuse Prevention:</strong> To prevent fraudulent submissions, enforce rate limits on public forms, and protect web infrastructure from malicious intrusions.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="sharing-disclosure" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">5.</span> Data Sharing & Third-Party Disclosures
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-xs sm:text-sm text-amber-900 font-medium">
                  OG Heavy Duty does NOT sell, rent, license, or trade your personal data to external advertisers, marketers, or data brokers under any circumstances.
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  We only disclose personal data to the following strictly defined entities:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li><strong>Authorized Logistics & Technical Partners:</strong> Trusted logistics carriers and certified installation technicians solely to complete delivery and commission HVAC equipment at your designated site.</li>
                  <li><strong>Cloud Infrastructure Providers:</strong> Managed database and hosting services (e.g. MongoDB Atlas, Vercel/Node cloud nodes) operating under strict data processing agreements and enterprise encryption standards.</li>
                  <li><strong>Statutory & Legal Obligations:</strong> When legally mandated by Indian law enforcement, tax authorities (e.g., GST portal compliance), or a valid court subpoena issued by a court of competent jurisdiction.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="data-security" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">6.</span> Security & Storage Standards
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  We employ technical and organizational measures designed to protect personal data from accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li><strong>Transport Layer Security:</strong> All data transmitted between your browser and our web servers is encrypted using modern TLS (HTTPS) protocols.</li>
                  <li><strong>Role-Based Access Control (RBAC):</strong> Administrative dashboard access is strictly compartmentalized; only authorized personnel with verified credentials can inspect customer inquiries or candidate resumes.</li>
                  <li><strong>Private Document Storage:</strong> Candidate resumes and uploaded employment documents are stored within a dedicated private server directory situated entirely outside the public web root. These documents are never accessible via direct public URLs or unauthenticated static file routing. Administrative access is strictly restricted to authorized human resources personnel via role-based access control (RBAC) and authenticated API download endpoints.</li>
                  <li><strong>Regular Audits:</strong> Application source code and APIs undergo rigorous vulnerability evaluations and penetration testing across development milestones.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="data-retention" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">7.</span> Data Retention Policy
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  We retain personal data only for as long as necessary to fulfill the specific purposes outlined in this Policy, or as required by applicable Indian statutory laws:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li><strong>Customer Enquiries:</strong> Maintained for a period of up to 24 months to assist with repeat commercial orders and ongoing service histories, after which records are archived or anonymized.</li>
                  <li><strong>Job Application Resumes:</strong> Retained for up to 12 months for active and prospective recruitment cycles, unless an applicant explicitly requests earlier deletion.</li>
                  <li><strong>Financial & Invoicing Records:</strong> Tax invoices and accounting logs are retained for a minimum of 8 years in strict accordance with the Indian Companies Act, 2013 and GST statutory retention rules.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="cookie-policy" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">8.</span> Cookies & Telemetry
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Our website utilizes cookies and similar local storage mechanisms to deliver a seamless user experience:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 mt-2">
                  <li><strong>Strictly Necessary Cookies:</strong> Essential for secure navigation, form submission tokens (CSRF protection), and maintaining authenticated administrator sessions.</li>
                  <li><strong>Functional Cookies:</strong> Retain temporary user preferences, such as selected category filters on the Download Center or FAQ explorer.</li>
                  <li><strong>Performance Analytics (Google Analytics):</strong> Anonymized metrics regarding visitor numbers, page durations, and popular downloads. These cookies do not extract directly identifiable personal records.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  You can configure your browser to decline or delete cookies at any time. However, disabling essential cookies may impact certain interactive functionalities, such as form submissions or calculator sessions.
                </p>
              </section>

              {/* Section 9 */}
              <section id="user-rights" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">9.</span> Your Rights as Data Principal
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Under the Digital Personal Data Protection Act, 2023, you possess the following statutory rights regarding your personal data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-bold text-xs text-slate-900">Right to Information</p>
                    <p className="text-xs text-slate-600 mt-0.5">Obtain a summary of personal data held by us and processing identities.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-bold text-xs text-slate-900">Right to Correction</p>
                    <p className="text-xs text-slate-600 mt-0.5">Request updating, correction, or completion of inaccurate or outdated details.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-bold text-xs text-slate-900">Right to Erasure</p>
                    <p className="text-xs text-slate-600 mt-0.5">Request erasure of your personal data where commercial purpose is fulfilled.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-bold text-xs text-slate-900">Right of Grievance Redressal</p>
                    <p className="text-xs text-slate-600 mt-0.5">Direct recourse through our designated Grievance Officer and Data Protection Board.</p>
                  </div>
                </div>
              </section>

              {/* Section 10 */}
              <section id="grievance-officer" className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span className="text-[#0f7ae0]">10.</span> Grievance Redressal & Contact Information
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  In compliance with Rule 5(9) of the IT (Reasonable Security Practices) Rules, 2011 and Section 13 of the DPDP Act, 2023, the details of our designated Grievance Officer are provided below:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4 space-y-2 text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900 text-base">Grievance Redressal Officer</p>
                  <p><strong>Entity:</strong> O.G. HEAVY DUTY</p>
                  <p><strong>Designation:</strong> Director / Legal & Compliance Officer</p>
                  <p><strong>Showroom & Office:</strong> D-14, Rajan Babu Road, Adarsh Nagar, New Delhi – 110033, India</p>
                  <p><strong>Nearest Landmark:</strong> Dominos, Adarsh Nagar</p>
                  <p><strong>Helpline:</strong> 011-35727834 (Monday – Saturday: 10:00 AM – 7:00 PM)</p>
                  <p><strong>Email:</strong> <a href="mailto:info@ogheavyduty.in" className="text-[#0f7ae0] underline">info@ogheavyduty.in</a></p>
                </div>
                <p className="text-xs text-slate-500">
                  We commit to acknowledging your grievance within 48 hours and resolving legitimate requests within 30 days of receipt, in accordance with applicable Indian statutory regulations.
                </p>
              </section>

                {/* Policy Updates Notice */}
                <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
                  <p>
                    OG Heavy Duty reserves the right to modify or update this Privacy Policy from time to time to reflect evolving legal, technical, or commercial developments. Any revisions will be published immediately on this URL with an updated Effective Date.
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

