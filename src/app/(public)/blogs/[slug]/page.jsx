import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { cache } from "react";
import {
  ChevronRight,
  Clock,
  Tag,
  ArrowLeft,
  Calendar,
  BookOpen,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { connectDB } from "src/app/lib/config";
import Blog from "src/app/models/Blog";
import {
  PageContainer,
  SectionContainer,
  PublicPageBanner,
} from "src/components/public";

export const revalidate = 3600; // 1 hour ISR

// Fallback articles for offline builds and unseeded databases
const FALLBACK_ARTICLES = {
  "selecting-high-ambient-air-conditioners-50c-climates": {
    title: "Selecting High-Ambient Air Conditioners: Engineering Guide for 52°C Climates",
    category: "HVAC Engineering",
    date: "Oct 28, 2026",
    readTime: "5 min read",
    image: "/images/banner_ac_commercial.jpg",
    tags: ["High Ambient", "52°C Cooling", "Tropical HVAC"],
    excerpt:
      "Understand why standard residential AC units trip in peak Indian summers and how high-ambient engineering with oversized condenser coils sustains full cooling pull-down.",
    content: `
      <p class="lead text-base sm:text-lg text-slate-700 font-medium mb-4">
        During peak summer months across Northern and Western India, ambient temperatures regularly cross 45°C, with rooftop outdoor unit environments frequently touching 50°C to 52°C. Standard mass-market air conditioners frequently experience high-pressure thermal tripping under these extreme conditions.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Why Standard Air Conditioners Derate and Trip</h3>
      <p class="text-slate-600 mb-4">
        Most generic residential air conditioners are rated and calibrated to standard test conditions up to 35°C or 43°C. When outdoor ambient temperatures exceed this threshold, the condensing pressure spikes sharply. Standard compressors pull elevated current, resulting in internal overload protector trips and continuous on-off cycling without meaningful heat rejection.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">The OG Heavy Duty Engineering Approach</h3>
      <p class="text-slate-600 mb-4">
        OG Heavy Duty addresses severe high-ambient heat loads through uncompromising thermal engineering:
      </p>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
        <li><strong>Oversized 100% Inner-Grooved Copper Condenser Coils:</strong> Expanding the heat rejection surface area prevents refrigerant discharge pressure from spiking under 52°C sun exposure.</li>
        <li><strong>Tropicalized High-Torque Compressors:</strong> Equipped with heavy-gauge copper windings and synthetic polyester lubricants that maintain film viscosity at elevated temperatures.</li>
        <li><strong>Aerodynamic High-Static Fan Blades:</strong> Expelling hot discharge air rapidly away from the condenser coil to eliminate localized thermal recirculation.</li>
      </ul>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Key Takeaways for Commercial Planners</h3>
      <p class="text-slate-600 mb-4">
        When planning institutional or commercial HVAC installations, verify the manufacturer's maximum ambient operating threshold and coil metallurgy. Opting for heavy-gauge copper coils with anti-corrosion fin treatments ensures decade-long continuous duty performance without thermal derating.
      </p>
    `,
  },
  "why-100-percent-copper-condenser-coils-matter": {
    title: "Why 100% Inner-Grooved Copper Condenser Coils Are Superior for Industrial Cooling",
    category: "Materials & Durability",
    date: "Oct 20, 2026",
    readTime: "6 min read",
    image: "/images/banner_ac_industrial.jpg",
    tags: ["Copper Coils", "Corrosion Resistance", "Heat Exchangers"],
    excerpt:
      "A technical comparison between copper and aluminum heat exchangers and their real-world lifespan.",
    content: `
      <p class="lead text-base sm:text-lg text-slate-700 font-medium mb-4">
        In the air conditioning industry, heat exchanger metallurgy is the single most critical factor dictating long-term equipment reliability, energy efficiency, and total cost of ownership.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Thermal Conductivity Comparison</h3>
      <p class="text-slate-600 mb-4">
        Pure copper exhibits a thermal conductivity of approximately 385 W/m·K, compared to roughly 205 W/m·K for aluminum alloys. This significant physical advantage translates into faster heat dissipation from high-pressure refrigerant vapors to the ambient airstream.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Inner-Grooved Tubing Geometry</h3>
      <p class="text-slate-600 mb-4">
        OG Heavy Duty utilizes micro-grooved internal rifling within our copper tubes. These internal micro-fins generate localized turbulent flow within the refrigerant stream, breaking boundary layers and augmenting internal heat transfer coefficients by up to 30% compared to smooth bore tubes.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Field Serviceability &amp; Repair</h3>
      <p class="text-slate-600 mb-4">
        Micro-punctures caused by environmental vibrations or aggressive urban contaminants can be easily identified and brazed on-site with standard oxy-acetylene torches by certified HVAC technicians. In contrast, all-aluminum microchannel coils frequently require total coil replacement at substantial expense and downtime.
      </p>
    `,
  },
  "commercial-hvac-inverter-vs-fixed-speed-savings": {
    title: "Commercial HVAC Efficiency: Inverter vs Fixed Speed Heavy-Duty AC Systems",
    category: "Energy Efficiency",
    date: "Oct 14, 2026",
    readTime: "7 min read",
    image: "/images/banner_ac_tower.jpg",
    tags: ["Inverter AC", "ISEER", "Commercial Power Savings"],
    excerpt:
      "Evaluate seasonal power consumption (ISEER) across university campuses, corporate branches, and hospital wards to select between variable-speed inverter compressors and rugged fixed-speed workhorses.",
    content: `
      <p class="lead text-base sm:text-lg text-slate-700 font-medium mb-4">
        Facility managers in corporate offices, universities, and commercial complexes frequently face the strategic decision of choosing between variable-speed inverter and traditional fixed-speed heavy-duty air conditioning systems.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Understanding the ISEER Metric</h3>
      <p class="text-slate-600 mb-4">
        The Bureau of Energy Efficiency (BEE) Indian Seasonal Energy Efficiency Ratio (ISEER) evaluates air conditioner energy efficiency across varying outdoor temperatures ranging from 24°C to 43°C. Inverter systems continuously modulate compressor motor speed to match real-time cooling demand, resulting in substantially higher ISEER ratings (typically 3.7 to 5.0) compared to fixed-speed units.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">When Inverter Technology Delivers Maximum ROI</h3>
      <p class="text-slate-600 mb-4">
        Inverter units provide superior energy economics in spaces with fluctuating thermal loads and extended operating cycles:
      </p>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
        <li><strong>Commercial Offices &amp; Educational Lecture Halls:</strong> Where occupancy fluctuates throughout the day, variable capacity modulation reduces power consumption by up to 35% to 45%.</li>
        <li><strong>Precision Temperature Control:</strong> Eliminating temperature swings by holding room ambient within ±0.5°C of setpoint.</li>
        <li><strong>Soft Starting Electronics:</strong> Low startup inrush current prevents electrical distribution tripping on generator backup.</li>
      </ul>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">The Enduring Role of Fixed-Speed Rugged Workhorses</h3>
      <p class="text-slate-600 mb-4">
        Despite inverter gains, fixed-speed systems remain the preferred choice for industrial environments, server rooms, and regions with extreme grid voltage fluctuations. Their simplified electromagnetic controls, absence of sensitive inverter driver boards, and robust heavy-duty components ensure continuous operation under harsh power conditions.
      </p>
    `,
  },
  "preventive-maintenance-cleaning-heavy-duty-coils": {
    title: "Preventive Air Conditioner Maintenance: Cleaning Heavy Copper Coils & Filters",
    category: "Maintenance & Service",
    date: "Sep 30, 2026",
    readTime: "4 min read",
    image: "/images/slide1.jpg",
    tags: ["Maintenance", "Air Filters", "Service Guide"],
    excerpt:
      "Step-by-step best practices for institutional facility managers to maintain optimal static pressure, prevent compressor overheating, and prolong air conditioner operational lifespan.",
    content: `
      <p class="lead text-base sm:text-lg text-slate-700 font-medium mb-4">
        Systematic preventive maintenance is the most effective safeguard against compressor burnout, elevated power consumption, and unexpected cooling failures during peak summer heatwaves.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">The Thermal Penalty of Fouled Heat Exchangers</h3>
      <p class="text-slate-600 mb-4">
        Airborne dust, urban particulate matter, and environmental oils form an insulating layer over condenser fins. Even a 0.5 mm layer of dust accumulation on the condenser coil reduces heat transfer efficiency by up to 21%, forcing compressor head pressure and discharge temperatures to operate dangerously close to high-pressure thermal cutoffs.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Standard Cleaning Protocol</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
        <li><strong>Bi-Weekly Indoor Filter Washing:</strong> Clean high-density nylon filters under running water to sustain designed CFM airflow and eliminate motor static overload.</li>
        <li><strong>Low-Pressure Coil Flushing:</strong> Use wide-angle, low-pressure water sprays (below 100 PSI) straight against the fin plane to prevent bending the delicate aluminum fin structure.</li>
        <li><strong>pH-Neutral Detergent Application:</strong> Wash hydrophilic blue-fin coils using non-acidic, pH-neutral biodegradable cleaning solutions that clean without stripping protective anti-corrosive chemical coatings.</li>
        <li><strong>Electrical Termination Check:</strong> Inspect contactor terminals and capacitor capacitance values to prevent single-phasing and compressor winding stress.</li>
      </ul>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Seasonal Pre-Summer Commissioning</h3>
      <p class="text-slate-600 mb-4">
        Always commission an authorized technical inspection before March to test refrigerant charge, measure operating current against rated FLA, and verify unobstructed outdoor airflow clearances.
      </p>
    `,
  },
  "cassette-vs-ductable-ac-ceiling-cooling-selection": {
    title: "Cassette vs Ductable AC: Selecting Ceiling Cooling for Modern Institutions",
    category: "Architectural Planning",
    date: "Sep 18, 2026",
    readTime: "5 min read",
    image: "/images/slide2.jpg",
    tags: ["Cassette AC", "Ductable AC", "Ceiling Layouts"],
    excerpt:
      "How to determine whether a 4-way ceiling cassette or a concealed ducted HVAC system is best suited for your corporate boardroom, retail showroom, or auditorium layout.",
    content: `
      <p class="lead text-base sm:text-lg text-slate-700 font-medium mb-4">
        Architects, interior designers, and corporate planners must balance aesthetics, structural ceiling constraints, and thermal distribution when selecting centralized ceiling cooling equipment.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">4-Way Ceiling Cassette Systems</h3>
      <p class="text-slate-600 mb-4">
        Ceiling cassettes are self-contained indoor units flush-mounted into modular 600x600 mm or 900x900 mm false ceiling grids:
      </p>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
        <li><strong>360-Degree Air Distribution:</strong> Independent motorized louvers disperse cooled air evenly across all four directions, minimizing localized thermal drafts.</li>
        <li><strong>Compact Ceiling Void Requirement:</strong> Requires minimal plenum depth (typically 260 mm to 320 mm), making them suitable for low-clearance renovations.</li>
        <li><strong>Integrated Condensate Lift Pump:</strong> Built-in pumps lift condensate up to 750 mm above ceiling level, simplifying drainage piping layout.</li>
      </ul>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Concealed Ductable Split Units</h3>
      <p class="text-slate-600 mb-4">
        Concealed ductable units conceal the indoor cooling chassis entirely above the false ceiling or in service mezzanines, distributing air through insulated sheet metal or spiral ducting:
      </p>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
        <li><strong>Architectural Cleanliness:</strong> Only linear slot diffusers or discrete supply grilles remain visible in occupied spaces.</li>
        <li><strong>Superior Acoustic Control:</strong> Placing the indoor fan section away from occupied seating and using acoustic duct lining delivers ultra-quiet NC-30 noise criteria.</li>
        <li><strong>Extensive Static Pressure Capability:</strong> Capable of pushing air through extensive duct layouts across partitioned executive suites, auditoriums, and open-plan floors.</li>
      </ul>
    `,
  },
  "how-room-heat-load-calculations-prevent-ac-tripping": {
    title: "How Room Heat Load Calculations Prevent AC Compressor Derating",
    category: "Technical Planning",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "/images/slide3.jpg",
    tags: ["AC Sizing", "Heat Load", "Tonnage Estimation"],
    excerpt:
      "Learn how solar heat gain through west-facing glass, high ceilings, and IT equipment affects real-world cooling tonnage requirements beyond simple floor square footage rules of thumb.",
    content: `
      <p class="lead text-base sm:text-lg text-slate-700 font-medium mb-4">
        A common pitfall in HVAC installation is sizing air conditioning capacity exclusively on floor area (e.g., 1 Ton per 100 sq. ft.). In extreme high-ambient Indian climates, solar radiation, building geometry, and sensible heat sources frequently double the actual thermal load.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">The Components of Real Cooling Heat Load</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
        <li><strong>Direct Solar Radiation (Solar Heat Gain Coefficient):</strong> Unshaded western and southern glass windows introduce intense radiant energy during peak afternoon hours (up to 450 W/m²).</li>
        <li><strong>Roof Conduction on Top Floors:</strong> Uninsulated flat concrete roofs absorb intense radiant sunlight, conducting substantial heat downward into living areas well into the evening.</li>
        <li><strong>Occupancy &amp; Fresh Air Ventilation:</strong> Each person contributes approximately 100 W of sensible and latent body heat, while fresh air infiltration increases latent dehumidification load.</li>
        <li><strong>Sensible Equipment Load:</strong> Computers, printers, server racks, and commercial lighting add continuous wattage directly into the conditioned space.</li>
      </ul>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">The Consequence of Undersizing vs Oversizing</h3>
      <p class="text-slate-600 mb-4">
        Undersized units run at 100% duty cycle continuously without achieving the setpoint, leading to elevated compressor winding temperatures and eventual high-pressure safety trips. Conversely, gross oversizing causes rapid on-off short-cycling, poor humidity removal, and premature contactor wear.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Using the OG Heavy Duty Guided Sizing Engine</h3>
      <p class="text-slate-600 mb-4">
        Our engineers recommend using our interactive AC Sizing Tool to model room volume, sun exposure, and occupancy before purchasing commercial or residential systems.
      </p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(FALLBACK_ARTICLES).map((slug) => ({
    slug,
  }));
}

const getBlogPost = cache(async (slug) => {
  try {
    await connectDB();
    const post = await Blog.findOne({ slug, isPublished: true }).lean();
    if (post) return post;
  } catch (err) {
    // DB offline fallback
  }

  // Check fallback dictionary
  if (FALLBACK_ARTICLES[slug]) {
    const fb = FALLBACK_ARTICLES[slug];
    return {
      title: fb.title,
      slug: slug,
      category: fb.category,
      coverImage: fb.image,
      publishedAt: fb.date,
      readTime: fb.readTime,
      tags: fb.tags,
      excerpt: fb.excerpt,
      content: fb.content,
    };
  }

  return null;
});

async function getRelatedBlogs(currentSlug) {
  try {
    await connectDB();
    const docs = await Blog.find({ isPublished: true, slug: { $ne: currentSlug } })
      .sort({ sort: 1, createdAt: -1 })
      .limit(4)
      .lean();

    if (docs && docs.length > 0) {
      return docs.map((b) => ({
        slug: b.slug,
        title: b.title,
        category: b.category || "HVAC Engineering",
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
    // Fallback on database failure
  }

  // Fallback from static fallback articles
  return Object.keys(FALLBACK_ARTICLES)
    .filter((s) => s !== currentSlug)
    .slice(0, 4)
    .map((s) => {
      const fb = FALLBACK_ARTICLES[s];
      return {
        slug: s,
        title: fb.title,
        category: fb.category,
        date: fb.date,
        readTime: fb.readTime,
        image: fb.image,
      };
    });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Blog Article | OG Heavy Duty" };
  }

  const title = post.metatag || `${post.title} | OG Heavy Duty`;
  const description = post.metaDescription || post.excerpt || "";

  return {
    title,
    description,
    alternates: {
      canonical: `https://ogheavyduty.in/blogs/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ogheavyduty.in/blogs/${slug}`,
      siteName: "OG Heavy Duty",
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `https://ogheavyduty.in/blogs/${slug}`,
    datePublished: post.publishedAt || "2026-10-28",
    publisher: {
      "@type": "Organization",
      name: "OG Heavy Duty",
      logo: "https://ogheavyduty.in/images/og-logo.png",
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
        name: "Technical Blogs",
        item: "https://ogheavyduty.in/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://ogheavyduty.in/blogs/${slug}`,
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: post.title },
  ];

  return (
    <>
      {/* ─── Structured Data for SEO ─────────────────────────────────── */}
      <Script
        id="blog-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="blog-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Consistent Public Page Hero Banner ──────────────────────── */}
      <PublicPageBanner
        title={post.title}
        subtitle={post.excerpt || "In-depth engineering analysis and operational protocols from OG Heavy Duty."}
        badge={post.category || "HVAC ENGINEERING"}
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── Main Article Content & Sticky Related Sidebar: Standardized 60px Spacing ───── */}
      <SectionContainer className="py-[60px] bg-[#f8fafc]/50">
        <PageContainer>
          {/* Main Grid: Left Column (Image then Content) + Right Column (Sticky Related Blogs) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ─── LEFT COLUMN: Hero Image then Article Body ─────────────── */}
            <article className="lg:col-span-8 space-y-6">
              
              {/* 1. Hero Cover Image at Top of Left Column */}
              {post.coverImage && (
                <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] group">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 840px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  {/* Frosted Category Pill on Image */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white/95 backdrop-blur-md text-[#0f7ae0] shadow-md border border-white/60">
                      {post.category || "HVAC Engineering"}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. Article Metadata Strip */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-[#0f7ae0]" />
                    <span>{post.publishedAt || "October 2026"}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-[#0f7ae0]" />
                    <span>{post.readTime || "5 min read"}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                    <ShieldCheck size={14} className="text-[#0f7ae0]" />
                    <span>OG Technical Desk</span>
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f7ae0] bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-full">
                  Verified Technical Paper
                </span>
              </div>

              {/* 3. Main Article Body Container */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs">
                {/* Excerpt Lead Callout */}
                {post.excerpt && (
                  <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-transparent border-l-4 border-[#0f7ae0]">
                    <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic">
                      &ldquo;{post.excerpt}&rdquo;
                    </p>
                  </div>
                )}

                {/* Rich HTML Body */}
                <div
                  className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-slate-900 prose-li:text-slate-600 prose-ul:my-4 prose-ul:space-y-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Topic Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1.5">
                      <Tag size={13} className="text-[#0f7ae0]" />
                      <span>Related Topics:</span>
                    </span>
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#0f7ae0] text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Navigation */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-start">
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0f7ae0] hover:text-[#0a4b8a] transition min-h-[44px]"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to all engineering articles</span>
                  </Link>
                </div>
              </div>
            </article>

            {/* ─── RIGHT COLUMN: Sticky Related Blogs Block & Technical Inquiry ─── */}
            <aside className="lg:col-span-4 relative">
              {/* Sticky Container: Pinned at top-28 (112px) throughout the full scroll of the left column */}
              <div
                className="lg:sticky lg:top-28 space-y-6"
                style={{ position: "sticky", top: "112px" }}
              >
                {/* Related Engineering Articles Block */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.08)] p-5 sm:p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center">
                        <BookOpen size={16} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold font-heading text-slate-900">
                          Related Articles
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          HVAC Engineering Guides
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f7ae0] bg-blue-50 px-2 py-0.5 rounded">
                      {relatedBlogs.length} Guides
                    </span>
                  </div>

                  {/* Related Articles List */}
                  <div className="space-y-4">
                    {relatedBlogs.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/blogs/${rel.slug}`}
                        className="group flex items-start gap-3.5 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                          <Image
                            src={rel.image || "/images/banner_ac_commercial.jpg"}
                            alt={rel.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f7ae0] block mb-1">
                            {rel.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0f7ae0] transition-colors line-clamp-2 leading-snug">
                            {rel.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} className="text-[#0f7ae0]" />
                              {rel.date}
                            </span>
                            <span>•</span>
                            <span>{rel.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                      href="/blogs"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#0f7ae0] hover:border-[#0f7ae0] bg-white transition-all shadow-2xs hover:shadow-xs group"
                    >
                      <span>View All Engineering Articles</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}
