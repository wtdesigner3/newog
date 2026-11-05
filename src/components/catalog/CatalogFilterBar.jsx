"use client";

import React from "react";
import Link from "next/link";

/**
 * CatalogFilterBar — Interactive subcategory filter bar for category pages.
 * Standardized with elevated border-2 styling and brand visual tokens.
 */
export default function CatalogFilterBar({
  categorySlug,
  subcategories = [],
  activeSubcategory = null,
  totalCount = 0,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-5 bg-white border-2 border-slate-200/90 rounded-2xl shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)]">
      {/* Subcategory Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/products/${categorySlug}`}
          className={`px-4 py-2 min-h-[40px] sm:min-h-0 inline-flex items-center rounded-xl text-xs font-bold transition-all ${
            !activeSubcategory
              ? "bg-[#0B132B] text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          All Models ({totalCount})
        </Link>

        {subcategories.map((sub) => {
          const isActive = activeSubcategory === sub.slug;
          return (
            <Link
              key={sub.slug}
              href={`/products/${categorySlug}?sub=${encodeURIComponent(sub.slug)}`}
              className={`px-4 py-2 min-h-[40px] sm:min-h-0 inline-flex items-center rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {sub.name}
            </Link>
          );
        })}
      </div>

      {/* Verified Notice */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Factory Calibrated Specifications</span>
      </div>
    </div>
  );
}
