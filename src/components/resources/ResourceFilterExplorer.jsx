"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, RotateCcw, Filter, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import ResourceCard from "./ResourceCard";

const EQUIPMENT_FILTERS = [
  { slug: "all", name: "All Equipment" },
  { slug: "window-ac", name: "Window ACs" },
  { slug: "split-ac", name: "Split ACs" },
  { slug: "commercial-range", name: "Commercial & Industrial" },
];

export default function ResourceFilterExplorer({
  resources = [],
  categories = [],
}) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeEquipment, setActiveEquipment] = useState("all");

  // Read URL query params on client mount (e.g. via legacy redirect)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) setActiveCategory(cat);
      const q = params.get("q");
      if (q) setSearchQuery(q);
      const prod = params.get("product");
      if (prod) setSearchQuery(prod);
    }
  }, []);

  // Handle category filter click
  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveEquipment("all");
    router.push("/resources", { scroll: false });
  };

  // Filter and search computation
  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return resources.filter((res) => {
      // 1. Category Filter
      if (activeCategory !== "all" && res.category !== activeCategory) {
        return false;
      }

      // 2. Equipment Filter
      if (activeEquipment !== "all") {
        if (
          res.applicableCategorySlug !== "all" &&
          res.applicableCategorySlug !== activeEquipment
        ) {
          return false;
        }
      }

      // 3. Search Query (Title, Description, Applicable Products, Applicable Models)
      if (q) {
        const titleMatch = res.title?.toLowerCase().includes(q);
        const descMatch = res.description?.toLowerCase().includes(q);
        const equipMatch = res.applicableProducts?.toLowerCase().includes(q);
        const modelMatch =
          Array.isArray(res.applicableModels) &&
          res.applicableModels.some((m) => m.toLowerCase().includes(q));
        const catMatch = res.categoryName?.toLowerCase().includes(q);

        if (!titleMatch && !descMatch && !equipMatch && !modelMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [resources, searchQuery, activeCategory, activeEquipment]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeCategory !== "all" ||
    activeEquipment !== "all";

  return (
    <div className="space-y-8">
      {/* ─── Search & Controls Bar ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <label htmlFor="resource-search" className="sr-only">
              Search technical resources, manuals, and error codes
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} aria-hidden="true" />
            </div>
            <input
              id="resource-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, model (e.g. OG-19WA5), manual type, or keyword..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search input"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0] rounded-r-xl"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Reset Filters Action (Visible when any filter/search is active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0]"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* ─── Category Filter Pills ─────────────────────────────────── */}
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filter by Document Category
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Showing {filteredResources.length} of {resources.length} Documents
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
                activeCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>All Categories</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeCategory === "all"
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {resources.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
                    isActive
                      ? "bg-[#0f7ae0] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? "bg-sky-800 text-sky-100"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Equipment Type Filter ──────────────────────────────────── */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1.5">
            <Filter size={13} aria-hidden="true" />
            <span>Equipment Scope:</span>
          </span>

          {EQUIPMENT_FILTERS.map((eq) => {
            const isEqActive = activeEquipment === eq.slug;
            return (
              <button
                key={eq.slug}
                type="button"
                onClick={() => setActiveEquipment(eq.slug)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0] ${
                  isEqActive
                    ? "bg-sky-100 text-sky-900 border border-sky-300 font-bold"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {eq.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Resource Cards Grid ────────────────────────────────────── */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
            <AlertCircle size={28} aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Documents Found</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We could not find any technical documentation matching your current search criteria:
            {searchQuery && <span className="font-semibold text-slate-900"> &ldquo;{searchQuery}&rdquo;</span>}.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f7ae0] text-white text-xs font-bold transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f7ae0]"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
