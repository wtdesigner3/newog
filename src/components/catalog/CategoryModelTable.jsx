"use client";

import { useState, useMemo } from "react";
import { Star, ShieldCheck, ArrowRight, Zap, CheckCircle2, SlidersHorizontal } from "lucide-react";
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

  const renderTechnicalStarRating = (starText) => {
    if (!starText) {
      return (
        <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
          Commercial Duty
        </span>
      );
    }

    const match = starText.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 0;

    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber-300/80 bg-amber-50/70 text-amber-950">
        <span className="font-mono text-xs font-bold tracking-tight text-amber-700">
          {"★".repeat(Math.min(count, 5))}
        </span>
        <span className="font-mono text-[11px] font-bold text-amber-900 tracking-tight">
          {count} Star BEE
        </span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* ── Technical Header & Engineering Filter Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0f7ae0]" />
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight uppercase">
              Technical Specifications &amp; Model Matrix
            </h2>
          </div>
          <p className="text-slate-500 font-mono text-xs mt-1">
            Certified technical parameters for {subcategoryName || categoryName} &bull; Showing {filteredModels.length} of {models.length} models
          </p>
        </div>

        {/* Industrial Segmented Toggle Filter */}
        {hasInverter && (
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300/80 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#0B132B] text-white shadow-xs font-bold"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              ALL ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fixed-speed")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === "fixed-speed"
                  ? "bg-[#0B132B] text-white shadow-xs font-bold"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              FIXED SPEED ({fixedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("variable-inverter")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === "variable-inverter" || activeTab === "variable-speed"
                  ? "bg-[#0B132B] text-white shadow-xs font-bold"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              INVERTER ({inverterCount})
            </button>
          </div>
        )}
      </div>

      {/* ── High-Precision Technical Desktop Table (≥ md) ── */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B132B] text-slate-200 border-b border-slate-800">
              <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Model Number
              </th>
              <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Nominal Capacity
              </th>
              {hasStarRatings && (
                <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Energy Rating
                </th>
              )}
              <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Technology / Compressor
              </th>
              <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Condenser Coil
              </th>
              <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Ambient Duty
              </th>
              <th className="py-3 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-right text-slate-300">
                Technical Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
            {filteredModels.map((item, idx) => {
              const isInverter =
                item.technology?.toUpperCase().includes("VARIABLE") ||
                item.technology?.toUpperCase().includes("INVERTER");

              return (
                <tr
                  key={item.model || idx}
                  className="even:bg-slate-50/70 hover:bg-blue-50/40 transition-colors"
                >
                  {/* Model Number */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-[13px] font-bold text-slate-900 tracking-tight">
                      {item.model}
                    </span>
                  </td>

                  {/* Nominal Tonnage */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {item.tonnage}
                    </span>
                  </td>

                  {/* Energy Star Rating */}
                  {hasStarRatings && (
                    <td className="py-3 px-4">
                      {renderTechnicalStarRating(item.starRating)}
                    </td>
                  )}

                  {/* Technology / Compressor */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-tight ${
                        isInverter
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300/80"
                          : "bg-slate-100 text-slate-800 border border-slate-300/80"
                      }`}
                    >
                      {isInverter ? (
                        <Zap size={11} className="text-emerald-600 shrink-0" />
                      ) : (
                        <CheckCircle2 size={11} className="text-slate-500 shrink-0" />
                      )}
                      <span>{item.technology}</span>
                    </span>
                  </td>

                  {/* Condenser Coil */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <ShieldCheck size={12} className="text-[#0f7ae0] shrink-0" />
                      <span>100% Grooved Cu</span>
                    </span>
                  </td>

                  {/* Ambient Duty */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                    <span className="text-slate-700 font-semibold">Up to 52°C</span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleQuoteClick(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f7ae0] hover:bg-[#0b63b8] text-white font-mono text-[11px] font-bold tracking-wider uppercase transition-colors shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <span>Get Quote</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Technical Mobile Spec Cards (< md) ── */}
      <div className="md:hidden space-y-2.5">
        {filteredModels.map((item, idx) => {
          const isInverter =
            item.technology?.toUpperCase().includes("VARIABLE") ||
            item.technology?.toUpperCase().includes("INVERTER");

          return (
            <div
              key={item.model || idx}
              className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs space-y-2.5"
            >
              {/* Header: Model & Tonnage */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    MODEL NO.
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {item.model}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    CAPACITY
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0f7ae0]">
                    {item.tonnage}
                  </span>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs py-1">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    TECHNOLOGY
                  </span>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isInverter
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300/80"
                        : "bg-slate-100 text-slate-800 border border-slate-300/80"
                    }`}
                  >
                    {item.technology}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    ENERGY RATING
                  </span>
                  <div className="mt-0.5">
                    {renderTechnicalStarRating(item.starRating)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    CONDENSER
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-slate-700">
                    100% Grooved Copper
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    AMBIENT PEAK
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-slate-700">
                    52°C Tropical Ceiling
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleQuoteClick(item)}
                className="w-full mt-1 py-2 px-3 rounded bg-[#0f7ae0] hover:bg-[#0b63b8] text-white font-mono text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Request Quotation / Spec Sheet</span>
                <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
