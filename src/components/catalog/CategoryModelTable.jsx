"use client";

import { useState, useMemo } from "react";
import { Star, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
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
    return models.filter((m) => m.technology?.toUpperCase().includes("FIXED"))
      .length;
  }, [models]);

  const inverterCount = useMemo(() => {
    return models.filter(
      (m) =>
        m.technology?.toUpperCase().includes("VARIABLE") ||
        m.technology?.toUpperCase().includes("INVERTER")
    ).length;
  }, [models]);

  const handleQuoteClick = (item) => {
    openQuoteModal({
      model: item.model,
      category: subcategoryName || categoryName || "Air Conditioner",
      tonnage: item.tonnage,
      enquiryType: "Model Inquiry & Quotation",
    });
  };

  const renderStars = (starText) => {
    if (!starText) return <span className="text-slate-400 text-xs">Commercial Grade</span>;
    const match = starText.match(/(\d+)/);
    const count = match ? parseInt(match[1], 10) : 0;
    return (
      <div className="flex items-center gap-1">
        <div className="flex text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= count
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 fill-slate-100"
              }
            />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-700 ml-1">{starText}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* ── Table Top Bar & Technology Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Available Models &amp; Specifications
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Official heavy-duty specifications for {subcategoryName || categoryName}.
          </p>
        </div>

        {/* Tab Filters */}
        {hasInverter && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-[#0f7ae0] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fixed-speed")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "fixed-speed"
                  ? "bg-white text-[#0f7ae0] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fixed Speed ({fixedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("variable-inverter")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "variable-inverter" || activeTab === "variable-speed"
                  ? "bg-white text-[#0f7ae0] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Variable / Inverter ({inverterCount})
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block overflow-hidden rounded-2xl border-2 border-slate-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#080E21] text-white border-b border-slate-800">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                Model No
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                Tonnage
              </th>
              {models.some((m) => m.starRating) && (
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                  Star Rating
                </th>
              )}
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                Technology
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right">
                Inquiry / Quote
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredModels.map((item, idx) => {
              const isInverter =
                item.technology?.toUpperCase().includes("VARIABLE") ||
                item.technology?.toUpperCase().includes("INVERTER");

              return (
                <tr
                  key={item.model || idx}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  {/* Model Number */}
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-black text-[#0f7ae0] tracking-wide bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200/60 inline-block">
                      {item.model}
                    </span>
                  </td>

                  {/* Tonnage */}
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-900">
                      {item.tonnage}
                    </span>
                  </td>

                  {/* Star Rating (if any models in subcat have star rating) */}
                  {models.some((m) => m.starRating) && (
                    <td className="py-4 px-6">
                      {renderStars(item.starRating)}
                    </td>
                  )}

                  {/* Technology */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isInverter
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isInverter ? (
                        <Zap size={12} className="text-emerald-600" />
                      ) : (
                        <CheckCircle2 size={12} className="text-slate-500" />
                      )}
                      {item.technology}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleQuoteClick(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Get Quote</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card View (< md) ── */}
      <div className="md:hidden space-y-3">
        {filteredModels.map((item, idx) => {
          const isInverter =
            item.technology?.toUpperCase().includes("VARIABLE") ||
            item.technology?.toUpperCase().includes("INVERTER");

          return (
            <div
              key={item.model || idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-black text-[#0f7ae0] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {item.model}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {item.tonnage}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isInverter
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {item.technology}
                </span>

                {item.starRating && renderStars(item.starRating)}
              </div>

              <button
                type="button"
                onClick={() => handleQuoteClick(item)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Request Quotation</span>
                <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
