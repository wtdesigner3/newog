import { BookOpen, Sparkles } from "lucide-react";
import { connectDB } from "src/app/lib/config";
import Blog from "src/app/models/Blog";
import { PageContainer } from "src/components/public";
import BlogCarousel from "./BlogCarousel";

// Verified fallback HVAC educational articles for robust carousel rendering
export const FALLBACK_BLOGS = [
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
  },
  {
    id: "fb-2",
    slug: "why-100-percent-copper-condenser-coils-matter",
    title: "Why 100% Inner-Grooved Copper Condenser Coils Are Essential for Longevity",
    category: "Materials & Durability",
    excerpt:
      "A technical comparison between copper and aluminum heat exchangers. Discover why inner-grooved Cu-DHP copper delivers double the thermal conductivity and zero corrosion risk.",
    date: "Oct 20, 2026",
    readTime: "6 min read",
    image: "/images/banner_ac_industrial.jpg",
  },
  {
    id: "fb-3",
    slug: "commercial-hvac-inverter-vs-fixed-speed-savings",
    title: "Commercial HVAC Efficiency: Inverter vs Fixed Speed Heavy-Duty AC Systems",
    category: "Energy Efficiency",
    excerpt:
      "Evaluate seasonal power consumption (ISEER) across university campuses, corporate towers, and healthcare wards to select between inverter systems and rugged fixed-speed workhorses.",
    date: "Oct 14, 2026",
    readTime: "7 min read",
    image: "/images/banner_ac_tower.jpg",
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
  },
  {
    id: "fb-6",
    slug: "high-static-pressure-ductable-sizing-banquets",
    title: "High-Static Pressure Ductable Sizing for Large Auditoriums & Banquets",
    category: "HVAC Engineering",
    excerpt:
      "Master engineering considerations for high-occupancy event halls requiring long duct runs, uniform laminar air diffusion, and low-dB acoustic damper control.",
    date: "Sep 05, 2026",
    readTime: "8 min read",
    image: "/images/slide3.jpg",
  },
];

async function getFeaturedBlogs() {
  try {
    await connectDB();
    const docs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(8)
      .lean();

    if (docs && docs.length > 0) {
      return docs.map((b) => ({
        id: String(b._id),
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
      }));
    }
  } catch (err) {
    // Graceful offline fallback
  }
  return FALLBACK_BLOGS;
}

export default async function BlogSection({ badge, title, subtitle }) {
  const blogs = await getFeaturedBlogs();

  return (
    <section
      id="blogs"
      className="relative bg-white py-[60px] overflow-hidden border-b border-slate-200/80"
    >
      {/* Ambient Cool Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

      <PageContainer>
        {/* Section Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0f7ae0] mb-3 shadow-2xs">
            <BookOpen className="w-4 h-4 text-[#0f7ae0]" />
            <span>{badge || "TECHNICAL ARTICLES & GUIDES"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
            {title || (
              <>
                HVAC Engineering &amp;{" "}
                <span className="text-[#0f7ae0]">Cooling Insights</span>
              </>
            )}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-sans">
            {subtitle || "Educational cooling guides, 52°C tropical engineering benchmarks, and commercial equipment maintenance insights from our certified HVAC engineering team."}
          </p>
        </div>

        {/* Carousel Component with Interactive Drag-to-Scroll & Arrow Controls */}
        <BlogCarousel blogs={blogs} />
      </PageContainer>
    </section>
  );
}
