import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
} from "@/lib/services/catalogService";
import { getResourcesForProduct } from "@/lib/services/resourceService";
import {
  PublicPageBanner,
  PageContainer,
} from "@/components/public";
import {
  ProductCard,
  ProductSpecTable,
  ProductGallery,
  RelatedProductsCarousel,
  CategoryModelTable,
} from "@/components/catalog";
import { ShieldCheck, ThermometerSnowflake, CheckCircle2, Phone, ArrowRight } from "lucide-react";

/**
 * Generate dynamic SEO metadata for Category, Subcategory, and Product Detail pages.
 */
export async function generateMetadata({ params, searchParams }) {
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
        description: cat.description || `Explore ${cat.name} engineered for extreme Indian climates up to 52°C.`,
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
        description: subCat.description || `Explore heavy-duty ${subCat.name} engineered for 52°C tropical ambient duty.`,
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
 * ─── Renders Subcategory View (Image First, Then Table) ──────────────────────
 */
function renderSubcategoryView(subcategory, products = [], activeTech = "all", parentCategory = null) {
  const parentName = parentCategory?.name || (subcategory.parentCategorySlug === "domestic-ac" ? "Domestic AC" : "Light Commercial AC");
  const parentSlug = parentCategory?.slug || subcategory.parentCategorySlug || "domestic-ac";

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

  const imageSrc = subcategory.image || "/uploads/category/1649065324_window-ac.gif";

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Page Banner ── */}
      <PublicPageBanner
        title={subcategory.name}
        subtitle={subcategory.tagline || subcategory.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: parentName, href: `/products/${parentSlug}` },
          { label: subcategory.shortName || subcategory.name, href: `/products/${parentSlug}/${subcategory.slug}`, current: true },
        ]}
        bgImage={subcategory.bannerImage || "/uploads/breadcrumb/1648811523_download.jpg"}
      />

      <PageContainer className="py-[50px] sm:py-[60px] space-y-12 sm:space-y-16">
        {/* ── 1. HERO CATEGORY IMAGE SHOWCASE CARD (FIRST: THE IMAGE) ── */}
        <section className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-10 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Category Image Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full aspect-4/3 max-w-[420px] rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 border border-slate-200/80 flex items-center justify-center overflow-hidden group">
                <Image
                  src={imageSrc}
                  alt={subcategory.name}
                  width={460}
                  height={340}
                  priority
                  className="w-full h-auto max-h-[280px] object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Ambient Blueprint Grid Texture */}
                <div className="absolute inset-0 bg-ac-blueprint opacity-10 pointer-events-none" />

                {/* Floating Highlights Badges */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 shadow-xs flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                  <ShieldCheck size={13} className="text-[#0f7ae0]" />
                  <span>100% Copper</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#080E21]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-blue-500/30 shadow-xs flex items-center gap-1.5 text-[11px] font-bold text-[#00D2FF]">
                  <ThermometerSnowflake size={13} />
                  <span>52°C Ambient</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Summary & Direct Inquiry Action */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-block text-xs font-black uppercase tracking-wider text-[#0f7ae0] bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60 mb-2">
                  {parentName} &bull; HEAVY-DUTY COOLING
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  OG Heavy Duty {subcategory.name}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2.5">
                  {subcategory.description}
                </p>
              </div>

              {/* Engineering Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>100% Inner-Grooved Pure Copper Coils</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>52°C Extreme Tropical Ambient Operation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Heavy-Duty Tropical Rotary Compressor</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Anti-Corrosion Hydrophilic Blue Fin Barrier</span>
                </div>
              </div>

              {/* Commercial Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="#models-table"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>View Specifications Table</span>
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="tel:01135727834"
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center gap-2"
                >
                  <Phone size={14} className="text-[#0f7ae0]" />
                  <span>Call 011-35727834</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. FULL SPECIFICATIONS & COMPARISON TABLE (SECOND: THE TABLE) ── */}
        <section id="models-table" className="pt-2">
          <CategoryModelTable
            models={products}
            categoryName={parentName}
            subcategoryName={subcategory.name}
            initialFilter={activeTech}
          />
        </section>

        {/* ── 3. TECHNICAL SIZING GUIDANCE CALLOUT ── */}
        <section className="bg-[#0B132B] rounded-3xl p-8 sm:p-10 text-white border-2 border-slate-800 shadow-[0_16px_36px_-6px_rgba(11,19,43,0.25)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D2FF] block mb-1">
                Engineering Sizing Advisory
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                Require Custom Heat-Load Sizing or Institutional Tenders?
              </h3>
              <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
                Our application engineering team provides certified cooling load calculations (BEE / ISHRAE standard) for institutions, server rooms, and commercial establishments.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-xs transition-all shadow-md active:scale-95"
              >
                Contact Application Engineer
              </Link>
              <a
                href="tel:01135727834"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
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
async function renderMainCategoryView(category, activeSubSlug = null, activeTech = "all") {
  const subcategories = category.subcategories || [];
  const selectedSubSlug = activeSubSlug || subcategories[0]?.slug || "";
  
  // Fetch products for all subcategories in this main category
  const products = await getProductsByCategory(category.slug);
  const selectedSub = subcategories.find((s) => s.slug === selectedSubSlug) || subcategories[0];
  const subProducts = products.filter((p) => p.subcategorySlug === selectedSub?.slug);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── Hero Page Banner ── */}
      <PublicPageBanner
        title={category.name}
        subtitle={category.tagline || category.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: category.name, href: `/products/${category.slug}`, current: true },
        ]}
        bgImage={category.bannerImage || "/uploads/breadcrumb/1648811523_download.jpg"}
      />

      <PageContainer className="py-[50px] sm:py-[60px] space-y-10">
        {/* Subcategory Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {subcategories.map((sub) => {
            const isCurrent = sub.slug === selectedSub?.slug;
            return (
              <Link
                key={sub.slug}
                href={`/products/${category.slug}/${sub.slug}`}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isCurrent
                    ? "bg-[#0f7ae0] text-white shadow-md"
                    : "bg-white text-slate-700 hover:text-[#0f7ae0] hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>

        {/* Selected Subcategory: Image First, Then Table */}
        {selectedSub && (
          <div className="space-y-12">
            {/* 1. Category Image Showcase */}
            <section className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-10 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.08)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-4/3 max-w-[420px] rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 border border-slate-200/80 flex items-center justify-center overflow-hidden group">
                    <Image
                      src={selectedSub.image || "/uploads/category/1649065324_window-ac.gif"}
                      alt={selectedSub.name}
                      width={460}
                      height={340}
                      priority
                      className="w-full h-auto max-h-[280px] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 shadow-xs flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                      <ShieldCheck size={13} className="text-[#0f7ae0]" />
                      <span>100% Copper</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#080E21]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-blue-500/30 shadow-xs flex items-center gap-1.5 text-[11px] font-bold text-[#00D2FF]">
                      <ThermometerSnowflake size={13} />
                      <span>52°C Ambient</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <span className="inline-block text-xs font-black uppercase tracking-wider text-[#0f7ae0] bg-blue-50 px-3 py-1 rounded-md border border-blue-200/60 mb-2">
                      {category.name} &bull; HEAVY-DUTY SPECIFICATION
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      OG Heavy Duty {selectedSub.name}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2.5">
                      {selectedSub.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>100% Inner-Grooved Pure Copper Coils</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>52°C Continuous High-Ambient Cooling</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/products/${category.slug}/${selectedSub.slug}`}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Explore Dedicated {selectedSub.name} Page</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Specifications Table */}
            <section>
              <CategoryModelTable
                models={subProducts.length > 0 ? subProducts : products}
                categoryName={category.name}
                subcategoryName={selectedSub.name}
                initialFilter={activeTech}
              />
            </section>
          </div>
        )}
      </PageContainer>
    </div>
  );
}

/**
 * ─── Renders Individual Product Detail View ──────────────────────────────────
 */
async function renderProductDetailView(product) {
  const categoryProducts = await getProductsByCategory(product.subcategorySlug || product.categorySlug);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Page Banner */}
      <PublicPageBanner
        title={product.model}
        subtitle={product.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: product.categorySlug === "domestic-ac" ? "Domestic AC" : "Light Commercial AC", href: `/products/${product.categorySlug}` },
          { label: product.subcategorySlug || "Models", href: `/products/${product.categorySlug}/${product.subcategorySlug || ""}` },
          { label: product.model, href: `/products/${product.categorySlug}/${product.slug}`, current: true },
        ]}
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
      />

      <PageContainer className="py-[50px] sm:py-[60px] space-y-12">
        {/* Product Image & Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 flex items-center justify-center shadow-xs">
            <Image
              src={product.image || "/uploads/category/1649065324_window-ac.gif"}
              alt={product.name}
              width={460}
              height={340}
              className="w-full h-auto max-h-[320px] object-contain"
            />
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-black text-[#0f7ae0] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/80">
                MODEL: {product.model}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                {product.tonnage}
              </span>
              {product.starRating && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  ★ {product.starRating}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Equipped with 100% inner-grooved heavy copper condenser coils, tropicalized rotary compressor, and engineered for continuous pull-down up to 52°C ambient temperatures.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Tonnage</span>
                <span className="text-sm font-bold text-slate-900">{product.tonnage}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Technology</span>
                <span className="text-sm font-bold text-slate-900">{product.technology}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Max Ambient</span>
                <span className="text-sm font-bold text-[#0f7ae0]">52°C Peak</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Metallurgy</span>
                <span className="text-sm font-bold text-slate-900">100% Copper</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Comparison Table for the whole series */}
        <div>
          <CategoryModelTable
            models={categoryProducts}
            categoryName={product.categorySlug}
            subcategoryName={product.subcategorySlug}
          />
        </div>
      </PageContainer>
    </div>
  );
}
