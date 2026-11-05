"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ThermometerSnowflake,
  Sparkles,
} from "lucide-react";
import {
  PageContainer,
  PrimaryButton,
  SecondaryButton,
} from "src/components/public";

// Helper to extract clean plain-text excerpt from rich text or long paragraphs
function getCleanExcerpt(text, maxChars = 290) {
  if (!text) return "";
  // Strip HTML tags if any
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxChars) return plain;
  // Truncate cleanly at word boundary
  const truncated = plain.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export default function CompanyIntro({
  imageSrc = "/images/home1/about-img.jpg",
  data,
}) {
  const badge = data?.badge || "PIONEERING HIGH-AMBIENT HVAC";
  const title = data?.title || "Engineered to Cool Where Ordinary Air Conditioners Fail";
  
  // Display Logic: If short_description is provided, use it. Otherwise, extract a clean limited excerpt from description.
  let descriptionText = "";
  if (data?.short_description && data.short_description.trim()) {
    // If it contains html tags, render cleanly or strip if desired
    descriptionText = data.short_description.trim();
  } else if (data?.description && data.description.trim()) {
    descriptionText = getCleanExcerpt(data.description, 300);
  } else {
    descriptionText = "The world contains an infinite number of spaces. O.G. HEAVY DUTY believes that the air in each of them should be ideally suited to the environment they support. Thus, we make it possible to manage the air—to control its temperature, humidity, and flow with over 30 years of engineering expertise.";
  }

  const displayImage = data?.image || imageSrc;
  const altText = data?.alt || "OG Heavy Duty Manufacturing & Precision Engineering";
  const experienceYears = data?.experience_years || "30+ Years";
  const experienceText = data?.experience_text || "Severe Tropical Heatwave Resilience (52°C Tested)";
  const buttonText = data?.button_text || "Explore Full Heritage Story";
  const buttonHref = (data?.button_url || "/about-us").includes("#")
    ? (data?.button_url || "/about-us")
    : `${data?.button_url || "/about-us"}#about-description`;

  return (
    <section
      id="about"
      className="relative overflow-hidden py-[60px] bg-white border-b border-slate-200/80"
    >
      {/* Ambient Cool Airflow Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-sky-400/8 rounded-full blur-3xl pointer-events-none" />

      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Creative, Modern & Clean Editorial Machine Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Creative Architectural Accent: Subtle offset background frame */}
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-blue-100/70 via-slate-100/50 to-sky-50/40 rounded-3xl -rotate-1 sm:-rotate-1.5 border border-blue-200/50 -z-10" />

              {/* Main Clean Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-xl group">
                <Image
                  src={displayImage}
                  alt={altText}
                  fill
                  unoptimized={true}
                  priority={true}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />

                {/* Subtle, soft light gradient at bottom to give depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent pointer-events-none" />

                {/* Single Minimal Pill in Top Corner: Clean & Modern */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-md border border-slate-200/80 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#0f7ae0]" />
                    <span>Heavy-Duty Engineering</span>
                  </span>
                </div>
              </div>

              {/* Single Creative Floating Glass Card: 30+ Years Heritage & 52°C Ambient */}
              <div className="absolute -bottom-5 sm:-bottom-7 -right-2 sm:-right-5 z-20 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-xl p-3.5 sm:p-4.5 flex items-center gap-3.5 sm:gap-4 max-w-xs transition-transform duration-300 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#0f7ae0] flex items-center justify-center shrink-0">
                  <ThermometerSnowflake size={24} className="stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg sm:text-xl font-black font-heading text-slate-900 leading-none">{experienceYears}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f7ae0] bg-blue-50 px-2 py-0.5 rounded">Proven</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-tight">
                    {experienceText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Value Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0f7ae0] border border-blue-200/80 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={13} />
                <span>{badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight leading-[1.15]">
                {title}
              </h2>
            </div>

            {/* Description Paragraph */}
            {descriptionText.includes('<') && descriptionText.includes('>') ? (
              <div 
                className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: descriptionText }}
              />
            ) : (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                {descriptionText}
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <PrimaryButton href={buttonHref} variant="primary" size="lg" icon={true}>
                {buttonText}
              </PrimaryButton>
              <SecondaryButton href="/products/split-ac" variant="outline" size="lg" icon={true}>
                Explore AC Range
              </SecondaryButton>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
