"use client";

import { useState, useMemo } from "react";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function CategoryModelTable({
  models = [],
  categoryName = "",
  subcategoryName = "",
  initialFilter = "all",
}) {
  const { openQuoteModal } = useQuoteModal();
  const [activeTab, setActiveTab] = useState(initialFilter); // 'all' | 'fixed-speed' | 'variable-inverter'

  // Filter models
  const filteredModels = useMemo(() => {
    if (activeTab === "fixed-speed") {
      return models.filter((m) =>
        m.technology?.toUpperCase().includes("FIXED")
      );
    }
    if (activeTab === "variable-inverter" || activeTab === "variable-speed") {
      return models.filter(
        (m) =>
          m.technology?.toUpperCase().includes("VARIABLE") ||
          m.technology?.toUpperCase().includes("INVERTER")
      );
    }
    return models;
  }, [models, activeTab]);

  const hasInverter = useMemo(() => {
    return models.some(
      (m) =>
        m.technology?.toUpperCase().includes("VARIABLE") ||
        m.technology?.toUpperCase().includes("INVERTER")
    );
  }, [models]);

  const fixedCount = useMemo(() => {
    return models.filter((m) => m.technology?.toUpperCase().includes("FIXED")).length;
  }, [models]);

  const inverterCount = useMemo(() => {
    return models.filter(
      (m) =>
        m.technology?.toUpperCase().includes("VARIABLE") ||
        m.technology?.toUpperCase().includes("INVERTER")
    ).length;
  }, [models]);

  const hasStarRatings = useMemo(() => {
    return models.some((m) => Boolean(m.starRating));
  }, [models]);

  const handleQuoteClick = (item) => {
    openQuoteModal({
      model: item.model,
      category: subcategoryName || categoryName || "Air Conditioner",
      tonnage: item.tonnage,
      enquiryType: "Model Specification & Quotation",
    });
  };

  const renderCleanStarRating = (starText) => {
    if (!starText) {
      return <span className="text-slate-400 text-sm font-medium">—</span>;
    }

    const match = starText.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 0;

    return (
      <div className="flex items-center gap-1.5">
        <span className="text-amber-500 text-sm font-semibold tracking-wider">
          {"★".repeat(Math.min(count, 5))}
          {"☆".repeat(Math.max(0, 5 - count))}
        </span>
        <span className="text-xs font-semibold text-slate-700">
          {count} Star
        </span>
      </div>
    );
  };

  const normalizeTonnage = (tonnage) => {
    if (!tonnage) return "—";
    const t = String(tonnage).trim();
    // If it's already "1.5 Ton" or "1.5 ton" or "2 Ton"
    if (/ton/i.test(t)) {
      return t.replace(/ton/i, "Ton");
    }
    return `${t} Ton`;
  };

  return (
    <div className="w-full space-y-4">
      {/* ── Section Title & Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Available Models &amp; Specifications
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Certified technical specifications for {subcategoryName || categoryName}.
          </p>
        </div>

        {/* Professional Segmented Control */}
        {hasInverter && (
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Models ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fixed-speed")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "fixed-speed"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fixed Speed ({fixedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("variable-inverter")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "variable-inverter" || activeTab === "variable-speed"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inverter ({inverterCount})
            </button>
          </div>
        )}
      </div>

      {/* ── Corporate Desktop Specification Table (≥ md) ── */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider">
                Model No.
              </th>
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider">
                Capacity
              </th>
              {hasStarRatings && (
                <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider">
                  Star Rating
                </th>
              )}
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider">
                Technology
              </th>
              <th className="py-3.5 px-6 text-right text-xs font-bold uppercase tracking-wider">
                Quotation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredModels.map((item, idx) => {
              const isInverter =
                item.technology?.toUpperCase().includes("VARIABLE") ||
                item.technology?.toUpperCase().includes("INVERTER");

              return (
                <tr
                  key={item.model || idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Model Number */}
                  <td className="py-4 px-6">
                    <span className="font-semibold text-sm text-slate-900 tracking-tight">
                      {item.model}
                    </span>
                  </td>

                  {/* Nominal Tonnage */}
                  <td className="py-4 px-6 text-sm font-medium text-slate-800">
                    {normalizeTonnage(item.tonnage)}
                  </td>

                  {/* Star Rating */}
                  {hasStarRatings && (
                    <td className="py-4 px-6">
                      {renderCleanStarRating(item.starRating)}
                    </td>
                  )}

                  {/* Technology */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isInverter ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {item.technology}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleQuoteClick(item)}
                      className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-[#0f7ae0] hover:bg-[#0c66be] transition-colors shadow-2xs active:scale-95 cursor-pointer"
                    >
                      Get Quote
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Technical Engineering Standard Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f7ae0]" />
              <span><strong>Coils:</strong> 100% Inner-Grooved Pure Copper</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f7ae0]" />
              <span><strong>Ambient Limit:</strong> Continuous Cooling up to 52°C</span>
            </span>
          </div>
          <span className="text-slate-400 font-medium">BEE / Commercial Heavy-Duty Standard</span>
        </div>
      </div>

      {/* ── Corporate Mobile Cards (< md) ── */}
      <div className="md:hidden space-y-3">
        {filteredModels.map((item, idx) => {
          const isInverter =
            item.technology?.toUpperCase().includes("VARIABLE") ||
            item.technology?.toUpperCase().includes("INVERTER");

          return (
            <div
              key={item.model || idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Model
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.model}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Capacity
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {normalizeTonnage(item.tonnage)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isInverter ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  <span className="font-medium text-slate-700">
                    {item.technology}
                  </span>
                </div>

                {item.starRating && renderCleanStarRating(item.starRating)}
              </div>

              <button
                type="button"
                onClick={() => handleQuoteClick(item)}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#0f7ae0] hover:bg-[#0c66be] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Get Quote
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
