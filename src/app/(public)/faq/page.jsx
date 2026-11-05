import React, { cache } from "react";
import Script from "next/script";
import FaqClient from "./FaqClient";
import { connectDB } from "../../lib/config";
import Faq from "../../models/Faq";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

// Revalidate FAQ page cache every 1 hour (3600 seconds)
export const revalidate = 3600;

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | OG Heavy Duty",
  description:
    "Find answers to frequently asked questions about OG Heavy Duty air conditioners, accepted payment modes (Cash, UPI, Cards, EMI), Adarsh Nagar store location, operating hours, cooling tonnage sizing, and technical warranty support.",
  alternates: {
    canonical: "https://ogheavyduty.in/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | OG Heavy Duty",
    description:
      "Find answers to common questions on OG Heavy Duty air conditioners, store hours, payment modes (Cash, UPI, Cards, EMI), Adarsh Nagar landmark, and high-ambient cooling equipment.",
    url: "https://ogheavyduty.in/faq",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | OG Heavy Duty",
    description:
      "Answers to top questions regarding OG Heavy Duty air conditioners, accepted payment methods, store landmark, hours, and HVAC warranties.",
  },
};

// Verified FAQs with legacy store questions and HVAC technical answers
const FAQ_ITEMS = [
  // ─── 4 Verified Legacy Store Inquiries (from ognext/faq.php) ───
  {
    id: "payment-modes",
    category: "general",
    isVerified: true,
    question: "What are the various modes of payment accepted here?",
    answer:
      "You can make payment via Cash, Net Banking, UPI & Debit & Credit Cards. For commercial and institutional contracts, direct RTGS/NEFT bank transfers against official tax invoices are also accepted.",
    answerHtml:
      "<p>You can make payment via <strong>Cash, Net Banking, UPI &amp; Debit &amp; Credit Cards</strong>.</p><p class='mt-2'>For institutional, commercial, and government supply contracts, direct RTGS/NEFT bank transfers against official GST tax invoices are supported.</p>",
  },
  {
    id: "nearest-landmark",
    category: "general",
    isVerified: true,
    question: "Which is the nearest landmark to your Delhi showroom?",
    answer:
      "You can easily locate the establishment as it is in close proximity to Dominos, Adarsh Nagar. Our full registered showroom address is D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033.",
    answerHtml:
      "<p>You can easily locate the establishment as it is in <strong>close proximity to Dominos, Adarsh Nagar</strong>.</p><p class='mt-2'>Our complete showroom address is: <br/><strong>D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033</strong>.</p>",
    relatedLink: {
      label: "View Contact Information & Map",
      href: "/contact-us",
    },
  },
  {
    id: "operating-hours",
    category: "general",
    isVerified: true,
    question: "What are your showroom & office hours of operation?",
    answer:
      "The establishment is functional Monday through Sunday from 10:00 AM to 7:00 PM (Monday to Saturday: 10:00 AM - 7:30 PM for warehouse operations and corporate support).",
    answerHtml:
      "<p>The establishment is functional on:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Monday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Tuesday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Wednesday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Thursday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Friday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Saturday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Sunday:</strong> 10:00 AM – 7:00 PM</li></ul>",
  },
  {
    id: "emi-options",
    category: "general",
    isVerified: true,
    question: "Is an EMI payment option available for air conditioner purchases?",
    answer:
      "Yes, EMI can be made using both debit and credit cards across major participating Indian banks.",
    answerHtml:
      "<p><strong>Yes, EMI can be made using both debit and credit cards</strong> across major participating Indian banks for qualifying in-store purchases and commercial transactions.</p>",
  },

  // ─── Technical & Engineering Questions ───
  {
    id: "high-ambient-engineering",
    category: "technical",
    isVerified: false,
    question: "What makes OG Heavy Duty air conditioners suitable for severe tropical heatwaves (up to 52°C)?",
    answer:
      "OG Heavy Duty air conditioners are specifically designed for high-ambient tropical environments up to 52°C. They incorporate 100% heavy copper condenser and evaporator coils with corrosion-resistant blue fin coatings, heavy-gauge sheet metal cabinetry, and robust compressors designed to deliver sustained cooling without high-pressure thermal tripping.",
    answerHtml:
      "<p>OG Heavy Duty air conditioners are engineered specifically for high-ambient climates up to <strong>52°C</strong>. Key engineering differentiators include:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>100% Inner-Grooved Copper Coils:</strong> Maximizes heat exchange surface area and durability under severe heat.</li><li><strong>Anti-Corrosive Fin Coating:</strong> Protects condenser and evaporator tubing from atmospheric pollutants and humidity.</li><li><strong>Heavy-Gauge Sheet Metal:</strong> Rigid, acoustic-dampened outdoor chassis designed for heavy commercial and residential exposure.</li><li><strong>High-Ambient Tropical Compressors:</strong> Tested to operate continuously in extreme summer conditions without thermal overload trips.</li></ul>",
    relatedLink: {
      label: "Explore Our Product Engineering",
      href: "/products/split-ac",
    },
  },
  {
    id: "product-range",
    category: "technical",
    isVerified: true,
    question: "What types of heavy-duty air conditioning systems does OG Heavy Duty manufacture?",
    answer:
      "We provide a comprehensive portfolio of high-ambient cooling solutions: Window AC (1.0 Ton and 1.5 Ton models), Split AC (1.5 Ton and 2.0 Ton Inverter & Fixed Speed models), Cassette AC (2.0 Ton and 2.5 Ton 4-way ceiling units), Floor Standing / Tower AC (2.0 Ton and 4.0 Ton units), and Ductable AC (2.0 Ton and 3.0 Ton concealed ducted systems). Custom high-tonnage multi-split and VRF packaged systems are available for engineered commercial projects upon consultation.",
    answerHtml:
      "<p>Our standard product catalog covers the complete spectrum of residential, commercial, and institutional cooling:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Window AC:</strong> 1.0 Ton &amp; 1.5 Ton heavy-duty window units.</li><li><strong>Split AC:</strong> 1.5 Ton &amp; 2.0 Ton inverter and fixed-speed systems.</li><li><strong>Cassette AC:</strong> 2.0 Ton &amp; 2.5 Ton 4-way airflow ceiling-recessed units.</li><li><strong>Floor Standing / Tower AC:</strong> 2.0 Ton &amp; 4.0 Ton vertical cooling units.</li><li><strong>Ductable AC:</strong> 2.0 Ton &amp; 3.0 Ton concealed ducted systems.</li><li><strong>Commercial &amp; Custom Range:</strong> Engineered multi-split and high-ambient customized configurations available on project request.</li></ul>",
    relatedLink: {
      label: "Browse Split Air Conditioners",
      href: "/products/split-ac",
    },
  },
  {
    id: "tonnage-selection",
    category: "sizing",
    isVerified: false,
    question: "How do I determine the right AC tonnage for my room or commercial space?",
    answer:
      "Cooling capacity depends on floor area, ceiling height, sunlight exposure, window orientation, and occupant load. For standard 10-foot ceilings: up to 120 sq ft typically requires 1.0 Ton; 120 to 180 sq ft requires 1.5 Ton; 180 to 240 sq ft requires 2.0 Ton. Top-floor spaces or commercial venues benefit from our interactive AC Sizing Calculator.",
    answerHtml:
      "<p>As a general guideline for standard 10-foot residential or office ceilings:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Up to 120 sq. ft.:</strong> 1.0 Ton capacity</li><li><strong>120 to 180 sq. ft.:</strong> 1.5 Ton capacity</li><li><strong>180 to 240 sq. ft.:</strong> 2.0 Ton capacity</li><li><strong>Above 250 sq. ft. or Top Floors:</strong> 3.0 Ton+ Cassette, Floor Standing, or Ductable HVAC systems</li></ul><p class='mt-2'>Top-floor installations with direct rooftop solar exposure or large west-facing glass facades often require an additional 0.5 Ton buffer to maintain target indoor temperatures during 45°C+ summer peaks.</p>",
    relatedLink: {
      label: "Calculate Exact Capacity with AC Sizing Tool",
      href: "/ac-sizing",
    },
  },
  {
    id: "copper-vs-aluminum",
    category: "technical",
    isVerified: false,
    question: "Why does OG Heavy Duty prioritize 100% copper coils over aluminum?",
    answer:
      "Copper possesses approximately double the thermal conductivity of aluminum, ensuring significantly faster heat dissipation and superior electrical efficiency. Copper is also structurally robust, ductile, and easily repairable via on-site brazing in the event of micro-leaks, whereas punctured aluminum coils usually require expensive full-unit coil replacements.",
    answerHtml:
      "<p><strong>100% Copper coils</strong> offer major technical advantages over aluminum:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Superior Heat Transfer:</strong> Copper has higher thermal conductivity, cooling spaces faster and lowering compressor run-time.</li><li><strong>Corrosion Resistance:</strong> High resistance to oxidation and environmental pollutants common in urban and industrial zones.</li><li><strong>Serviceability &amp; Longevity:</strong> Copper coils can be brazed and repaired on-site by certified technicians, avoiding the high cost of complete coil replacements typical with aluminum.</li></ul>",
  },
  {
    id: "institutional-supply",
    category: "commercial",
    isVerified: false,
    question: "Does OG Heavy Duty provide HVAC solutions for government, corporate, and institutional clients?",
    answer:
      "Yes. OG Heavy Duty is a trusted supplier to government ministries, public sector enterprises, universities, healthcare institutions, and corporate facilities across India. Our client roster includes installations for CPWD, Delhi University, Ministry of Railways, JNU, State Bank of India, and ESIC.",
    answerHtml:
      "<p>Yes. OG Heavy Duty has delivered HVAC systems to leading public sector undertakings, premier universities, healthcare centers, and corporate facilities across India, including:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Central Public Works Department (CPWD)</strong> &amp; <strong>Ministry of Railways</strong></li><li><strong>University of Delhi</strong> &amp; <strong>Jawaharlal Nehru University (JNU)</strong></li><li><strong>State Bank of India</strong> &amp; <strong>Punjab National Bank</strong></li><li><strong>Employees' State Insurance Corporation (ESIC)</strong></li></ul><p class='mt-2'>We support government e-marketplace (GeM) requirements, tender specifications, and custom ductable/cassette drawings.</p>",
    relatedLink: {
      label: "View Verified Client Installations",
      href: "/clients",
    },
  },
  {
    id: "warranty-terms",
    category: "service",
    isVerified: false,
    question: "What is the standard warranty coverage on OG Heavy Duty air conditioners?",
    answer:
      "Our air conditioners come with comprehensive manufacturer warranty coverage including standard coverage on the overall unit and extended warranty on the compressor. Specific terms vary by model category. Full warranty policy terms and registration details are available in our Download Center.",
    answerHtml:
      "<p>OG Heavy Duty air conditioners include:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Standard Unit Warranty:</strong> Comprehensive warranty on internal electrical and mechanical components.</li><li><strong>Extended Compressor Warranty:</strong> Multi-year protection on rotary and scroll compressors against internal mechanical failures.</li><li><strong>100% Copper Condenser Protection:</strong> Manufacturer coverage against manufacturing defects in coil brazing.</li></ul><p class='mt-2'>To preserve warranty validity, installations must be performed according to manufacturer guidelines, and annual preventive maintenance should be completed by qualified technicians.</p>",
    relatedLink: {
      label: "Download Official Warranty Policy Document",
      href: "/resources?category=warranty",
    },
  },
  {
    id: "download-manuals",
    category: "service",
    isVerified: false,
    question: "Where can I download product catalogues, error code charts, and user manuals?",
    answer:
      "Official technical documentation—including our 2026-2027 Master Product Catalogue, Diagnostic Error Code Reference, User Operating Manuals, and Warranty Terms—is freely accessible in PDF format from our Technical Resources & Download Center.",
    answerHtml:
      "<p>All official technical publications are freely available for download in PDF format on our <strong>Technical Resources &amp; Download Center</strong>, including:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Master Product Catalogue (2026–2027 edition)</li><li>Split, Cassette, and Window AC User Operation Manuals</li><li>Diagnostic Digital Error Code Reference Chart</li><li>Warranty Terms &amp; Conditions Certificate</li></ul>",
    relatedLink: {
      label: "Visit Technical Resources & Download Center",
      href: "/resources",
    },
  },
  {
    id: "schedule-service",
    category: "service",
    isVerified: false,
    question: "How do I schedule an installation, site survey, or preventive maintenance service?",
    answer:
      "You can contact our customer service and technical support helpline at 011-35727834 or email us at info@ogheavyduty.in. You can also submit an online enquiry form, and an HVAC technical consultant will respond within 24 business hours.",
    answerHtml:
      "<p>You can schedule an installation, site inspection, or service consultation through any of the following channels:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Phone Helpline:</strong> 011-35727834 (Mon–Sun: 10:00 AM – 7:00 PM)</li><li><strong>Direct Mobile / WhatsApp:</strong> +91 93199 77568</li><li><strong>Email:</strong> <a href='mailto:info@ogheavyduty.in' class='text-[#0f7ae0] underline'>info@ogheavyduty.in</a></li><li><strong>Online Form:</strong> Fill out our quick <a href='/contact-us' class='text-[#0f7ae0] underline'>Contact &amp; Enquiry Form</a></li></ul>",
    relatedLink: {
      label: "Submit an Online Service Request",
      href: "/contact-us",
    },
  },
];

const getFaqs = cache(async () => {
  try {
    await connectDB();
    const docs = await Faq.find({ status: "active" }).sort({ sort: 1, createdAt: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
        id: String(d._id),
        category: d.category,
        isVerified: d.isVerified,
        question: d.question,
        answer: d.answer,
        answerHtml: d.answerHtml || d.answer,
        relatedLink: d.relatedLink?.label ? d.relatedLink : null,
      }));
    }
  } catch (err) {
    console.warn("[faq] Failed to query Faq from DB:", err.message);
  }
  return FAQ_ITEMS;
});

export default async function FaqPage() {
  const faqs = await getFaqs();

  // Schema.org FAQPage Structured Data
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Frequently Asked Questions" },
  ];

  return (
    <>
      {/* ─── Structured Data for SEO ─────────────────────────────────── */}
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      {/* ─── Consistent Public Page Hero Banner ──────────────────────── */}
      <PublicPageBanner
        title="Frequently Asked Questions"
        subtitle="Find verified answers regarding our Delhi showroom, accepted payment methods (Cash, UPI, Cards, EMI), operating hours, cooling tonnage sizing, and heavy-duty HVAC engineering."
        badge="CUSTOMER & TECHNICAL SUPPORT"
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Content Section: Standardized 60px Spacing ─────────── */}
      <SectionContainer className="py-[60px] bg-[#f8fafc]/50">
        <PageContainer>
          <FaqClient faqs={faqs} />
        </PageContainer>
      </SectionContainer>
    </>
  );
}
