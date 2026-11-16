import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/services/catalogService";
import {
  PageContainer,
  Breadcrumbs,
} from "@/components/public";
import {
  CategoryModelTable,
} from "@/components/catalog";
import { ShieldCheck, ThermometerSnowflake, CheckCircle2, Phone, ArrowRight, Zap } from "lucide-react";

/**
 * High-Resolution Horizontal Banner & Technical Information Mapping for Each Category & Subcategory.
 * Fully replaces the old card with a cinematic, full horizontal banner.
 */
const SUBCATEGORY_BANNER_MAP = {
  "window-ac": {
    image: "/images/banner_window_ac_horizontal.jpg",
    title: "OG Heavy Duty Window Air Conditioners",
    tagline:
      "High-tonnage heavy-duty window air conditioning units engineered with tropicalized rotary compressors and 100% inner-grooved copper coils. Built to deliver uncompromised cooling performance under high ambient temperatures up to 52°C.",
    features: [
      "100% Inner-Grooved Pure Copper Coils",
      "52°C Extreme Tropical Ambient Operation",
      "Heavy-Duty Tropical Rotary Compressor",
      "Anti-Corrosion Hydrophilic Blue Fin Barrier",
    ],
  },
  "split-ac": {
    image: "/images/banner_split_ac_horizontal.jpg",
    title: "OG Heavy Duty Split Hi-Wall Air Conditioners",
    tagline:
      "Ultra-quiet, high-efficiency split air conditioners with dual-inverter and fixed-speed engineering, heavy copper heat exchangers, and rapid thermal pull-down tested up to 52°C peak heat.",
    features: [
      "100% Rifled Copper Inner-Groove Coils",
      "Twin-Rotary Inverter & Fixed Speed Series",
      "Tropical 52°C Ambient Continuous Cooling",
      "Multi-Stage Air Filtration & Hydrophilic Fins",
    ],
  },
  "four-way-cassette-ac": {
    image: "/images/banner_cassette_ac_horizontal.jpg",
    title: "OG Heavy Duty 4-Way Ceiling Cassette AC",
    tagline:
      "Commercial ceiling-recessed cassette air conditioners featuring 360-degree uniform circular airflow distribution, high-lift condensate drain pump, and industrial cooling longevity.",
    features: [
      "360° Surround Airflow Distribution",
      "100% Pure Copper Tubing & Coils",
      "High-Lift Built-In Condensate Drain Pump",
      "Engineered for Commercial & Institutional Duty",
    ],
  },
  "ductable-ac": {
    image: "/images/banner_ductable_ac_horizontal.jpg",
    title: "OG Heavy Duty Commercial Ductable AC",
    tagline:
      "High-static commercial ductable split systems engineered for auditoriums, hospitals, corporate workspaces, and industrial halls with expansive duct runs and whisper-quiet air delivery.",
    features: [
      "High External Static Pressure (ESP)",
      "Heavy-Duty Tropical Condensing Units",
      "Rifled Pure Copper Heat Exchangers",
      "Modular Zoning & BMS Integration Ready",
    ],
  },
  "one-way-cassette-ac": {
    image: "/images/banner_cassette_ac_horizontal.jpg",
    title: "OG Heavy Duty 1-Way Slim Cassette AC",
    tagline:
      "Compact single-directional ceiling cassette air conditioning units ideal for hotel guest rooms, perimeter cooling zones, and restricted ceiling voids.",
    features: [
      "Slim Architectural Profile for Tight Plenums",
      "100% Pure Copper Construction",
      "Long-Distance Directional Air Throw",
      "Low Acoustic Signature & Energy Efficient",
    ],
  },
  "floor-standing-ac": {
    image: "/images/banner_ac_tower_new.jpg",
    title: "OG Heavy Duty Floor Standing (Tower) AC",
    tagline:
      "Vertical high-tonnage package cooling towers engineered for banquet halls, religious venues, airport lounges, and large public spaces without ceiling duct access.",
    features: [
      "Powerful Long-Distance Air Throw (Up to 20m)",
      "High-Capacity Tropical Scroll / Rotary Compressor",
      "100% Pure Copper Heat Exchanger",
      "Robust Touch Panel & Remote Control System",
    ],
  },
  "survivor-ac": {
    image: "/images/banner_ac_industrial_new.jpg",
    title: "OG Heavy Duty Survivor Industrial AC",
    tagline:
      "Ruggedized harsh-environment industrial air conditioners built to withstand severe coastal humidity, extreme chemical ambients, and high thermal shock.",
    features: [
      "Marine-Grade Anti-Corrosion Protective Coating",
      "100% Inner-Grooved Heavy Copper",
      "Extreme Tropical Duty Beyond 52°C",
      "Reinforced Heavy-Gauge Steel Chassis",
    ],
  },
  "domestic-ac": {
    image: "/images/banner_split_ac_horizontal.jpg",
    title: "OG Heavy Duty Domestic Air Conditioners",
    tagline:
      "Premium residential and light commercial cooling solutions featuring Window and Split Hi-Wall air conditioners built with 100% copper construction.",
    features: [
      "100% Inner-Grooved Pure Copper",
      "52°C Ambient Operation",
      "Fixed Speed & Inverter Series",
      "BEE Star Rated Energy Efficiency",
    ],
  },
  "light-commercial-ac": {
    image: "/images/banner_cassette_ac_horizontal.jpg",
    title: "OG Heavy Duty Light Commercial Air Conditioners",
    tagline:
      "Engineered commercial cooling solutions comprising Four-Way Cassette, Ductable, One-Way Cassette, Floor Standing Tower, and Survivor AC systems.",
    features: [
      "Heavy-Duty Commercial Scroll & Rotary Compressors",
      "High Static Pressure & Uniform Air Distribution",
      "100% Pure Copper Coils & Hydrophilic Fins",
      "Engineered for Institutional & Industrial Projects",
    ],
  },
};

/**
 * Helper to get banner data for any category or subcategory slug.
 */
function getBannerData(slug, fallbackName, fallbackDesc) {
  const match = SUBCATEGORY_BANNER_MAP[slug];
  if (match) return match;
  return {
    image: "/images/banner_window_ac_horizontal.jpg",
    title: `OG Heavy Duty ${fallbackName || "Air Conditioners"}`,
    tagline:
      fallbackDesc ||
      "Commercial heavy-duty cooling engineered for extreme ambient climates up to 52°C.",
    features: [
      "100% Inner-Grooved Pure Copper Coils",
      "52°C Extreme Tropical Ambient Operation",
      "Heavy-Duty Tropical Rotary Compressor",
      "Anti-Corrosion Hydrophilic Blue Fin Barrier",
    ],
  };
}

/**
 * Generate dynamic SEO metadata for Category, Subcategory, and Product Detail pages.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  if (slug.length === 0) {
    notFound();
  }

  // 1-segment: Main Category or Direct Subcategory
  if (slug.length === 1) {
    const cat = await getCategoryBySlug(slug[0]);
    if (cat) {
      return {
        title: `${cat.name} | Heavy-Duty Air Conditioning | OG Heavy Duty`,
        description:
          cat.description ||
          `Explore ${cat.name} engineered for extreme Indian climates up to 52°C.`,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${cat.slug}`,
        },
      };
    }

    const directProduct = await getProductBySlug(null, slug[0]);
    if (directProduct) {
      return {
        title: `${directProduct.model} — ${directProduct.name} | OG Heavy Duty`,
        description: directProduct.description,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${directProduct.categorySlug}/${directProduct.slug}`,
        },
      };
    }

    notFound();
  }

  // 2-segments: Main Category + Subcategory OR Category + Product
  if (slug.length === 2) {
    const [parentSlug, subSlug] = slug;

    // Check if subSlug is a product
    const product = await getProductBySlug(parentSlug, subSlug);
    if (product) {
      return {
        title: `${product.model} — ${product.name} | OG Heavy Duty`,
        description: `${product.name} with ${product.specs?.coolingCapacity || "heavy duty cooling"} for tropical ambient operation.`,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${product.categorySlug}/${product.slug}`,
        },
      };
    }

    // Check if subSlug is a subcategory
    const subCat = await getCategoryBySlug(subSlug);
    const parentCat = await getCategoryBySlug(parentSlug);
    if (subCat) {
      return {
        title: `${subCat.name} | ${parentCat?.name || "Air Conditioners"} | OG Heavy Duty`,
        description:
          subCat.description ||
          `Explore heavy-duty ${subCat.name} engineered for 52°C tropical ambient duty.`,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${parentSlug}/${subSlug}`,
        },
      };
    }

    notFound();
  }

  // 3-segments: Category + Subcategory + Product
  if (slug.length === 3) {
    const product = await getProductBySlug(slug[0], slug[2]);
    if (product) {
      return {
        title: `${product.model} — ${product.name} | OG Heavy Duty`,
        description: product.description,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${slug[0]}/${slug[1]}/${product.slug}`,
        },
      };
    }
    notFound();
  }

  notFound();
}

/**
 * Universal Dynamic Route Handler for Category, Subcategory, and Product Detail.
 */
export default async function DynamicProductPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug || [];
  const activeTech = resolvedSearchParams?.tech || "all";
  const activeSub = resolvedSearchParams?.sub || null;

  if (!slug || slug.length === 0) {
    notFound();
  }

  // CASE 1: Single slug segment
  if (slug.length === 1) {
    const catSlug = slug[0];
    const category = await getCategoryBySlug(catSlug);

    if (category) {
      // Check if it's one of the 2 main categories (Domestic AC or Light Commercial AC)
      if (catSlug === "domestic-ac" || catSlug === "light-commercial-ac") {
        return await renderMainCategoryView(category, activeSub, activeTech);
      }

      // Otherwise it's a direct subcategory access (e.g. /products/window-ac, /products/split-ac, etc.)
      const products = await getProductsByCategory(catSlug);
      return renderSubcategoryView(category, products, activeTech, null);
    }

    // Check if direct product slug
    const directProduct = await getProductBySlug(null, catSlug);
    if (directProduct) {
      return await renderProductDetailView(directProduct);
    }

    notFound();
  }

  // CASE 2: Two slug segments
  if (slug.length === 2) {
    const [firstSlug, secondSlug] = slug;

    // Check if second segment is a subcategory under the main category
    if (firstSlug === "domestic-ac" || firstSlug === "light-commercial-ac") {
      const parentCat = await getCategoryBySlug(firstSlug);
      const subCat = await getCategoryBySlug(secondSlug);
      if (subCat) {
        const products = await getProductsByCategory(secondSlug);
        return renderSubcategoryView(subCat, products, activeTech, parentCat);
      }
    }

    // Check if second segment is a product
    const product = await getProductBySlug(firstSlug, secondSlug);
    if (product) {
      return await renderProductDetailView(product);
    }

    notFound();
  }

  // CASE 3: Three slug segments (category / subcategory / product)
  if (slug.length === 3) {
    const [, subSlug, productSlug] = slug;
    const product = await getProductBySlug(subSlug, productSlug);
    if (product) {
      return await renderProductDetailView(product);
    }
    notFound();
  }

  notFound();
}

/**
 * ─── Renders Subcategory View (Full Horizontal Banner, Then Technical Table) ──
 * Replaces the old card completely with a panoramic horizontal banner.
 */
function renderSubcategoryView(
  subcategory,
  products = [],
  activeTech = "all",
  parentCategory = null
) {
  const parentName =
    parentCategory?.name ||
    (subcategory.parentCategorySlug === "domestic-ac"
      ? "Domestic AC"
      : "Light Commercial AC");
  const parentSlug =
    parentCategory?.slug || subcategory.parentCategorySlug || "domestic-ac";

  const bannerData = getBannerData(
    subcategory.slug,
    subcategory.name,
    subcategory.description
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: parentName, href: `/products/${parentSlug}` },
    {
      label: subcategory.shortName || subcategory.name,
      href: `/products/${parentSlug}/${subcategory.slug}`,
      current: true,
    },
  ];

  // Schema.org CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${subcategory.name} — OG Heavy Duty`,
    description: subcategory.description,
    url: `https://ogheavyduty.in/products/${parentSlug}/${subcategory.slug}`,
    hasPart: products.map((p) => ({
      "@type": "Product",
      name: p.name,
      model: p.model,
      tonnage: p.tonnage,
      image: `https://ogheavyduty.in${p.image}`,
    })),
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. FULL PANORAMIC HORIZONTAL BANNER (WINDOW / SPLIT / COMMERCIAL AC) ── */}
      <section className="relative w-full overflow-hidden bg-[#061129] text-white border-b border-slate-800">
        {/* Horizontal Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bannerData.image}
            alt={bannerData.title}
            fill
            sizes="100vw"
            priority
            unoptimized={true}
            className="object-cover object-right md:object-center opacity-80 sm:opacity-90"
          />
          {/* Dual Multi-Stop Gradient Scrim: Clear background image visibility + 100% text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061129] via-[#061129]/85 to-[#061129]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061129] via-transparent to-[#061129]/60 pointer-events-none" />
        </div>

        {/* Blueprint Texture Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#0f7ae0_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none z-0" />

        <PageContainer
          size="default"
          className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16"
        >
          {/* Breadcrumb Row */}
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} theme="dark" />
          </div>

          {/* Classification Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/35 text-[11px] font-bold tracking-wider uppercase text-blue-300 mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span>{parentName} &bull; HEAVY-DUTY COOLING</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black font-heading text-white tracking-tight leading-tight max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {bannerData.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-3 text-xs sm:text-sm lg:text-[15px] text-slate-200 max-w-2xl leading-relaxed font-sans drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            {bannerData.tagline}
          </p>

          {/* Engineering Feature Badges (Horizontal Row) */}
          <div className="mt-6 flex flex-wrap gap-2.5 max-w-3xl">
            {bannerData.features.map((feat) => (
              <div
                key={feat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080E21]/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-xs"
              >
                <CheckCircle2 size={14} className="text-[#00D2FF] shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Direct Action Links */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#specifications-matrix"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>View Technical Specifications</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="tel:01135727834"
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <Phone size={14} className="text-[#00D2FF]" />
              <span>Call 011-35727834</span>
            </a>
          </div>
        </PageContainer>
      </section>

      {/* ── 2. TECHNICAL SPECIFICATIONS & COMPARISON TABLE (SECOND: THE TABLE) ── */}
      <PageContainer className="py-[40px] sm:py-[50px] space-y-12">
        <section id="specifications-matrix" className="scroll-mt-24">
          <CategoryModelTable
            models={products}
            categoryName={parentName}
            subcategoryName={subcategory.name}
            initialFilter={activeTech}
          />
        </section>

        {/* ── 3. TECHNICAL SIZING GUIDANCE CALLOUT ── */}
        <section className="bg-[#0B132B] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D2FF] block mb-1">
                Engineering Sizing Advisory
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                Require Custom Heat-Load Sizing or Institutional Tenders?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Our application engineering team provides certified cooling load calculations (BEE / ISHRAE standard) for institutions, server rooms, and commercial establishments.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg bg-[#0f7ae0] hover:bg-[#0b63b8] text-white font-mono text-xs font-bold tracking-wider uppercase transition-colors shadow-xs active:scale-95"
              >
                Contact Application Engineer
              </Link>
              <a
                href="tel:01135727834"
                className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold border border-white/20 transition-colors"
              >
                Call 011-35727834
              </a>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}

/**
 * ─── Renders Main Category View (e.g. Domestic AC or Light Commercial AC) ───
 */
async function renderMainCategoryView(
  category,
  activeSubSlug = null,
  activeTech = "all"
) {
  const subcategories = category.subcategories || [];
  const selectedSubSlug = activeSubSlug || subcategories[0]?.slug || "";

  // Fetch products for all subcategories in this main category
  const products = await getProductsByCategory(category.slug);
  const selectedSub =
    subcategories.find((s) => s.slug === selectedSubSlug) || subcategories[0];
  const subProducts = products.filter(
    (p) => p.subcategorySlug === selectedSub?.slug
  );

  const bannerData = getBannerData(
    selectedSub?.slug || category.slug,
    category.name,
    category.description
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: category.name, href: `/products/${category.slug}`, current: true },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── 1. FULL PANORAMIC HORIZONTAL BANNER ── */}
      <section className="relative w-full overflow-hidden bg-[#061129] text-white border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bannerData.image}
            alt={category.name}
            fill
            sizes="100vw"
            priority
            unoptimized={true}
            className="object-cover object-right md:object-center opacity-80 sm:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061129] via-[#061129]/85 to-[#061129]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061129] via-transparent to-[#061129]/60 pointer-events-none" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(#0f7ae0_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none z-0" />

        <PageContainer
          size="default"
          className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16"
        >
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} theme="dark" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/35 text-[11px] font-bold tracking-wider uppercase text-blue-300 mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span>COMMERCIAL GRADE &bull; 52°C TROPICAL DUTY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black font-heading text-white tracking-tight leading-tight max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            OG Heavy Duty {category.name}
          </h1>

          <p className="mt-3 text-xs sm:text-sm lg:text-[15px] text-slate-200 max-w-2xl leading-relaxed font-sans drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            {category.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 max-w-3xl">
            {bannerData.features.map((feat) => (
              <div
                key={feat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080E21]/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-xs"
              >
                <CheckCircle2 size={14} className="text-[#00D2FF] shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#specifications-matrix"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>View Model Specifications Table</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="tel:01135727834"
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <Phone size={14} className="text-[#00D2FF]" />
              <span>Call 011-35727834</span>
            </a>
          </div>
        </PageContainer>
      </section>

      {/* ── 2. SUBCATEGORY SELECTOR & SPECIFICATIONS TABLE ── */}
      <PageContainer className="py-[40px] sm:py-[50px] space-y-8">
        {/* Subcategory Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {subcategories.map((sub) => {
            const isCurrent = sub.slug === selectedSub?.slug;
            return (
              <Link
                key={sub.slug}
                href={`/products/${category.slug}/${sub.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#0f7ae0] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:text-[#0f7ae0] hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>

        {/* Selected Subcategory Specifications Table */}
        <section id="specifications-matrix" className="scroll-mt-24">
          <CategoryModelTable
            models={subProducts.length > 0 ? subProducts : products}
            categoryName={category.name}
            subcategoryName={selectedSub?.name || category.name}
            initialFilter={activeTech}
          />
        </section>
      </PageContainer>
    </div>
  );
}

/**
 * ─── Renders Individual Product Detail View ──────────────────────────────────
 */
async function renderProductDetailView(product) {
  const categoryProducts = await getProductsByCategory(
    product.subcategorySlug || product.categorySlug
  );

  const bannerData = getBannerData(
    product.subcategorySlug || product.categorySlug,
    product.name,
    product.description
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label:
        product.categorySlug === "domestic-ac"
          ? "Domestic AC"
          : "Light Commercial AC",
      href: `/products/${product.categorySlug}`,
    },
    {
      label: product.subcategorySlug || "Models",
      href: `/products/${product.categorySlug}/${product.subcategorySlug || ""}`,
    },
    {
      label: product.model,
      href: `/products/${product.categorySlug}/${product.slug}`,
      current: true,
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── 1. FULL PANORAMIC HORIZONTAL BANNER ── */}
      <section className="relative w-full overflow-hidden bg-[#061129] text-white border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bannerData.image}
            alt={product.model}
            fill
            sizes="100vw"
            priority
            unoptimized={true}
            className="object-cover object-right md:object-center opacity-80 sm:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061129] via-[#061129]/85 to-[#061129]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061129] via-transparent to-[#061129]/60 pointer-events-none" />
        </div>

        <PageContainer
          size="default"
          className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16"
        >
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} theme="dark" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/35 text-[11px] font-bold tracking-wider uppercase text-blue-300 mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span>MODEL SPECIFICATION &bull; {product.tonnage}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black font-heading text-white tracking-tight leading-tight max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {product.model} — {product.name}
          </h1>

          <p className="mt-3 text-xs sm:text-sm lg:text-[15px] text-slate-200 max-w-2xl leading-relaxed font-sans drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            {product.description ||
              `Heavy-duty air conditioning unit engineered with 100% inner-grooved copper coils and tropicalized rotary compressor for uncompromised pull-down cooling up to 52°C.`}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#specifications-matrix"
              className="px-6 py-3 rounded-lg bg-[#0f7ae0] hover:bg-[#0b63b8] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>View Series Comparison Matrix</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </PageContainer>
      </section>

      {/* ── 2. TECHNICAL SPECIFICATIONS & SERIES COMPARISON ── */}
      <PageContainer className="py-[40px] sm:py-[50px] space-y-10">
        <section id="specifications-matrix" className="scroll-mt-24">
          <CategoryModelTable
            models={categoryProducts}
            categoryName={product.categorySlug}
            subcategoryName={product.subcategorySlug}
          />
        </section>
      </PageContainer>
    </div>
  );
}
