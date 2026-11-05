"use client";

import React, { useState } from "react";
import Image from "next/image";

/**
 * ProductGallery — Interactive image viewer for product detail pages.
 * Supports thumbnail selection, zoom toggle, and fallback rendering.
 * Standardized with elevated border-2 styling and brand visual tokens.
 */
export default function ProductGallery({ product }) {
  const images = product?.images?.length
    ? product.images
    : [product?.image || "/uploads/products/1648809194_project_1.jpg"];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative aspect-4/3 w-full bg-slate-50 rounded-2xl border-2 border-slate-200/90 overflow-hidden p-8 flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)]">
        <Image
          src={images[activeIndex]}
          alt={`${product.name} - View ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 drop-shadow-md transition-all duration-300"
        />

        {/* High-Ambient Badge Overlay */}
        {product.specs?.maxAmbient && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0f7ae0] text-white shadow-md">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Tested for {product.specs.maxAmbient}
            </span>
          </div>
        )}

        {/* Heavy Duty Engineering Seal */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
            100% Copper Tested
          </span>
        </div>
      </div>

      {/* Thumbnails (if multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-50 shrink-0 transition-all ${
                activeIndex === idx
                  ? "border-[#0f7ae0] ring-2 ring-blue-100 shadow-xs"
                  : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
