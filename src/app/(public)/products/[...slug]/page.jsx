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
  PublicPageBanner,
  PageContainer,
} from "@/components/public";
import {
  CategoryModelTable,
} from "@/components/catalog";
import { ShieldCheck, ThermometerSnowflake, CheckCircle2, Phone, ArrowRight } from "lucide-react";

/**
 * Horizontal Banner Image Mapping for Each Subcategory & Category.
 * Used for the wide horizontal image section rendered directly before the table.
 */
const SUBCATEGORY_BANNER_MAP = {
  "window-ac": "/images/banner_window_ac_horizontal.jpg",
  "split-ac": "/images/banner_split_ac_horizontal.jpg",
  "four-way-cassette-ac": "/images/banner_cassette_ac_horizontal.jpg",
  "one-way-cassette-ac": "/images/banner_cassette_ac_horizontal.jpg",
  "ductable-ac": "/images/banner_ductable_ac_horizontal.jpg",
  "floor-standing-ac": "/images/banner_ac_tower_new.jpg",
  "survivor-ac": "/images/banner_survivor_ac_horizontal.jpg",
  "domestic-ac": "/images/banner_split_ac_horizontal.jpg",
  "light-commercial-ac": "/images/banner_cassette_ac_horizontal.jpg",
};

/**
 * Custom object-position for each subcategory/category banner to guarantee
 * that air conditioning units mounted near ceilings or high walls are 100% visible
 * without any cropping.
 */
const SUBCATEGORY_POSITION_MAP = {
  "split-ac": "center 25%",
  "four-way-cassette-ac": "center 20%",
  "one-way-cassette-ac": "center 20%",
  "window-ac": "center 40%",
  "ductable-ac": "center 25%",
  "floor-standing-ac": "center center",
  "survivor-ac": "center center",
  "domestic-ac": "center 25%",
  "light-commercial-ac": "center 20%",
};

function getBannerImage(slug) {
  return SUBCATEGORY_BANNER_MAP[slug] || "/images/banner_window_ac_horizontal.jpg";
}

function getBannerPosition(slug) {
  return SUBCATEGORY_POSITION_MAP[slug] || "center center";
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
        title: `${cat.name} | Heavy-Duty Air Conditioning`,
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
        title: `${directProduct.model} — ${directProduct.name}`,
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
        title: `${product.model} — ${product.name}`,
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
        title: `${subCat.name} | ${parentCat?.name || "Air Conditioners"}`,
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
        title: `${product.model} — ${product.name}`,
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
 * ─── Renders Subcategory View ───────────────────────────────────────────────
 * Page Header (PublicPageBanner) stays intact.
 * Inside container: Wide Horizontal Banner Image Section, then Technical Table.
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

  const bannerImage = getBannerImage(subcategory.slug);
  const bannerPosition = getBannerPosition(subcategory.slug);

  const breadcrumbItems = [
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
    name: subcategory.name,
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

      {/* ── Standard Page Header Banner (Preserved as requested) ── */}
      <PublicPageBanner
        title={subcategory.name}
        subtitle={subcategory.tagline || subcategory.description}
        badge={`${parentName} • HEAVY-DUTY COOLING`}
        breadcrumbItems={breadcrumbItems}
        bgImage={subcategory.bannerImage || "/uploads/breadcrumb/1648811523_download.jpg"}
      />

      <PageContainer className="py-[40px] sm:py-[50px] space-y-8 sm:space-y-10">
        {/* ── 1. HORIZONTAL IMAGE BANNER SECTION (BEFORE TABLE - PURE CLEAN IMAGE) ── */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-[#061129]">
          <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] lg:h-[460px] overflow-hidden">
            <Image
              src={bannerImage}
              alt={subcategory.name}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              unoptimized={true}
              className="object-cover"
              style={{ objectPosition: bannerPosition }}
            />
          </div>
        </section>

        {/* ── 2. TECHNICAL SPECIFICATIONS & MODEL COMPARISON TABLE ── */}
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

  const subSlug = selectedSub?.slug || category.slug;
  const bannerImage = getBannerImage(subSlug);
  const bannerPosition = getBannerPosition(subSlug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category.name, href: `/products/${category.slug}`, current: true },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── Standard Page Header Banner (Preserved) ── */}
      <PublicPageBanner
        title={category.name}
        subtitle={category.tagline || category.description}
        badge="COMMERCIAL GRADE • 52°C TROPICAL DUTY"
        breadcrumbItems={breadcrumbItems}
        bgImage={category.bannerImage || "/uploads/breadcrumb/1648811523_download.jpg"}
      />

      <PageContainer className="py-[40px] sm:py-[50px] space-y-8">
        {/* Subcategory Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {subcategories.map((sub) => {
            const isCurrent = sub.slug === selectedSub?.slug;
            return (
              <Link
                key={sub.slug}
                href={`/products/${category.slug}/${sub.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${isCurrent
                  ? "bg-[#0f7ae0] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:text-[#0f7ae0] hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>

        {/* ── Horizontal Banner Image for Selected Subcategory (PURE CLEAN IMAGE) ── */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-[#061129]">
          <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] lg:h-[460px] overflow-hidden">
            <Image
              src={bannerImage}
              alt={selectedSub?.name || category.name}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              unoptimized={true}
              className="object-cover"
              style={{ objectPosition: bannerPosition }}
            />
          </div>
        </section>

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

  const subSlug = product.subcategorySlug || product.categorySlug;
  const bannerImage = getBannerImage(subSlug);
  const bannerPosition = getBannerPosition(subSlug);

  const breadcrumbItems = [
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
      {/* ── Standard Page Header Banner (Preserved) ── */}
      <PublicPageBanner
        title={product.model}
        subtitle={product.name}
        badge={`MODEL SPECIFICATION • ${product.tonnage}`}
        breadcrumbItems={breadcrumbItems}
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
      />

      <PageContainer className="py-[40px] sm:py-[50px] space-y-8">
        {/* Horizontal Banner Section for Product Category (PURE CLEAN IMAGE) ── */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-[#061129]">
          <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] lg:h-[460px] overflow-hidden">
            <Image
              src={bannerImage}
              alt={product.model}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              unoptimized={true}
              className="object-cover"
              style={{ objectPosition: bannerPosition }}
            />
          </div>
        </section>

        {/* Specifications & Comparison Table for the series */}
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
