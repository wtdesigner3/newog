/**
 * Blog Data Access Service
 * Handles querying, filtering, and fallback resolution for technical HVAC blog posts.
 * 
 * Conforms to:
 * - FINDING-601-01: Attached Next.js Data Cache tags (TAG_BLOGS)
 * - FINDING-601-02: Scoped strictly to OG Heavy Duty records via dbScope (zero steel blog leakage)
 * - FINDING-601-03: Differentiates genuinely unseeded DB from draft-only state
 */
import { connectDBSafe } from "../db.js";
import Blog from "../../app/models/Blog.js";
import { getOGBlogFilter } from "../dbScope.js";
import { safeCachedRead } from "../cache/cachedRead.js";
import { TAG_BLOGS } from "../cache/cacheTags.js";

export const FALLBACK_BLOGS = [
  {
    id: "fb-1",
    slug: "selecting-high-ambient-air-conditioners-50c-climates",
    title: "Selecting High-Ambient Air Conditioners: Engineering Guide for 50°C Climates",
    category: "HVAC Engineering",
    excerpt:
      "Understand why standard residential AC units trip in peak Indian summers and how high-ambient engineering with oversized heat exchangers sustains full cooling capacity up to 50°C.",
    content: `
      <h2>The Challenge of Peak Summer Heat</h2>
      <p>During extreme Indian heatwaves where ambient temperatures exceed 45°C to 50°C, conventional residential air conditioning units frequently fail due to high compressor discharge pressure tripping the high-pressure safety cutout.</p>
      <h2>What Makes High-Ambient Engineering Different?</h2>
      <p>OG Heavy Duty air conditioners are engineered with specialized tropical rotary compressors, oversized 100% inner-grooved copper condenser coils, and dual-speed aerofoil condenser fans designed to reject heat efficiently even under severe 50°C thermal conditions.</p>
    `,
    date: "October 28, 2026",
    publishedAt: "2026-10-28T10:00:00Z",
    readTime: "5 min read",
    author: "OG Engineering Team",
    image: "/images/slide1.jpg",
    tags: ["High Ambient", "50°C Cooling", "Tropical HVAC"],
  },
  {
    id: "fb-2",
    slug: "why-100-percent-copper-condenser-coils-matter",
    title: "Why 100% Inner-Grooved Copper Condenser Coils Are Superior for Industrial Cooling",
    category: "Materials & Durability",
    excerpt:
      "A technical comparison between copper and aluminum heat exchangers. Discover why inner-grooved copper delivers double the thermal conductivity, repairability, and long-term corrosion resistance.",
    content: `
      <h2>Thermal Conductivity Comparison</h2>
      <p>Copper has a thermal conductivity approximately double that of aluminum. Inner-grooved copper tubing creates micro-turbulences in the refrigerant flow, accelerating thermodynamic phase transition and heat transfer.</p>
      <h2>Field Repairability and Longevity</h2>
      <p>In corrosive industrial environments or coastal atmospheres with saline moisture, copper tubing offers significantly greater mechanical strength and can be brazed and repaired on-site, unlike aluminum microchannel coils which often require complete assembly replacement.</p>
    `,
    date: "October 20, 2026",
    publishedAt: "2026-10-20T10:00:00Z",
    readTime: "6 min read",
    author: "OG Metallurgy & Quality Assurance",
    image: "/images/slide2.jpg",
    tags: ["Copper Coils", "Corrosion Resistance", "Heat Exchangers"],
  },
  {
    id: "fb-3",
    slug: "commercial-hvac-inverter-vs-fixed-speed-savings",
    title: "Commercial HVAC Efficiency: Inverter vs Fixed Speed Heavy-Duty AC Systems",
    category: "Energy Efficiency",
    excerpt:
      "Evaluate seasonal power consumption (ISEER) across university campuses, corporate branches, and hospital wards to select between variable-speed inverter compressors and rugged fixed-speed workhorses.",
    content: `
      <h2>Inverter Modulation vs Constant Speed</h2>
      <p>Variable speed inverter compressors modulate electrical frequency to match real-time cooling loads, drastically lowering partial-load power consumption. However, in harsh electrical environments with fluctuating voltages, heavy-duty fixed speed units with high-torque rotary compressors provide unmatched reliability.</p>
    `,
    date: "October 14, 2026",
    publishedAt: "2026-10-14T10:00:00Z",
    readTime: "7 min read",
    author: "OG Energy Solutions Group",
    image: "/images/slide3.jpg",
    tags: ["Inverter AC", "ISEER", "Commercial Power Savings"],
  },
  {
    id: "fb-4",
    slug: "preventive-maintenance-cleaning-heavy-duty-coils",
    title: "Preventive Air Conditioner Maintenance: Cleaning Heavy Copper Coils & Filters",
    category: "Maintenance & Service",
    excerpt:
      "Step-by-step technical guidance on condenser cleaning, fin combing, filter maintenance, and electrical contactor inspection for industrial and institutional HVAC installations.",
    content: `
      <h2>Condenser Coil Maintenance</h2>
      <p>Accumulated dust and particulate matter reduce convective heat transfer by up to 30%, forcing the compressor to operate against higher head pressures. Regular low-pressure water cleaning and neutral detergent washes protect fin geometry and sustain rated cooling capacity.</p>
    `,
    date: "October 02, 2026",
    publishedAt: "2026-10-02T10:00:00Z",
    readTime: "4 min read",
    author: "OG Service & Field Engineering",
    image: "/images/slide1.jpg",
    tags: ["Maintenance", "Coil Cleaning", "Service Guide"],
  },
  {
    id: "fb-5",
    slug: "cassette-vs-ductable-air-conditioners-commercial-spaces",
    title: "Cassette vs Ductable Air Conditioners: Architectural & Sizing Guide",
    category: "Commercial HVAC",
    excerpt:
      "How to determine whether a 4-way ceiling cassette or a concealed ducted HVAC system is best suited for your corporate boardroom, retail showroom, or auditorium layout.",
    content: `
      <h2>Aesthetics and Spatial Constraints</h2>
      <p>4-way ceiling cassette units fit directly within standard 2x2 ceiling grids and provide 360-degree radial air distribution without ductwork. Ductable units allow concealed, silent airflow distributed across multiple linear diffusers for expansive open spaces.</p>
    `,
    date: "September 18, 2026",
    publishedAt: "2026-09-18T10:00:00Z",
    readTime: "5 min read",
    author: "OG Commercial Design Consultants",
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
    content: `
      <h2>Beyond Simple Square Footage</h2>
      <p>Rule-of-thumb square footage metrics fail when dealing with top-floor concrete slabs, uninsulated false ceilings, glass curtain walls, or high-occupancy conference rooms. Calculating total sensible and latent heat loads ensures sustained thermal comfort.</p>
    `,
    date: "September 05, 2026",
    publishedAt: "2026-09-05T10:00:00Z",
    readTime: "6 min read",
    author: "OG Technical Advisory Board",
    image: "/images/slide3.jpg",
    tags: ["AC Sizing", "Heat Load", "Tonnage Estimation"],
  },
];

function normalizeBlogDoc(doc) {
  if (!doc) return null;
  return {
    _id: doc._id?.toString(),
    id: doc.slug,
    title: doc.title,
    slug: doc.slug,
    category: doc.category || "HVAC Engineering",
    excerpt: doc.excerpt || "",
    content: doc.content || "",
    author: doc.author || "OG Heavy Duty Technical Team",
    image: doc.coverImage || "/images/slide1.jpg",
    coverImage: doc.coverImage || "/images/slide1.jpg",
    breadImage: doc.breadImage || "",
    bread_heading: doc.bread_heading || "",
    date: doc.publishedAt
      ? new Date(doc.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Recent",
    publishedAt: doc.publishedAt || doc.createdAt,
    readTime: "5 min read",
    tags: Array.isArray(doc.tags) && doc.tags.length > 0 
      ? doc.tags 
      : (Array.isArray(doc.metakeywords) && doc.metakeywords.length > 0 ? doc.metakeywords : ["HVAC", "Cooling"]),
    isPublished: doc.isPublished !== false && doc.status !== "draft" && doc.status !== "archived",
    status: doc.status || (doc.isPublished ? "published" : "draft"),
    metatag: doc.metatag || "",
    metaDescription: doc.metaDescription || "",
    canonicalUrl: doc.canonicalUrl || "",
    ogTitle: doc.ogTitle || "",
    ogDescription: doc.ogDescription || "",
    source: "database",
  };
}

/**
 * Total count of OG blog posts in database regardless of publication status.
 */
async function getTotalOGBlogCount() {
  return await Blog.countDocuments(getOGBlogFilter());
}

/**
 * Get all published blog posts.
 */
async function _getPublishedBlogsRaw() {
  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const totalOG = await getTotalOGBlogCount();

      if (totalOG > 0) {
        const docs = await Blog.find(
          getOGBlogFilter({
            $or: [{ status: "published" }, { isPublished: true }],
            status: { $ne: "archived" },
          })
        )
          .sort({ sort: 1, createdAt: -1 })
          .lean();

        return docs.map(normalizeBlogDoc);
      }
    } catch (err) {
      console.warn(`[BlogService] Database read error: ${err.message}. Engaging fallback.`);
    }
  }

  return FALLBACK_BLOGS.map((b) => ({ ...b, source: "fallback" }));
}

export const getPublishedBlogs = safeCachedRead(
  _getPublishedBlogsRaw,
  ["all-published-blogs"],
  { tags: [TAG_BLOGS], revalidate: 3600 }
);

/**
 * Get a single blog post by slug.
 */
async function _getBlogBySlugRaw(slug) {
  if (!slug) return null;

  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const doc = await Blog.findOne(
        getOGBlogFilter({
          slug,
          $or: [{ status: "published" }, { isPublished: true }],
          status: { $ne: "archived" },
        })
      ).lean();

      if (doc) {
        return normalizeBlogDoc(doc);
      }

      // Check if DB is populated with OG blogs
      const totalOG = await getTotalOGBlogCount();
      if (totalOG > 0) {
        return null; // DB populated with OG blogs, slug genuinely not found or draft
      }
    } catch (err) {
      console.warn(`[BlogService] Database error looking up blog "${slug}": ${err.message}`);
    }
  }

  const fallback = FALLBACK_BLOGS.find((b) => b.slug === slug);
  return fallback ? { ...fallback, source: "fallback" } : null;
}

export const getBlogBySlug = (slug) => {
  const cachedFn = safeCachedRead(
    () => _getBlogBySlugRaw(slug),
    ["blog", slug],
    { tags: [TAG_BLOGS], revalidate: 3600 }
  );
  return cachedFn();
};

/**
 * Get static params for blog pages.
 */
export async function getBlogStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

/**
 * Get related blog posts.
 */
export async function getRelatedBlogs(slug, limit = 3) {
  const all = await getPublishedBlogs();
  return all.filter((b) => b.slug !== slug).slice(0, limit);
}
