import { cache } from "react";
import { connectDB } from "../lib/config";
import HomeSeo from "../models/HomeSeo";
import Banner from "../models/Banner";
import HomeAbout from "../models/HomeAbout";
import WhyChoose from "../models/whyChoose";
import Work from "../models/Work";
import HomeExtra from "../models/HomeExtra";
import Milestone from "../models/Milestone";
import Cta from "../models/Cta";
import Othercta from "../models/Othercta";
import Testimonial from "../models/Testimonial";
import { getAllProducts } from "src/lib/services/productService";
import {
  HeroSection,
  CompanyIntro,
  MilestonesStrip,
  CategoryShowcase,
  EngineeringDifferentiators,
  ClienteleShowcase,
  TestimonialSection,
  BlogSection,
  EnquiryCta,
} from "src/components/homepage";

// ISR: revalidate homepage cache every 5 minutes (300 seconds)
export const revalidate = 300;

// Deduplicate the HomeSeo DB query across generateMetadata and Page render
const getHomeSeo = cache(async () => {
  try {
    await connectDB();
    return await HomeSeo.findOne({ pageSlug: "home" }).lean();
  } catch (err) {
    return null;
  }
});

const getBanners = cache(async () => {
  try {
    await connectDB();
    const docs = await Banner.find({ status: "active" }).sort({ sort: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
        id: d._id.toString(),
        image: d.image || "/images/banner_ac_commercial.jpg",
        kicker: d.kicker || d.alt || "Commercial & Corporate Climate Control",
        headingPart1: d.title || "",
        headingHighlight: "",
        headingPart2: "",
        description: d.subtitle || "",
        primaryCta: {
          label: d.buttonText || "Explore Range",
          href: d.url || "/products/split-ac",
        },
        secondaryCta: {
          label: "Download Catalog",
          href: "/uploads/OG Heavy Duty-updated.pdf",
          isDownload: true,
        },
        badge: d.alt || "100% Inner-Grooved Copper",
      }));
    }
  } catch (err) {
    console.warn("[page] Failed to query Banner:", err.message);
  }
  return null;
});

const getHomeAbout = cache(async () => {
  try {
    await connectDB();
    const doc = await HomeAbout.findOne().lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch (err) {
    console.warn("[page] Failed to query HomeAbout:", err.message);
    return null;
  }
});

const getWhyChoose = cache(async () => {
  try {
    await connectDB();
    const docs = await WhyChoose.find({ status: "active" }).sort({ sort: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
        title: d.title,
        tagline: d.content,
        tag: d.title.split(" ")[0] || "52°C",
        theme: "blue",
      }));
    }
  } catch (err) {
    console.warn("[page] Failed to query WhyChoose:", err.message);
  }
  return null;
});

const getClientWork = cache(async () => {
  try {
    await connectDB();
    const docs = await Work.find({ status: "active" }).sort({ sort: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
        id: String(d._id),
        name: d.title,
        image: d.logo,
      }));
    }
  } catch (err) {
    console.warn("[page] Failed to query Work:", err.message);
  }
  return null;
});

const getHomeExtra = cache(async () => {
  try {
    await connectDB();
    return await HomeExtra.findOne().lean();
  } catch (err) {
    console.warn("[page] Failed to query HomeExtra:", err.message);
    return null;
  }
});

const getMilestones = cache(async () => {
  try {
    await connectDB();
    const docs = await Milestone.find({ status: "active" }).sort({ sort: 1, createdAt: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
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
      }));
    }
  } catch (err) {
    console.warn("[page] Failed to query Milestones:", err.message);
  }
  return null;
});

const getEngineeringCallout = cache(async () => {
  try {
    await connectDB();
    return await Cta.findOne().lean();
  } catch (err) {
    console.warn("[page] Failed to query Cta:", err.message);
    return null;
  }
});

const getLeadCta = cache(async () => {
  try {
    await connectDB();
    return await Othercta.findOne().lean();
  } catch (err) {
    console.warn("[page] Failed to query Othercta:", err.message);
    return null;
  }
});

const getTestimonials = cache(async () => {
  try {
    await connectDB();
    const docs = await Testimonial.find({ status: "active" }).sort({ sort: 1, createdAt: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map(d => ({
        id: String(d._id),
        name: d.name,
        role: d.role,
        company: d.company,
        equipment: d.equipment,
        highlight: d.highlight,
        stars: d.stars,
        quote: d.quote,
        avatar: d.avatar,
      }));
    }
  } catch (err) {
    console.warn("[page] Failed to query Testimonials:", err.message);
  }
  return null;
});

export async function generateMetadata() {
  const seoData = await getHomeSeo();

  const defaultTitle =
    "OG Heavy Duty | Heavy-Duty Air Conditioners & Commercial HVAC Solutions";
  const defaultDesc =
    "OG Heavy Duty is India's premier manufacturer of high-ambient heavy-duty air conditioners, including Window ACs, Split ACs, Cassette ACs, and Commercial HVAC systems engineered for severe tropical high-ambient climates.";

  if (!seoData) {
    return {
      title: defaultTitle,
      description: defaultDesc,
      alternates: {
        canonical: "https://ogheavyduty.in",
      },
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: "https://ogheavyduty.in",
        siteName: "OG Heavy Duty",
        type: "website",
        images: [
          {
            url: "/uploads/banner/1649073538_download.jpg",
            width: 1200,
            height: 630,
            alt: "OG Heavy Duty Air Conditioning Systems",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDesc,
        images: ["/uploads/banner/1649073538_download.jpg"],
      },
    };
  }

  return {
    title: seoData.title || defaultTitle,
    description: seoData.metaDescription || defaultDesc,
    keywords: seoData.metaKeywords?.length ? seoData.metaKeywords : undefined,
    alternates: {
      canonical: seoData.canonicalUrl || "https://ogheavyduty.in",
    },
    openGraph: {
      title: seoData.ogTitle || seoData.title || defaultTitle,
      description: seoData.ogDescription || seoData.metaDescription || defaultDesc,
      images: seoData.ogImage
        ? [{ url: seoData.ogImage, width: 1200, height: 630, alt: seoData.title }]
        : [{ url: "/uploads/banner/1649073538_download.jpg", width: 1200, height: 630 }],
      type: "website",
      url: seoData.canonicalUrl || "https://ogheavyduty.in",
    },
    twitter: {
      card: ["summary", "summary_large_image"].includes(seoData.twitterCard)
        ? seoData.twitterCard
        : "summary_large_image",
      title: seoData.ogTitle || seoData.title || defaultTitle,
      description: seoData.ogDescription || seoData.metaDescription || defaultDesc,
      images: seoData.ogImage ? [seoData.ogImage] : ["/uploads/banner/1649073538_download.jpg"],
    },
    robots: seoData.robots || "index, follow",
  };
}

export default async function HomePage(props) {
  const searchParams = await props?.searchParams;
  const initialSlide = searchParams?.slide ? Number(searchParams.slide) || 0 : 0;
  const [
    seoData,
    bannersData,
    homeAboutData,
    whyChooseData,
    clientWorkData,
    productsData,
    homeExtraData,
    milestonesData,
    engineeringCalloutData,
    leadCtaData,
    testimonialsData,
  ] = await Promise.all([
    getHomeSeo(),
    getBanners(),
    getHomeAbout(),
    getWhyChoose(),
    getClientWork(),
    getAllProducts().catch(() => []),
    getHomeExtra(),
    getMilestones(),
    getEngineeringCallout(),
    getLeadCta(),
    getTestimonials(),
  ]);

  // JSON-LD structured data for HVAC contractor / commercial equipment business
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HVACBusiness",
        "@id": "https://ogheavyduty.in/#organization",
        "name": "OG Heavy Duty",
        "url": "https://ogheavyduty.in",
        "logo": "https://ogheavyduty.in/images/og-logo.png",
        "image": "https://ogheavyduty.in/uploads/banner/1649073538_download.jpg",
        "description":
          "Leading Indian manufacturer of commercial and industrial heavy-duty air conditioners engineered for severe high-ambient climates with 100% inner-grooved copper coils.",
        "telephone": "011-35727834",
        "email": "info@ogheavyduty.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "D-14, Rajan Babu Road, Adarsh Nagar",
          "addressLocality": "New Delhi",
          "postalCode": "110033",
          "addressCountry": "IN",
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            "opens": "10:00",
            "closes": "19:30",
          },
        ],
        "priceRange": "₹₹₹",
      },
      {
        "@type": "WebSite",
        "@id": "https://ogheavyduty.in/#website",
        "url": "https://ogheavyduty.in",
        "name": "OG Heavy Duty",
        "publisher": {
          "@id": "https://ogheavyduty.in/#organization",
        },
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─── 1. HERO SECTION: Authentic Airflow Video + Value Proposition ─── */}
      <HeroSection initialSlide={initialSlide} slides={bannersData} />

      {/* ─── 2. COMPANY INTRO: Authentic Machine Visual + Corporate Narrative ─── */}
      <CompanyIntro data={homeAboutData} />

      {/* ─── 3. MILESTONES STRIP: 4 Core Engineered Milestones (Dark Blueprint) ─── */}
      <MilestonesStrip items={milestonesData} />

      {/* ─── 4. CATEGORY SHOWCASE: 6 Core Heavy Duty HVAC Classifications (Light Slate) ─── */}
      <CategoryShowcase
        products={productsData}
        badge={homeExtraData?.product_badge}
        title={homeExtraData?.product_title}
        subtitle={homeExtraData?.product_subtitle}
      />

      {/* ─── 5. CLIENTELE SHOWCASE: Dual-Row Marquee Carousel (Dark Blueprint) ─── */}
      <ClienteleShowcase
        logos={clientWorkData}
        badge={homeExtraData?.work_badge}
        title={homeExtraData?.work_title}
        subtitle={homeExtraData?.work_subtitle}
      />

      {/* ─── 6. ENGINEERING DIFFERENTIATORS: 6 Compact Technical Pillars (Crisp White) ─── */}
      <EngineeringDifferentiators
        items={whyChooseData}
        badge={homeExtraData?.choose_badge}
        title={homeExtraData?.choose_title}
        subtitle={homeExtraData?.choose_subtitle}
        callout={engineeringCalloutData}
      />

      {/* ─── 7. TESTIMONIALS: Verified Commercial Facility Experiences ─── */}
      <TestimonialSection items={testimonialsData} />

      {/* ─── 8. BLOGS: Latest HVAC Engineering Articles & Guides ─── */}
      <BlogSection
        badge={homeExtraData?.blog_badge}
        title={homeExtraData?.blog_title}
        subtitle={homeExtraData?.blog_subtitle}
      />

      {/* ─── 9. COMMERCIAL ENQUIRY CTA: High-Conversion Lead Capture Strip ─── */}
      <EnquiryCta
        data={leadCtaData}
        badge={homeExtraData?.contact_badge}
        title={homeExtraData?.contact_title}
        subtitle={homeExtraData?.contact_subtitle}
      />
    </>
  );
}

