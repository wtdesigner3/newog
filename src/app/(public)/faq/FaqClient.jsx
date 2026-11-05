"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Phone,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

export default function FaqClient({ faqs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => {
    // Open first 2 items by default
    return faqs.slice(0, 2).map((f) => f.id);
  });

  const baseId = useId();

  const toggleItem = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      {/* ─── Modern Minimalist Search Bar ──────────────────────────────── */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0f7ae0] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions, payment modes, cooling tonnage, error codes..."
          className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] font-sans"
          aria-label="Search frequently asked questions"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center transition"
            aria-label="Clear search query"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ─── Result Counter Bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-5 px-1 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0f7ae0]" />
          <span>
            {searchQuery ? (
              <>
                Showing <strong className="text-slate-900 font-bold">{filteredFaqs.length}</strong> questions matching &ldquo;<span className="text-[#0f7ae0] font-bold">{searchQuery}</span>&rdquo;
              </>
            ) : (
              <>
                Showing all <strong className="text-slate-900 font-bold">{faqs.length}</strong> verified questions
              </>
            )}
          </span>
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-bold text-[#0f7ae0] hover:underline"
          >
            Reset search
          </button>
        )}
      </div>

      {/* ─── Accordion List ───────────────────────────────────────────── */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8 shadow-2xs">
          <HelpCircle size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold font-heading text-slate-900 mb-1">
            No matching questions found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 font-sans">
            We couldn&apos;t find any FAQs matching your query. Please check your spelling or contact our engineering support team directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl min-h-[40px] transition active:scale-95"
            >
              Clear Search
            </button>
            <Link
              href="/contact-us"
              className="px-4 py-2 text-xs font-bold bg-[#0f7ae0] hover:bg-[#0c68c2] text-white rounded-xl min-h-[40px] flex items-center gap-1.5 transition shadow-xs active:scale-95"
            >
              <span>Contact Support Desk</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5" role="region" aria-label="FAQ Questions">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIds.includes(faq.id);
            const buttonId = `${baseId}-btn-${faq.id}`;
            const panelId = `${baseId}-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-200 overflow-hidden bg-white ${
                  isOpen
                    ? "border border-[#0f7ae0] shadow-[0_8px_30px_-6px_rgba(15,122,224,0.14)] ring-1 ring-[#0f7ae0]/30"
                    : "border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 min-h-[58px] flex items-center justify-between gap-4 transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7ae0] focus-visible:ring-offset-1"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center font-bold text-xs transition-colors ${
                          isOpen
                            ? "bg-[#0f7ae0] text-white shadow-xs"
                            : "bg-blue-50 text-[#0f7ae0] border border-blue-100 group-hover:bg-[#0f7ae0] group-hover:text-white"
                        }`}
                        aria-hidden="true"
                      >
                        Q{index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold font-heading text-slate-900 group-hover:text-[#0f7ae0] transition-colors leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {faq.isVerified && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2.5 py-0.5 rounded-full shadow-2xs">
                          <CheckCircle2 size={12} />
                          Store Verified
                        </span>
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-blue-50 text-[#0f7ae0] rotate-180"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200/80 group-hover:text-slate-700"
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={`px-5 sm:px-6 pb-6 pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  <div
                    className="prose prose-slate max-w-none text-xs sm:text-sm font-sans text-slate-600 leading-relaxed prose-strong:text-slate-900 prose-ul:my-2 prose-ul:space-y-1 prose-li:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml || faq.answer }}
                  />

                  {faq.relatedLink && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={faq.relatedLink.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0f7ae0] text-xs font-bold border border-blue-200/80 transition active:scale-95"
                      >
                        <span>{faq.relatedLink.label}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Bottom Support & Engineering Guidance Card ───────────────── */}
      <div className="mt-14 bg-gradient-to-br from-[#061129] via-[#091b42] to-[#040b1c] text-white rounded-3xl p-6 sm:p-10 border border-blue-500/25 shadow-xl relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0f7ae0_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2 backdrop-blur-md">
              <Sparkles size={12} />
              <span>Need Tailored HVAC Guidance?</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
              Have an Engineering or Bulk Inquiry?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-sans">
              Our New Delhi technical team assists clients with custom HVAC load estimation, ductable layout drawings, institutional tenders, and pan-India project fulfillment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-end shrink-0">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0f7ae0] hover:bg-[#0c68c2] text-white text-xs sm:text-sm font-bold rounded-xl min-h-[46px] shadow-sm transition active:scale-95"
            >
              <span>Contact Engineering Desk</span>
              <ArrowRight size={15} />
            </Link>

            <a
              href="tel:01135727834"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold rounded-xl min-h-[46px] border border-white/20 transition backdrop-blur-md active:scale-95"
            >
              <Phone size={15} className="text-[#00D2FF]" />
              <span>Direct Desk: 011-35727834</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
