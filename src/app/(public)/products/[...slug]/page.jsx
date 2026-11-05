import React from "react";
import Link from "next/link";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/services/catalogService";
import { getResourcesForProduct } from "@/lib/services/resourceService";
import {
  PublicPageBanner,
  PageContainer,
  SectionContainer,
  SectionHeading,
} from "@/components/public";
import {
  ProductCard,
  ProductSpecTable,
  ProductGallery,
  CatalogFilterBar,
  RelatedProductsCarousel,
} from "@/components/catalog";

/**
 * Generate dynamic SEO metadata for Category, Subcategory, and Product Detail pages.
 */
export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  if (slug.length === 0) {
    notFound();
  }

  // Handle legacy route: /products/category/:c_url
  if (slug[0] === "category" && slug[1]) {
    const cat = await getCategoryBySlug(slug[1]);
    if (cat) {
      const canonicalSlug = cat.canonicalSlug || cat.slug;
      return {
        title: `${cat.name} (${cat.tonnageRange.replace(/&bull;/g, "•")}) | OG Heavy Duty`,
        description: cat.description,
        alternates: { canonical: `https://ogheavyduty.in/products/${canonicalSlug}` },
      };
    }
    notFound();
  }

  // 1-segment: Category Listing
  if (slug.length === 1) {
    const cat = await getCategoryBySlug(slug[0]);
    if (cat) {
      const canonicalSlug = cat.canonicalSlug || cat.slug;
      return {
        title: `${cat.name} (${cat.tonnageRange.replace(/&bull;/g, "•")}) | High-Ambient Engineering | OG Heavy Duty`,
        description: `${cat.tagline || cat.description} Explore our heavy-duty ${cat.name} engineered for demanding Indian summers with 100% copper coils.`,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${canonicalSlug}`,
        },
        openGraph: {
          title: `${cat.name} — OG Heavy Duty`,
          description: cat.description,
          url: `https://ogheavyduty.in/products/${canonicalSlug}`,
        },
      };
    }

    // Direct product lookup fallback
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

  // 2-segments: Either Category + Subcategory OR Category + Product
  if (slug.length === 2) {
    const cat = await getCategoryBySlug(slug[0]);
    // Check if second segment is a product
    const product = await getProductBySlug(slug[0], slug[1]);
    if (product) {
      return {
        title: `${product.model} — ${product.name} | OG Heavy Duty`,
        description: `${product.name} with ${product.specs?.coolingCapacity || "heavy duty cooling"}, ${product.specs?.compressorType || "tropical compressor"}, and robust tropical ambient operation.`,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${product.categorySlug}/${product.slug}`,
        },
        openGraph: {
          title: `${product.model} — ${product.name}`,
          description: product.description,
          url: `https://ogheavyduty.in/products/${product.categorySlug}/${product.slug}`,
          images: [{ url: product.image }],
        },
      };
    }

    // Check if second segment is a subcategory
    if (cat) {
      const canonicalSlug = cat.canonicalSlug || cat.slug;
      const sub = cat.subcategories?.find((s) => s.slug === slug[1]);
      if (sub) {
        return {
          title: `${sub.name} — ${cat.name} | OG Heavy Duty`,
          description: `Explore ${sub.name} in the ${cat.name} lineup. Heavy duty cooling systems engineered for demanding Indian summer climates.`,
          alternates: {
            canonical: `https://ogheavyduty.in/products/${canonicalSlug}`,
          },
        };
      }
    }

    // Mismatched category fallback (HARDENING-631-03)
    const crossCatProduct = await getProductBySlug(null, slug[1]);
    if (crossCatProduct) {
      return {
        title: `${crossCatProduct.model} — ${crossCatProduct.name} | OG Heavy Duty`,
        description: crossCatProduct.description,
        alternates: {
          canonical: `https://ogheavyduty.in/products/${crossCatProduct.categorySlug}/${crossCatProduct.slug}`,
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
          canonical: `https://ogheavyduty.in/products/${product.categorySlug}/${product.slug}`,
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

  if (!slug || slug.length === 0) {
    notFound();
  }

  // Handle legacy route: /products/category/:categorySlug -> Redirect to canonical
  if (slug[0] === "category" && slug[1]) {
    const cat = await getCategoryBySlug(slug[1]);
    const target = cat?.canonicalSlug || cat?.slug || slug[1];
    permanentRedirect(`/products/${target}`);
  }

  // CASE 1: Single slug segment
  if (slug.length === 1) {
    const category = await getCategoryBySlug(slug[0]);
    if (category) {
      if (category.isAlias && category.canonicalSlug && category.canonicalSlug !== slug[0]) {
        const query = resolvedSearchParams && Object.keys(resolvedSearchParams).length > 0
          ? `?${new URLSearchParams(resolvedSearchParams).toString()}`
          : "";
        permanentRedirect(`/products/${category.canonicalSlug}${query}`);
      }
      const activeSub = resolvedSearchParams?.sub || null;
      return renderCategoryView(category, activeSub);
    }

    // Fallback: check if slug is a direct product slug
    const directProduct = await getProductBySlug(null, slug[0]);
    if (directProduct) {
      permanentRedirect(`/products/${directProduct.categorySlug}/${directProduct.slug}`);
    }

    notFound();
  }

  // CASE 2: Two slug segments
  if (slug.length === 2) {
    const [categorySlug, secondSlug] = slug;
    const category = await getCategoryBySlug(categorySlug);

    // If category was accessed via historical alias, permanently redirect to canonical URL
    if (category?.isAlias && category.canonicalSlug && category.canonicalSlug !== categorySlug) {
      permanentRedirect(`/products/${category.canonicalSlug}/${secondSlug}`);
    }

    // Check if second segment is a product
    const product = await getProductBySlug(categorySlug, secondSlug);
    if (product) {
      if (product.categorySlug && product.categorySlug !== categorySlug) {
        permanentRedirect(`/products/${product.categorySlug}/${product.slug}`);
      }
      return await renderProductDetailView(product);
    }

    // Check if second segment is a subcategory
    if (category) {
      const sub = category.subcategories?.find((s) => s.slug === secondSlug);
      if (sub) {
        return renderCategoryView(category, sub.slug);
      }
    }

    // Mismatched product check (HARDENING-631-03): If secondSlug is a valid product belonging to a different category
    const crossCatProduct = await getProductBySlug(null, secondSlug);
    if (crossCatProduct && crossCatProduct.categorySlug && crossCatProduct.categorySlug !== categorySlug) {
      permanentRedirect(`/products/${crossCatProduct.categorySlug}/${crossCatProduct.slug}`);
    }

    notFound();
  }

  // CASE 3: Three slug segments (category / subcategory / product)
  if (slug.length === 3) {
    const [categorySlug, subSlug, productSlug] = slug;
    const category = await getCategoryBySlug(categorySlug);

    // If category was accessed via historical alias, permanently redirect to canonical URL
    if (category?.isAlias && category.canonicalSlug && category.canonicalSlug !== categorySlug) {
      permanentRedirect(`/products/${category.canonicalSlug}/${subSlug}/${productSlug}`);
    }

    const product = await getProductBySlug(categorySlug, productSlug);
    if (product) {
      if (product.categorySlug && product.categorySlug !== categorySlug) {
        permanentRedirect(`/products/${product.categorySlug}/${subSlug}/${product.slug}`);
      }
      return await renderProductDetailView(product);
    }

    // Mismatched product check (HARDENING-631-03)
    const crossCatProduct = await getProductBySlug(null, productSlug);
    if (crossCatProduct && crossCatProduct.categorySlug && crossCatProduct.categorySlug !== categorySlug) {
      permanentRedirect(`/products/${crossCatProduct.categorySlug}/${productSlug}`);
    }

    notFound();
  }

  notFound();
}

/**
 * Renders the Category Listing View
 */
function renderCategoryView(category, activeSubcategory) {
  // Filter products by subcategory if active
  const filteredProducts = activeSubcategory
    ? category.products.filter((p) => p.subcategorySlug === activeSubcategory)
    : category.products;

  // Schema.org CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} — OG Heavy Duty`,
    description: category.description,
    url: `https://ogheavyduty.in/products/${category.slug}`,
    hasPart: filteredProducts.map((p) => ({
      "@type": "Product",
      name: p.name,
      model: p.model,
      url: `https://ogheavyduty.in/products/${category.slug}/${p.slug}`,
      image: `https://ogheavyduty.in${p.image}`,
    })),
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Page Banner */}
      <PublicPageBanner
        title={category.name}
        subtitle={category.tagline || category.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: category.shortName, href: `/products/${category.slug}`, current: true },
        ]}
        bgImage={category.bannerImage || "/uploads/breadcrumb/1648811523_download.jpg"}
      />

      {/* Main Content Area */}
      <PageContainer className="py-[60px]">
        {/* Subcategory Filter Bar */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <CatalogFilterBar
              categorySlug={category.slug}
              subcategories={category.subcategories}
              activeSubcategory={activeSubcategory}
              totalCount={category.products.length}
            />
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.slug} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No models match this subcategory filter</h3>
            <p className="text-slate-500 text-sm mb-6">Explore all models in the {category.name} range.</p>
            <Link
              href={`/products/${category.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] text-white font-bold text-xs shadow-xs"
            >
              Reset Filters
            </Link>
          </div>
        )}

        {/* Technical Guidance Callout */}
        <div className="mt-16 bg-[#0B132B] rounded-3xl p-8 sm:p-10 text-white border-2 border-slate-800 shadow-[0_16px_36px_-6px_rgba(11,19,43,0.25)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D2FF] block mb-1">
                Engineering Sizing Advisory
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                Unsure which capacity fits your thermal heat load?
              </h3>
              <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
                Our application engineering team provides free cooling load calculations (BEE / ISHRAE standard) for commercial spaces, server rooms, and industrial production floors.
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
        </div>
      </PageContainer>
    </div>
  );
}

/**
 * Renders the Individual Product Detail View
 */
async function renderProductDetailView(product) {
  const relatedProducts = await getRelatedProducts(product.categorySlug, product.slug, 8);
  const enquiryUrl = `/contact?model=${encodeURIComponent(product.model)}&category=${encodeURIComponent(product.categorySlug)}`;
  const productDocs = await getResourcesForProduct(product.model);

  // Schema.org Product structured data (Authentic data only, zero fake reviews/prices)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    model: product.model,
    image: `https://ogheavyduty.in${product.image}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "OG Heavy Duty",
    },
    category: product.categoryName,
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Cooling Capacity", value: product.specs?.coolingCapacity },
      product.starRating ? { "@type": "PropertyValue", name: "Star Rating", value: product.starRating } : null,
      { "@type": "PropertyValue", name: "ISEER", value: product.specs?.iseer },
      { "@type": "PropertyValue", name: "Compressor Type", value: product.specs?.compressorType },
      { "@type": "PropertyValue", name: "Max Ambient Design", value: product.specs?.maxAmbient },
      { "@type": "PropertyValue", name: "Eco Refrigerant", value: product.specs?.refrigerant },
    ].filter((p) => p && p.value),
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Page Banner */}
      <PublicPageBanner
        title={product.model}
        subtitle={product.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: product.categoryName?.replace("Air Conditioners", "AC") || "Category", href: `/products/${product.categorySlug}` },
          { label: product.model, href: `/products/${product.categorySlug}/${product.slug}`, current: true },
        ]}
        bgImage="/uploads/breadcrumb/1648811523_download.jpg"
      />

      <PageContainer className="py-[60px]">
        {/* Top Product Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
          {/* Left: Product Media Gallery (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          {/* Right: Technical Specs Summary & Ordering */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08)] flex flex-col justify-between">
            <div>
              {/* Model & Series Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0f7ae0] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/80">
                  MODEL: {product.model}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/80">
                  {product.categoryName}
                </span>
                {product.starRating && (
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/80">
                    ★ {product.starRating} Rating
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Core Thermal Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-6">
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Tonnage</span>
                  <span className="text-base font-bold text-slate-900">{product.tonnage}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Cooling Output</span>
                  <span className="text-base font-bold text-slate-900">{product.specs?.coolingCapacity || "Heavy Duty"}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Max Ambient</span>
                  <span className="text-base font-bold text-[#0f7ae0]">{product.specs?.maxAmbient || "Tropical Tested"}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Power Input</span>
                  <span className="text-base font-bold text-slate-900">{product.specs?.powerInput || "Standard"}</span>
                </div>
              </div>

              {/* Engineering Highlights */}
              {product.features && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Key Engineering Advantages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Commercial Action CTA Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                data-open-quote
                data-model={product.model}
                data-product={product.name}
                data-category={product.categoryName}
                data-enquiry-type="Commercial / Project Quotation"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all text-center active:scale-95 cursor-pointer"
              >
                Request Commercial Quotation
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <a
                href="tel:01135727834"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 transition-colors"
              >
                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                011-35727834
              </a>
            </div>
          </div>
        </div>

        {/* Full Engineering Specification Table Section */}
        <div className="mb-16">
          <div className="mb-8 border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0f7ae0] block mb-1">
              Manufacturer Technical Specifications
            </span>
            <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Full Engineering Specifications: {product.model}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Manufacturer rated at standard Indian testing points (35°C DB / 24°C WB) with high ambient design verification.
            </p>
          </div>

          <ProductSpecTable product={product} />
        </div>

        {/* Recommended Applications Box */}
        {product.applications && product.applications.length > 0 && (
          <div className="mb-16 bg-white rounded-2xl border-2 border-slate-200/90 p-8 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">
              Recommended Operating Environments &amp; Commercial Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {product.applications.map((app, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0f7ae0] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{app}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Systems Carousel */}
        {relatedProducts.length > 0 && (
          <RelatedProductsCarousel
            products={relatedProducts}
            categoryName={product.categoryName}
            categorySlug={product.categorySlug}
          />
        )}
      </PageContainer>
    </div>
  );
}
