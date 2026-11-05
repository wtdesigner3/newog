import React from "react";
import Link from "next/link";
import { Download, ExternalLink, FileText, CheckCircle2, ShieldCheck, AlertTriangle, BookOpen, Layers } from "lucide-react";

/**
 * ResourceCard — Industrial card presenting a verified technical document.
 * Meets WCAG 2.1 AA accessibility standards with >=44px touch targets.
 */
export default function ResourceCard({ resource }) {
  if (!resource) return null;

  // Category Icon & Accent Mapping
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case "catalogues":
        return {
          icon: BookOpen,
          badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
          iconColor: "text-sky-600",
        };
      case "manuals":
        return {
          icon: FileText,
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          iconColor: "text-blue-600",
        };
      case "error-codes":
        return {
          icon: AlertTriangle,
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          iconColor: "text-blue-600",
        };
      case "warranty":
        return {
          icon: ShieldCheck,
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconColor: "text-emerald-600",
        };
      default:
        return {
          icon: Layers,
          badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
          iconColor: "text-slate-600",
        };
    }
  };

  const meta = getCategoryMeta(resource.category);
  const CategoryIcon = meta.icon;

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      <div>
        {/* Top Header: Category Badge & Verification Pill */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor}`}
          >
            <CategoryIcon size={13} className={meta.iconColor} aria-hidden="true" />
            <span>{resource.categoryName}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            <CheckCircle2 size={12} className="text-emerald-600" aria-hidden="true" />
            <span>Verified Asset</span>
          </span>
        </div>

        {/* Document Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0f7ae0] transition-colors leading-snug mb-2.5">
          {resource.title}
        </h3>

        {/* Factual Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {resource.description}
        </p>

        {/* Applicable Models / Equipment */}
        {resource.applicableProducts && (
          <div className="mb-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 shrink-0">Equipment:</span>
            <span className="line-clamp-2">{resource.applicableProducts}</span>
          </div>
        )}

        {/* Metadata Grid Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium">
            {resource.fileType}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium">
            {resource.fileSize}
          </span>
          {resource.pageCount && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
              {resource.pageCount} {resource.pageCount === 1 ? "Page" : "Pages"}
            </span>
          )}
          {resource.edition && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs border border-slate-200/70">
              {resource.edition}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Download & Open in Browser (>=44px touch targets) */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={resource.filePath}
          download
          aria-label={`Download ${resource.title} (${resource.fileSize} PDF)`}
          className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f7ae0] text-white text-xs font-bold transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f7ae0]"
        >
          <Download size={15} aria-hidden="true" />
          <span>Download PDF</span>
        </a>

        <a
          href={resource.filePath}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${resource.title} in a new browser tab`}
          className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f7ae0]"
        >
          <ExternalLink size={14} aria-hidden="true" />
          <span>View Document</span>
        </a>
      </div>
    </div>
  );
}

