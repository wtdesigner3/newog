import React from "react";
import Link from "next/link";
import Script from "next/script";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import EnquiryForm from "../../../components/forms/EnquiryForm";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const metadata = {
  title: "Contact OG Heavy Duty | Customer Care, Sales & Dealer Enquiries",
  description:
    "Contact OG Heavy Duty Air Conditioners. Reach our New Delhi headquarters for institutional cooling enquiries, dealer partnerships, warranty support, and technical assistance.",
  alternates: {
    canonical: "https://ogheavyduty.in/contact",
  },
  openGraph: {
    title: "Contact Us | OG Heavy Duty Air Conditioners",
    description:
      "Get in touch with OG Heavy Duty for industrial and commercial air conditioning inquiries, technical support, and dealer distribution.",
    url: "https://ogheavyduty.in/contact",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | OG Heavy Duty Air Conditioners",
    description:
      "Official customer contact, corporate office address, and sales helpline for OG Heavy Duty Air Conditioners.",
  },
};

export default function ContactPage() {
  // Verified Corporate Data
  const primaryPhone = "011-35727834";
  const mobilePhone = "+91 93199 77568";
  const primaryEmail = "info@ogheavyduty.in";
  const salesEmail = "sales@ogheavyduty.in";
  const address = "D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033";
  const workingHours = "Monday – Saturday: 10:00 AM – 7:30 PM";
  const sundayHours = "Sunday: 10:00 AM – 7:00 PM (Showroom Open)";

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact OG Heavy Duty",
    description:
      "Official contact directory and customer support channels for OG Heavy Duty Air Conditioners.",
    url: "https://ogheavyduty.in/contact",
    mainEntity: {
      "@type": "HVACBusiness",
      name: "OG Heavy Duty",
      legalName: "Operationally Genius Heavy Duty",
      url: "https://ogheavyduty.in",
      logo: "https://ogheavyduty.in/images/og-logo.png",
      telephone: primaryPhone,
      email: primaryEmail,
      address: {
        "@type": "PostalAddress",
        streetAddress: "D-14, Rajan Babu Road, Adarsh Nagar",
        addressLocality: "North Delhi",
        addressRegion: "Delhi",
        postalCode: "110033",
        addressCountry: "IN",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "19:30",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday"],
          opens: "10:00",
          closes: "19:00",
        },
      ],
    },
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
        name: "Contact Us",
        item: "https://ogheavyduty.in/contact",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact Us" },
  ];

  return (
    <>
      {/* ─── Structured Data for SEO ─────────────────────────────────── */}
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Script
        id="contact-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Consistent Public Page Hero Banner ──────────────────────── */}
      <PublicPageBanner
        title="Contact Us"
        subtitle="Whether you are an institutional buyer, dealer partner, facility engineer, or commercial client, our New Delhi technical desk is at your service."
        badge="CUSTOMER CARE & COMMERCIAL SALES"
        bgImage="/uploads/breadcrumb/1648811556_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Content Section: Standardized 60px Spacing & High-Contrast Slate BG ─────────── */}
      <SectionContainer className="py-[60px] bg-[#f1f5f9]">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ─── Left Column: Corporate Coordinates (5 cols) ───────────── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Corporate Office Card: Elevated with Distinct Border & Shadow */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow">
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f7ae0] block">
                      New Delhi Headquarters
                    </span>
                    <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-tight">
                      Corporate &amp; Sales Office
                    </h2>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <MapPin size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Showroom &amp; Office Location</p>
                      <p className="text-slate-600 mt-0.5 leading-relaxed font-sans">{address}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f7ae0] hover:text-[#0c68c2] hover:underline mt-2 transition"
                      >
                        <span>View Directions on Google Maps</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* Telephone Lines */}
                  <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <Phone size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Telephone Lines</p>
                      <p className="text-slate-600 mt-1 font-sans">
                        <span className="text-slate-500 text-xs">Direct Showroom: </span>
                        <a
                          href={`tel:${primaryPhone}`}
                          className="font-bold text-slate-900 hover:text-[#0f7ae0] transition-colors"
                        >
                          {primaryPhone}
                        </a>
                      </p>
                      <p className="text-slate-600 mt-0.5 font-sans">
                        <span className="text-slate-500 text-xs">Mobile / WhatsApp: </span>
                        <a
                          href={`tel:${mobilePhone.replace(/\s/g, "")}`}
                          className="font-bold text-slate-900 hover:text-[#0f7ae0] transition-colors"
                        >
                          {mobilePhone}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <Mail size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Official Correspondence</p>
                      <p className="text-slate-600 mt-1 font-sans">
                        <span className="text-slate-500 text-xs">General Support: </span>
                        <a
                          href={`mailto:${primaryEmail}`}
                          className="font-semibold text-[#0f7ae0] hover:underline"
                        >
                          {primaryEmail}
                        </a>
                      </p>
                      <p className="text-slate-600 mt-0.5 font-sans">
                        <span className="text-slate-500 text-xs">Commercial / Sales: </span>
                        <a
                          href={`mailto:${salesEmail}`}
                          className="font-semibold text-[#0f7ae0] hover:underline"
                        >
                          {salesEmail}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0f7ae0] shrink-0 mt-0.5">
                      <Clock size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Operational Hours</p>
                      <p className="text-slate-600 mt-1 font-sans">{workingHours}</p>
                      <p className="text-slate-500 text-xs mt-0.5 font-sans">{sundayHours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Right Column: Customer Enquiry Form (7 cols) ──────────── */}
            <div className="lg:col-span-7">
              {/* Enquiry Card: Elevated with Distinct Border & Shadow */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-9 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow">
                <div className="mb-5 pb-4 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0f7ae0] border border-blue-200/80 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={12} />
                    <span>Commercial &amp; Retail Inquiries</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
                    Submit an Official Enquiry
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-sans">
                    Fill out the form below. Inquiries are routed directly to our regional sales and HVAC applications engineers in New Delhi.
                  </p>
                </div>

                <EnquiryForm />
              </div>
            </div>
          </div>

          {/* ─── Location Map Card (Container Approach) ────────────────── */}
          <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.04)] bg-white hover:shadow-[0_16px_44px_-8px_rgba(15,122,224,0.12)] transition-shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-tight">
                    Location Map — Adarsh Nagar Showroom &amp; Office
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033
                  </p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f7ae0] hover:text-[#0c68c2] px-3.5 py-2 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 transition shadow-2xs"
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="w-full h-80 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <iframe
                src="https://maps.google.com/maps?q=D-14,+Rajan+Babu+Road,+Adarsh+Nagar,+New+Delhi+-+110033&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="OG Heavy Duty Corporate Office Map"
              />
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}
