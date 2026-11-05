import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * CategoryGrid — Renders the 6 primary HVAC cooling categories.
 *
 * Each card features:
 * - Technical series badge & tonnage range
 * - Authentic category image or GIF
 * - Engineering capabilities & key feature pills
 * - Direct link to the category page (/products/[category])
 */
export default function CategoryGrid({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {categories.map((cat) => (
        <article
          key={cat.slug}
          className="group bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#0f7ae0] shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_40px_-8px_rgba(15,122,224,0.18)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
        >
          {/* Card Media Banner */}
          <div className="relative aspect-16/10 bg-slate-50 p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
            <Link href={`/products/${cat.slug}`} className="relative w-full h-full block">
              <Image
                src={cat.image || "/uploads/products/1648809194_project_1.jpg"}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                unoptimized={Boolean(cat.isGif)}
              />
            </Link>

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B132B] text-[#00D2FF] shadow-xs border border-blue-400/20">
                {cat.series}
              </span>
            </div>

            {/* Product Count Pill */}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200">
                {cat.productCount || cat.products?.length || 0} Models
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-2">
              <span
                className="text-xs font-bold tracking-wide uppercase text-[#0f7ae0] block mb-1"
                dangerouslySetInnerHTML={{ __html: cat.tonnageRange }}
              />
              <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors">
                <Link href={`/products/${cat.slug}`}>
                  {cat.name}
                </Link>
              </h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {cat.tagline || cat.description}
            </p>

            {/* Subcategories Chips */}
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <span
                    key={sub.slug}
                    className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            )}

            {/* Card Action Footer */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/products/${cat.slug}`}
                className="inline-flex items-center text-xs sm:text-sm font-bold text-[#0f7ae0] group-hover:text-[#0b5bb0] transition-colors"
              >
                <span>Explore {cat.shortName} Range</span>
                <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
