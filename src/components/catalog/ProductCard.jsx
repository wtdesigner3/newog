"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuoteModal } from "@/context/QuoteModalContext";

/**
 * ProductCard — Compact, engineering-grade HVAC product card.
 * Standardized with elevated border-2 styling and streamlined compact height.
 */
export default function ProductCard({ product }) {
  const { openQuoteModal } = useQuoteModal();
  if (!product) return null;

  const detailUrl = `/products/${product.categorySlug}/${product.slug}`;
  const enquiryUrl = `/contact?model=${encodeURIComponent(product.model)}&category=${encodeURIComponent(product.categorySlug)}`;

  return (
    <article className="group bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#0f7ae0] shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(15,122,224,0.14)] transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
      {/* Product Image Stage - Compact Aspect */}
      <div className="relative w-full aspect-[16/11] bg-slate-50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <Link href={detailUrl} className="relative w-full h-full block">
          <Image
            src={product.image || "/uploads/products/1648809194_project_1.jpg"}
            alt={`${product.name} - ${product.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Category Series Tag */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase bg-slate-900/85 text-slate-100 backdrop-blur-xs border border-white/10">
            {product.categoryName?.replace("Air Conditioners", "AC") || "Heavy Duty"}
          </span>
        </div>
      </div>

      {/* Card Content Body - Streamlined & Compact */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Model Identifier Bar */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-block font-mono text-[11.5px] font-bold text-[#0f7ae0] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
              {product.model}
            </span>
            {product.specs?.refrigerant && (
              <span className="font-mono text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                {product.specs.refrigerant}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-[14.5px] font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors line-clamp-1 leading-snug mb-3">
            <Link href={detailUrl}>
              {product.name}
            </Link>
          </h3>

          {/* Technical Highlights Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 mb-3.5">
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Capacity</span>
              <span className="font-bold text-slate-800 text-[11.5px] truncate block">
                {product.tonnage} ({product.specs?.coolingCapacity || "Heavy Duty"})
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Compressor</span>
              <span className="font-bold text-slate-800 text-[11.5px] truncate block" title={product.specs?.compressorType || "Tropical Rotary"}>
                {product.specs?.compressorType?.split(" ")[0] || "Tropical"} {product.specs?.compressorType?.includes("Dual") ? "Dual" : "Rotary"}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Efficiency</span>
              <span className="font-bold text-slate-800 text-[11.5px]">
                {product.specs?.iseer ? `ISEER ${product.specs.iseer}` : product.starRating ? `★ ${product.starRating}` : "Standard"}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Heat Exchanger</span>
              <span className="font-bold text-slate-800 text-[11.5px]">100% Cu BlueFin</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            href={detailUrl}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white shadow-xs transition-all active:scale-95 text-center"
          >
            Full Specs
            <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() =>
              openQuoteModal({
                model: product.model,
                product: product.name,
                category: product.categoryName,
                enquiryType: "Commercial / Project Quotation",
              })
            }
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors text-center cursor-pointer active:scale-95"
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
