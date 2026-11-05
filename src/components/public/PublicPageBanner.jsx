import Image from "next/image";
import PageContainer from "./PageContainer";
import Breadcrumbs from "./Breadcrumbs";

/**
 * PublicPageBanner — Shared inner-page hero banner with authentic background imagery and breadcrumbs.
 *
 * @param {string} title - Primary page title (rendered as <h1>)
 * @param {string} subtitle - Optional explanatory subtitle
 * @param {string} badge - Optional uppercase category badge (e.g., "ABOUT OUR COMPANY")
 * @param {string} bgImage - Background image path (e.g., "/uploads/breadcrumb/1648811523_download.jpg")
 * @param {Array<{ label: string, href?: string }>} breadcrumbItems - Array of breadcrumb objects
 */
export default function PublicPageBanner({
  title,
  subtitle,
  badge,
  bgImage = "/uploads/breadcrumb/1648811523_download.jpg",
  breadcrumbItems = [],
  breadcrumbs = [],
}) {
  const items = breadcrumbItems && breadcrumbItems.length > 0 ? breadcrumbItems : (breadcrumbs || []);

  return (
    <div className="relative overflow-hidden bg-[#061129] text-white border-b border-slate-800/80">
      {/* Background Image with Crisp Cinematic Brand Overlay */}
      {bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bgImage}
            alt=""
            fill
            sizes="100vw"
            priority
            unoptimized={true}
            className="object-cover object-center opacity-75 sm:opacity-85 transition-transform duration-1000 scale-102"
          />
          {/* Dual Multi-Stop Gradient Scrim: Clear background image visibility + 100% text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061129]/95 via-[#061129]/75 to-[#061129]/45 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061129] via-transparent to-[#061129]/60 pointer-events-none" />
        </div>
      )}

      {/* Subtle industrial blueprint grid and ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#0f7ae0_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none z-0" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#0f7ae0]/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Standardized PageContainer: Perfectly aligns with section containers across all pages */}
      <PageContainer size="default" className="relative z-10 pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12 lg:pb-14">
        {/* Breadcrumb Row */}
        {items.length > 0 && (
          <div className="mb-4">
            <Breadcrumbs items={items} theme="dark" />
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/35 text-[11px] font-bold tracking-wider uppercase text-blue-300 mb-3 backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f7ae0] animate-pulse" />
            <span>{badge}</span>
          </div>
        )}

        {/* Page Title with drop shadow for guaranteed readability over visible imagery */}
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold font-heading text-white tracking-tight leading-tight max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-3 text-xs sm:text-sm lg:text-[15px] text-slate-300 max-w-2xl leading-relaxed font-sans drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            {subtitle}
          </p>
        )}
      </PageContainer>
    </div>
  );
}

