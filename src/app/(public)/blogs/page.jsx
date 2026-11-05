import React from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { connectDB } from "src/app/lib/config";
import Blog from "src/app/models/Blog";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const revalidate = 3600; // 1 hour ISR

export const metadata = {
  title: "Technical Blogs & HVAC Insights | OG Heavy Duty",
  description:
    "Read the latest engineering articles, high-ambient tropical cooling guides, copper condenser coil maintenance, and commercial HVAC insights from OG Heavy Duty.",
  alternates: {
    canonical: "https://ogheavyduty.in/blogs",
  },
  openGraph: {
    title: "Technical Blogs & HVAC Insights | OG Heavy Duty",
    description:
      "Educational cooling guides, 52°C high-ambient engineering insights, 100% copper coil durability, and institutional HVAC sizing from OG Heavy Duty.",
    url: "https://ogheavyduty.in/blogs",
    siteName: "OG Heavy Duty",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Blogs & HVAC Insights | OG Heavy Duty",
    description:
      "Engineering insights, copper condenser coil benefits, and commercial HVAC recommendations from OG Heavy Duty.",
  },
};

// Resilient fallback HVAC educational articles for offline builds and unseeded databases
const FALLBACK_BLOGS = [
  {
    id: "fb-1",
    slug: "selecting-high-ambient-air-conditioners-50c-climates",
    title: "Selecting High-Ambient Air Conditioners: Engineering Guide for 52°C Climates",
    category: "HVAC Engineering",
    excerpt:
      "Understand why standard residential AC units trip during peak tropical heatwaves and how heavy-duty engineering with oversized condenser coils sustains full cooling pull-down.",
    date: "Oct 28, 2026",
    readTime: "5 min read",
    image: "/images/banner_ac_commercial.jpg",
    tags: ["High Ambient", "52°C Cooling", "Tropical HVAC"],
  },
  {
    id: "fb-2",
    slug: "why-100-percent-copper-condenser-coils-matter",
    title: "Why 100% Inner-Grooved Copper Condenser Coils Are Superior for Industrial Cooling",
    category: "Materials & Durability",
    excerpt:
      "A technical comparison between copper and aluminum heat exchangers. Discover why inner-grooved Cu-DHP copper delivers double the thermal conductivity and zero corrosion risk.",
    date: "Oct 20, 2026",
    readTime: "6 min read",
    image: "/images/banner_ac_industrial.jpg",
    tags: ["Copper Coils", "Corrosion Resistance", "Heat Exchangers"],
  },
  {
    id: "fb-3",
    slug: "commercial-hvac-inverter-vs-fixed-speed-savings",
    title: "Commercial HVAC Efficiency: Inverter vs Fixed Speed Heavy-Duty AC Systems",
    category: "Energy Efficiency",
    excerpt:
      "Evaluate seasonal power consumption (ISEER) across university campuses, corporate branches, and hospital wards to select between variable-speed inverter compressors and rugged fixed-speed workhorses.",
    date: "Oct 14, 2026",
    readTime: "7 min read",
    image: "/images/banner_ac_tower.jpg",
    tags: ["Inverter AC", "ISEER", "Commercial Power Savings"],
  },
  {
    id: "fb-4",
    slug: "preventive-maintenance-cleaning-heavy-duty-coils",
    title: "Preventive Air Conditioner Maintenance: Cleaning Heavy Copper Coils & Filters",
    category: "Maintenance & Service",
    excerpt:
      "Step-by-step best practices for institutional facility managers to maintain optimal static pressure, prevent compressor overheating, and prolong air conditioner operational lifespan.",
    date: "Sep 30, 2026",
    readTime: "4 min read",
    image: "/images/slide1.jpg",
    tags: ["Maintenance", "Air Filters", "Service Guide"],
  },
  {
    id: "fb-5",
    slug: "cassette-vs-ductable-ac-ceiling-cooling-selection",
    title: "Cassette vs Ductable AC: Selecting Ceiling Cooling for Modern Institutions",
    category: "Architectural Planning",
    excerpt:
      "How to determine whether a 4-way ceiling cassette or a concealed ducted HVAC system is best suited for your corporate boardroom, retail showroom, or auditorium layout.",
    date: "Sep 18, 2026",
    readTime: "5 min read",
    image: "/images/slide2.jpg",
    tags: ["Cassette AC", "Ductable AC", "Ceiling Layouts"],
  },
  {
    id: "fb-6",
    slug: "how-room-heat-load-calculations-prevent-ac-tripping",
    title: "How Room Heat Load Calculations Prevent AC Compressor Derating",
    category: "Technical Planning",
    excerpt:
      "Learn how solar heat gain through west-facing glass, high ceilings, and IT equipment affects real-world cooling tonnage requirements beyond simple floor square footage rules of thumb.",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "/images/slide3.jpg",
    tags: ["AC Sizing", "Heat Load", "Tonnage Estimation"],
  },
];

async function getPublishedBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isPublished: true })
      .sort({ sort: 1, createdAt: -1 })
      .lean();

    if (blogs && blogs.length > 0) {
      return blogs.map((b) => ({
        id: b._id.toString(),
        slug: b.slug,
        title: b.title,
        category: b.category || "HVAC Engineering",
        excerpt:
          b.excerpt ||
          b.metaDescription ||
          "Read the full engineering guide from OG Heavy Duty.",
        date: b.publishedAt
          ? new Date(b.publishedAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : new Date(b.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        readTime: b.readTime || "5 min read",
        image: b.coverImage || "/images/banner_ac_commercial.jpg",
        tags: b.tags || ["HVAC", "Air Conditioning"],
      }));
    }
  } catch (err) {
    // Graceful offline fallback
  }
  return FALLBACK_BLOGS;
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  // CollectionPage & Breadcrumb JSON-LD Schemas
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Technical Blogs & HVAC Insights | OG Heavy Duty",
    url: "https://ogheavyduty.in/blogs",
    description:
      "Engineering articles, high-ambient tropical cooling guides, and commercial HVAC maintenance insights from OG Heavy Duty.",
    hasPart: blogs.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      url: `https://ogheavyduty.in/blogs/${b.slug}`,
      description: b.excerpt,
    })),
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
        name: "Technical Blogs",
        item: "https://ogheavyduty.in/blogs",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Technical Blogs" },
  ];

  return (
    <>
      {/* ─── Structured Data for SEO ─────────────────────────────────── */}
      <Script
        id="blogs-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Script
        id="blogs-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Consistent Public Page Hero Banner ──────────────────────── */}
      <PublicPageBanner
        title="Technical Blogs & Engineering Insights"
        subtitle="Educational guides, 52°C tropical heatwave engineering, 100% inner-grooved copper coil durability, and institutional climate control protocols."
        badge="HVAC ENGINEERING INSIGHTS"
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Blog Listing Section: Standardized 60px Spacing ──────────────── */}
      <SectionContainer className="py-[60px] bg-[#f8fafc]/50">
        <PageContainer>


          {/* Grid of Articles: Matching Home Page Blog Carousel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((post) => (
              <article
                key={post.id || post.slug}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(15,122,224,0.18)] hover:border-[#0f7ae0]/60 transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Featured Thumbnail */}
                <Link
                  href={`/blogs/${post.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 block"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  {/* Frosted Category Pill on Image */}
                  <div className="absolute top-3.5 left-3.5 pointer-events-none">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/95 backdrop-blur-md text-[#0f7ae0] shadow-sm border border-white/50">
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta: Date & Read Time */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#0f7ae0]" />
                        <span>{post.date}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors line-clamp-2 leading-snug mb-2.5">
                      <Link href={`/blogs/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-3 leading-relaxed font-sans mb-5">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Bottom Read Action Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f7ae0] group-hover:text-[#0a4b8a] transition-colors"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {post.tags?.[0] ? (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{post.tags[0]}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        OG Engineering
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}
