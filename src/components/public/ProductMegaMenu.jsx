"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wind,
  ThermometerSnowflake,
  Grid,
  Cpu,
  Layers,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Download,
  Phone,
  Sparkles,
  CheckCircle2,
  Award,
  Zap,
  Flame,
  FileText,
} from "lucide-react";

/**
 * Verified Multi-Tier HVAC Product Mega Menu Data
 * Aligned with OG Heavy Duty Product Catalogue 2024-2026.
 */
export const MEGA_MENU_CATEGORIES = [
  {
    slug: "split-ac",
    name: "Split Air Conditioners",
    shortName: "Split AC",
    icon: ThermometerSnowflake,
    badge: "Dual Rotary Inverter",
    tonnageRange: "1.0 to 2.0 Ton",
    tagline: "52°C High-Ambient Cooling with Hydrophilic Blue Fin Barrier",
    defaultImage: "/uploads/category/1649065306_air-conditioner-1.gif",
    isGif: true,
    specs: ["100% Inner-Grooved Copper", "145V–285V Stabilizer Free", "Turbo Cool 48dB"],
    subcategories: [
      {
        slug: "inverter-split-ac",
        name: "5-Star Dual Inverter Series",
        tagline: "Twin rotary variable-speed compressor engineered for 52°C summer heatwaves",
        image: "/uploads/products/1648809194_project_1.jpg",
        products: [
          {
            name: "OG-12INV (1.0 Ton Dual Inverter)",
            slug: "og-12inv",
            tonnage: "1.0 Ton",
            tag: "5-Star Inverter",
            image: "/uploads/products/1648809194_project_1.jpg",
            desc: "Whisper-quiet bedroom pull-down • 3.5 kW",
            link: "/products/split-ac",
          },
          {
            name: "OG-18INV (1.5 Ton Dual Inverter)",
            slug: "og-18inv",
            tonnage: "1.5 Ton",
            tag: "Flagship Cooling",
            image: "/uploads/category/1649065306_air-conditioner-1.gif",
            desc: "India's highest pull-down • 5.3 kW @ 52°C",
            link: "/products/split-ac",
          },
          {
            name: "OG-24INV (2.0 Ton Dual Inverter)",
            slug: "og-24inv",
            tonnage: "2.0 Ton",
            tag: "Heavy-Duty",
            image: "/uploads/products/1648809194_project_1.jpg",
            desc: "Commercial suites & halls • 6.8 kW",
            link: "/products/split-ac",
          },
        ],
      },
      {
        slug: "fixed-speed-split-ac",
        name: "Heavy Duty Fixed Speed Series",
        tagline: "Continuous commercial duty with high-torque tropicalized rotary compressor",
        image: "/uploads/products/1648808992_project_2.jpg",
        products: [
          {
            name: "OG-18FIX (1.5 Ton Fixed Speed)",
            slug: "og-18fix",
            tonnage: "1.5 Ton",
            tag: "Tropical Duty",
            image: "/uploads/products/1648808992_project_2.jpg",
            desc: "Heavy-gauge galvanized outdoor chassis",
            link: "/products/split-ac",
          },
          {
            name: "OG-24FIX (2.0 Ton Fixed Speed)",
            slug: "og-24fix",
            tonnage: "2.0 Ton",
            tag: "Severe Ambient",
            image: "/uploads/products/1648808992_project_2.jpg",
            desc: "Continuous non-stop commercial performance",
            link: "/products/split-ac",
          },
        ],
      },
      {
        slug: "hot-and-cold-ac",
        name: "All-Season Hot & Cold Series",
        tagline: "Reverse cycle thermodynamic heating & cooling for year-round temperature control",
        image: "/uploads/products/1648809082_project_3.jpg",
        products: [
          {
            name: "OG-18HC (1.5 Ton Hot & Cold)",
            slug: "og-18hc",
            tonnage: "1.5 Ton",
            tag: "Reverse Cycle",
            image: "/uploads/products/1648809082_project_3.jpg",
            desc: "Heating & cooling (-5°C to +50°C)",
            link: "/products/split-ac",
          },
          {
            name: "OG-24HC (2.0 Ton Hot & Cold)",
            slug: "og-24hc",
            tonnage: "2.0 Ton",
            tag: "Dual Season",
            image: "/uploads/products/1648809082_project_3.jpg",
            desc: "Auto-defrost logic • High CFM heating",
            link: "/products/split-ac",
          },
        ],
      },
    ],
  },
  {
    slug: "window-ac",
    name: "Window Air Conditioners",
    shortName: "Window AC",
    icon: Wind,
    badge: "Flagship High-Ambient",
    tonnageRange: "1.0 to 1.5 Ton",
    tagline: "Engineered for High-Ambient Indian Summers up to 50°C with Zero Tripping",
    defaultImage: "/uploads/category/1649065324_window-ac.gif",
    isGif: true,
    specs: ["100% Cu-DHP Rifled Copper", "Auto-Swing Louvers", "Severe Heat Resilience"],
    subcategories: [
      {
        slug: "inverter-window-ac",
        name: "Inverter Window AC Series",
        tagline: "Variable-speed twin-rotary inverter in a compact heavy-duty window form factor",
        image: "/uploads/category/1649065324_window-ac.gif",
        products: [
          {
            name: "OG-WIN-15INV (1.5 Ton Inverter)",
            slug: "og-win-15inv",
            tonnage: "1.5 Ton",
            tag: "5-Star Inverter",
            image: "/uploads/category/1649065324_window-ac.gif",
            desc: "Twin rotary compressor • Eco power saving",
            link: "/products/window-ac",
          },
        ],
      },
      {
        slug: "fixed-speed-window-ac",
        name: "Fixed Speed Heavy Duty Series",
        tagline: "Proven high-ambient workhorse cooling without electronic sensitivity",
        image: "/uploads/category/1649065324_window-ac.gif",
        products: [
          {
            name: "OG-WIN-10FIX (1.0 Ton Fixed Speed)",
            slug: "og-win-10fix",
            tonnage: "1.0 Ton",
            tag: "Compact Workhorse",
            image: "/uploads/category/1649065324_window-ac.gif",
            desc: "Fits standard residential window apertures",
            link: "/products/window-ac",
          },
          {
            name: "OG-WIN-15FIX (1.5 Ton Fixed Speed)",
            slug: "og-win-15fix",
            tonnage: "1.5 Ton",
            tag: "Heavy-Duty",
            image: "/uploads/category/1649065324_window-ac.gif",
            desc: "Zero tripping at peak afternoon temperatures",
            link: "/products/window-ac",
          },
        ],
      },
    ],
  },
  {
    slug: "cassette-ac",
    name: "Cassette Air Conditioners",
    shortName: "Cassette AC",
    icon: Grid,
    badge: "360° Uniform Airflow",
    tonnageRange: "1.5 to 3.0 Ton",
    tagline: "Ceiling-Recessed Commercial Cooling with Integrated Condensate Lift Pump",
    defaultImage: "/uploads/products/1648809114_project_4.jpg",
    isGif: false,
    specs: ["Built-in High-Lift Drain Pump", "Low-Profile Ceiling Bezel", "Whisper-Quiet Blower"],
    subcategories: [
      {
        slug: "4-way-cassette",
        name: "4-Way Airflow Commercial Series",
        tagline: "Uniform 360-degree draft-free air distribution across corporate offices and retail",
        image: "/uploads/products/1648809114_project_4.jpg",
        products: [
          {
            name: "OG-CAS-20 (2.0 Ton 4-Way)",
            slug: "og-cas-20",
            tonnage: "2.0 Ton",
            tag: "4-Way Airflow",
            image: "/uploads/products/1648809114_project_4.jpg",
            desc: "Integrated condensate pump • 360° throw",
            link: "/products/cassette-ac",
          },
          {
            name: "OG-CAS-30 (3.0 Ton 4-Way)",
            slug: "og-cas-30",
            tonnage: "3.0 Ton",
            tag: "Commercial Grade",
            image: "/uploads/products/1648809114_project_4.jpg",
            desc: "Designed for open retail showrooms & halls",
            link: "/products/cassette-ac",
          },
        ],
      },
      {
        slug: "1-way-cassette",
        name: "1-Way Slim Line Series",
        tagline: "Architectural slim bulkhead cassette for boutique hotel suites and corridors",
        image: "/uploads/products/1648809114_project_4.jpg",
        products: [
          {
            name: "OG-CAS-15-1W (1.5 Ton 1-Way)",
            slug: "og-cas-15-1w",
            tonnage: "1.5 Ton",
            tag: "Slim Bulkhead",
            image: "/uploads/products/1648809114_project_4.jpg",
            desc: "Ultra-compact profile for narrow ceiling recesses",
            link: "/products/cassette-ac",
          },
        ],
      },
    ],
  },
  {
    slug: "floor-standing-ac",
    name: "Floor Standing / Tower AC",
    shortName: "Tower AC",
    icon: Cpu,
    badge: "High Airflow Column",
    tonnageRange: "2.0 to 5.0 Ton",
    tagline: "High-Throw Centrifugal Blowers for Banquets, Lobbies & Auditoriums",
    defaultImage: "/uploads/products/1648809082_project_3.jpg",
    isGif: false,
    specs: ["Rapid Temperature Pull-Down", "1-Phase & 3-Phase Models", "LED Touch Console"],
    subcategories: [
      {
        slug: "single-phase-tower",
        name: "Single Phase Commercial Series",
        tagline: "Standard 230V power connection for restaurant receptions and commercial entrances",
        image: "/uploads/products/1648809082_project_3.jpg",
        products: [
          {
            name: "OG-TWR-20 (2.0 Ton 1-Phase)",
            slug: "og-twr-20",
            tonnage: "2.0 Ton",
            tag: "1-Phase 230V",
            image: "/uploads/products/1648809082_project_3.jpg",
            desc: "High vertical air throw • Digital controls",
            link: "/products/floor-standing-ac",
          },
          {
            name: "OG-TWR-30 (3.0 Ton 1-Phase)",
            slug: "og-twr-30",
            tonnage: "3.0 Ton",
            tag: "High Velocity",
            image: "/uploads/products/1648809082_project_3.jpg",
            desc: "Heavy-duty centrifugal multi-stage blower",
            link: "/products/floor-standing-ac",
          },
        ],
      },
      {
        slug: "three-phase-tower",
        name: "Three Phase Industrial Series",
        tagline: "High-tonnage 415V industrial tower units for high-occupancy event auditoriums",
        image: "/uploads/products/1648809082_project_3.jpg",
        products: [
          {
            name: "OG-TWR-40-3P (4.0 Ton 3-Phase)",
            slug: "og-twr-40-3p",
            tonnage: "4.0 Ton",
            tag: "3-Phase 415V",
            image: "/uploads/products/1648809082_project_3.jpg",
            desc: "Engineered for large marriage palaces & halls",
            link: "/products/floor-standing-ac",
          },
          {
            name: "OG-TWR-50-3P (5.0 Ton 3-Phase)",
            slug: "og-twr-50-3p",
            tonnage: "5.0 Ton",
            tag: "Industrial Throw",
            image: "/uploads/products/1648809082_project_3.jpg",
            desc: "Phase reversal protection • Max CFM air throw",
            link: "/products/floor-standing-ac",
          },
        ],
      },
    ],
  },
  {
    slug: "ductable-ac",
    name: "Ductable Air Conditioners",
    shortName: "Ductable AC",
    icon: Layers,
    badge: "Central Ducted Split",
    tonnageRange: "1.5 to 5.5 Ton",
    tagline: "High External Static Pressure (ESP) for Hospitals, Universities & Plants",
    defaultImage: "/uploads/products/1648808992_project_2.jpg",
    isGif: false,
    specs: ["Up to 50 Pa High ESP", "Scroll Compressor Precision", "TXV Expansion Valve"],
    subcategories: [
      {
        slug: "medium-static-ductable",
        name: "Medium Static Pressure Series",
        tagline: "Low-profile ducted units for multi-room corporate cabins and boutique offices",
        image: "/uploads/products/1648808992_project_2.jpg",
        products: [
          {
            name: "OG-DUCT-20 (2.0 Ton Med ESP)",
            slug: "og-duct-20",
            tonnage: "2.0 Ton",
            tag: "Medium ESP",
            image: "/uploads/products/1648808992_project_2.jpg",
            desc: "Whisper quiet central supply • Multi-zone",
            link: "/products/ductable-ac",
          },
          {
            name: "OG-DUCT-30 (3.0 Ton Med ESP)",
            slug: "og-duct-30",
            tonnage: "3.0 Ton",
            tag: "Commercial Ducted",
            image: "/uploads/products/1648808992_project_2.jpg",
            desc: "Scroll compressor efficiency • Easy ducting",
            link: "/products/ductable-ac",
          },
        ],
      },
      {
        slug: "high-static-ductable",
        name: "High Static Pressure Series",
        tagline: "Heavy-duty 50 Pa static pressure for long-distance duct networks and multi-floor distribution",
        image: "/uploads/products/1648808992_project_2.jpg",
        products: [
          {
            name: "OG-DUCT-40-HS (4.0 Ton High ESP)",
            slug: "og-duct-40-hs",
            tonnage: "4.0 Ton",
            tag: "50 Pa High ESP",
            image: "/uploads/products/1648808992_project_2.jpg",
            desc: "Long duct runs • Multi-speciality hospital rated",
            link: "/products/ductable-ac",
          },
          {
            name: "OG-DUCT-55-HS (5.5 Ton High ESP)",
            slug: "og-duct-55-hs",
            tonnage: "5.5 Ton",
            tag: "Central Plant",
            image: "/uploads/products/1648808992_project_2.jpg",
            desc: "Heavy industrial cooling plant • 3-Phase",
            link: "/products/ductable-ac",
          },
        ],
      },
    ],
  },
  {
    slug: "commercial-range",
    name: "Industrial Survivor Series",
    shortName: "Survivor Series",
    icon: ShieldCheck,
    badge: "52°C Harsh Ambient",
    tonnageRange: "2.0 Ton High-Static",
    tagline: "Extreme-Ambient Heavy-Duty Cooling for Factories, Generator Hubs & Production Floors",
    defaultImage: "/uploads/products/1648809194_project_1.jpg",
    isGif: false,
    specs: ["20-Micron Heavy Dust Filter", "Oversized Outdoor Coil", "Zero Ambient Derating"],
    subcategories: [
      {
        slug: "survivor-heavy-duty",
        name: "Survivor High-Ambient Series",
        tagline: "Corrosion-resistant chassis with dual-layer hydrophilic fin barrier for abrasive environments",
        image: "/uploads/products/1648809194_project_1.jpg",
        products: [
          {
            name: "OG-SURV-20 (2.0 Ton Survivor)",
            slug: "og-surv-20",
            tonnage: "2.0 Ton",
            tag: "Severe Ambient",
            image: "/uploads/products/1648809194_project_1.jpg",
            desc: "Built for foundry floors, server hubs, and extreme dust",
            link: "/products/commercial-range",
          },
        ],
      },
    ],
  },
];

export default function ProductMegaMenu({ onClose }) {
  // ─── Progressive Hover Drill-Down States ──────────────────────────────────
  // Stage 1 (Initial): activeCategorySlug === null -> Categories list + Welcome Discovery Showcase
  // Stage 2 (Hover Category): activeCategorySlug !== null, activeSubcategorySlug === null -> Categories + Subcategories + Category Showcase
  // Stage 3 & 4 (Hover Subcategory & Model): Categories + Subcategories + Available Models + Live Spec Preview
  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Active Category Object
  const activeCategory = useMemo(() => {
    if (!activeCategorySlug) return null;
    return (
      MEGA_MENU_CATEGORIES.find((cat) => cat.slug === activeCategorySlug) || null
    );
  }, [activeCategorySlug]);

  // Active Subcategory Object
  const activeSubcategory = useMemo(() => {
    if (!activeCategory || !activeSubcategorySlug) return null;
    return (
      activeCategory.subcategories.find((sub) => sub.slug === activeSubcategorySlug) || null
    );
  }, [activeCategory, activeSubcategorySlug]);

  // Handlers for progressive hover
  const handleCategoryHover = (category) => {
    setActiveCategorySlug(category.slug);
    setActiveSubcategorySlug(null);
    setHoveredProduct(null);
  };

  const handleSubcategoryHover = (subcategory) => {
    setActiveSubcategorySlug(subcategory.slug);
    setHoveredProduct(null);
  };

  const handleProductHover = (product) => {
    setHoveredProduct(product);
  };

  // Preview data when in Stage 3 & 4
  const previewData = useMemo(() => {
    if (!activeCategory) return null;

    if (hoveredProduct) {
      return {
        title: hoveredProduct.name,
        badge: hoveredProduct.tag || "Flagship Unit",
        tagline: hoveredProduct.desc || activeCategory.tagline,
        image: hoveredProduct.image || activeSubcategory?.image || activeCategory.defaultImage,
        tonnage: hoveredProduct.tonnage,
        link: hoveredProduct.link || `/products/${activeCategory.slug}`,
        specs: activeCategory.specs,
        isGif: activeCategory.isGif && (hoveredProduct.image === activeCategory.defaultImage),
      };
    }

    if (activeSubcategory) {
      return {
        title: activeSubcategory.name,
        badge: activeCategory.badge,
        tagline: activeSubcategory.tagline,
        image: activeSubcategory.image || activeCategory.defaultImage,
        tonnage: activeCategory.tonnageRange,
        link: `/products/${activeCategory.slug}`,
        specs: activeCategory.specs,
        isGif: false,
      };
    }

    return {
      title: activeCategory.name,
      badge: activeCategory.badge,
      tagline: activeCategory.tagline,
      image: activeCategory.defaultImage,
      tonnage: activeCategory.tonnageRange,
      link: `/products/${activeCategory.slug}`,
      specs: activeCategory.specs,
      isGif: activeCategory.isGif,
    };
  }, [hoveredProduct, activeSubcategory, activeCategory]);

  return (
    <div
      className="w-[960px] xl:w-[1020px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_28px_70px_-15px_rgba(11,19,43,0.22),0_0_0_1px_rgba(255,255,255,0.8)] border border-slate-200/90 overflow-hidden text-left pointer-events-auto select-none transition-all duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ─── Top Micro Bar: Dark Micro Bar Tracking Progressive Depth ───── */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#061129] border-b border-slate-800 text-xs text-slate-300 font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#00D2FF] font-bold text-[11px]">
            <Sparkles size={11} />
            <span>Heavy-Duty HVAC</span>
          </span>

          {activeCategory ? (
            <>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-white">{activeCategory.name}</span>
            </>
          ) : (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 font-medium">Select a Category</span>
            </>
          )}

          {activeSubcategory && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-[#00D2FF] font-bold truncate max-w-[180px]">
                {activeSubcategory.name}
              </span>
            </>
          )}

          {hoveredProduct && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-white font-extrabold truncate max-w-[180px]">
                {hoveredProduct.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ─── Main Content Canvas: Progressive Drill-Down ───────────────────── */}
      <div className="min-h-[400px] flex">
        {/* ─── LEVEL 1: CATEGORIES RAIL (Always Visible on Left) ──────────── */}
        <div
          className={`${
            activeSubcategory
              ? "w-[210px] p-2.5"
              : activeCategory
              ? "w-[240px] p-3"
              : "w-[280px] p-3.5"
          } shrink-0 bg-slate-50/60 border-r border-slate-200/80 flex flex-col justify-between transition-all duration-200`}
        >
          <div>
            <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Categories
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/60 text-slate-500">
                {MEGA_MENU_CATEGORIES.length}
              </span>
            </div>

            <div className="space-y-1">
              {MEGA_MENU_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = category.slug === activeCategorySlug;

                return (
                  <button
                    key={category.slug}
                    type="button"
                    onMouseEnter={() => handleCategoryHover(category)}
                    onClick={() => handleCategoryHover(category)}
                    className={`w-full flex items-center justify-between rounded-xl transition-all duration-150 text-left group ${
                      activeSubcategory ? "p-2" : "p-2.5"
                    } ${
                      isActive
                        ? "bg-white text-[#0f7ae0] font-bold shadow-xs border border-blue-200/90 -translate-x-0.5"
                        : "text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-blue-50 text-[#0f7ae0]"
                            : "bg-slate-200/70 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#0f7ae0]"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold leading-tight truncate ${
                            isActive ? "text-[#0f7ae0] font-bold" : "text-slate-800"
                          }`}
                        >
                          {category.shortName}
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
                          {category.tonnageRange}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className={`shrink-0 ml-1 transition-transform ${
                        isActive
                          ? "text-[#0f7ae0] translate-x-0.5"
                          : "text-slate-300 group-hover:text-slate-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom direct category link */}
          {activeCategory && (
            <div className="pt-2.5 px-1.5 border-t border-slate-200/60 mt-2">
              <Link
                href={`/products/${activeCategory.slug}`}
                onClick={onClose}
                className="text-[11.5px] font-bold text-[#0f7ae0] hover:underline flex items-center gap-1 truncate"
              >
                <span>Explore {activeCategory.shortName}</span>
                <ChevronRight size={12} className="shrink-0" />
              </Link>
            </div>
          )}
        </div>

        {/* ─── STAGE 1: Discovery Showcase (Shown When No Category Hovered) ── */}
        {!activeCategory && (
          <div className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-slate-50/40 via-white to-blue-50/30 flex flex-col justify-center animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0f7ae0] text-xs font-bold mb-3">
                <Award size={13} />
                <span>FACTORY CERTIFIED 52°C HIGH-AMBIENT COOLING</span>
              </div>

              <h3 className="text-xl font-black font-heading text-slate-900 tracking-tight leading-snug max-w-xl">
                Heavy-Duty Air Conditioning Engineered for Severe Indian Summer Climates
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
                Explore OG Heavy Duty&apos;s full HVAC range from residential high-ambient split units to
                multi-ton commercial cassettes, floor towers, and central ducted plants.
              </p>

              {/* 3 Core Value Props Cards */}
              <div className="grid grid-cols-3 gap-3.5 mt-6">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0f7ae0] flex items-center justify-center mb-2.5">
                    <Flame size={16} />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">52°C Ambient Rated</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Zero thermal tripping under peak summer heatwaves.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0f7ae0] flex items-center justify-center mb-2.5">
                    <Zap size={16} />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">100% Grooved Copper</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Rifled Cu-DHP tubing for accelerated pull-down.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0f7ae0] flex items-center justify-center mb-2.5">
                    <ShieldCheck size={16} />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Galvanized Chassis</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Corrosion-resistant outer casing built to last decades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── LEVEL 2: SUBCATEGORIES PANEL (Revealed on Category Hover) ───── */}
        {activeCategory && (
          <div
            className={`${
              activeSubcategory ? "w-[240px]" : "w-[280px]"
            } shrink-0 p-3.5 bg-white border-r border-slate-200/80 flex flex-col justify-between animate-in fade-in slide-in-from-left-2 duration-150 transition-all`}
          >
            <div>
              <div className="px-2 py-1.5 mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {activeCategory.shortName} Series
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#0f7ae0]">
                  {activeCategory.subcategories.length} Series
                </span>
              </div>

              <div className="space-y-1.5">
                {activeCategory.subcategories.map((subcategory) => {
                  const isActive = subcategory.slug === activeSubcategorySlug;

                  return (
                    <button
                      key={subcategory.slug}
                      type="button"
                      onMouseEnter={() => handleSubcategoryHover(subcategory)}
                      onClick={() => handleSubcategoryHover(subcategory)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 border flex flex-col group ${
                        isActive
                          ? "bg-blue-50/80 border-blue-300 text-[#0f7ae0] shadow-xs -translate-x-0.5"
                          : "bg-slate-50/70 border-slate-200/60 hover:bg-white hover:border-blue-200 hover:shadow-2xs text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isActive ? "text-[#0f7ae0]" : "text-slate-900 group-hover:text-[#0f7ae0]"
                          }`}
                        >
                          {subcategory.name}
                        </span>
                        <ChevronRight
                          size={13}
                          className={`shrink-0 transition-transform ${
                            isActive
                              ? "text-[#0f7ae0] translate-x-0.5"
                              : "text-slate-300 group-hover:text-slate-500"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {subcategory.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 px-1 text-[11px] text-slate-400 border-t border-slate-100">
              {activeSubcategory ? "Hover models on the right" : "Hover any series to view models"}
            </div>
          </div>
        )}

        {/* ─── STAGE 2: Category Hero Showcase (When Category Hovered, No Subcategory Yet) ── */}
        {activeCategory && !activeSubcategory && (
          <div className="flex-1 p-5 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/50 flex flex-col justify-between animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0f7ae0]">
                  {activeCategory.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Capacity: {activeCategory.tonnageRange}
                </span>
              </div>

              {/* High-Res Category Visual Stage */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group mb-3.5">
                <Image
                  src={activeCategory.defaultImage}
                  alt={activeCategory.name}
                  fill
                  unoptimized={true}
                  priority={true}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                    52°C Severe Ambient Rated
                  </span>
                  <span className="text-[11px] font-bold text-white bg-[#0f7ae0]/90 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    100% Inner-Grooved Copper
                  </span>
                </div>
              </div>

              <h4 className="text-base font-black font-heading text-slate-900 leading-snug">
                {activeCategory.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeCategory.tagline}
              </p>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {activeCategory.specs?.map((spec, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    <CheckCircle2 size={11} className="text-[#0f7ae0]" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                👉 Hover a series to the left to inspect models
              </span>
              <Link
                href={`/products/${activeCategory.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] shadow-sm transition-all"
              >
                <span>View All {activeCategory.shortName}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* ─── LEVEL 3: AVAILABLE MODELS LIST (Revealed on Subcategory Hover) ─ */}
        {activeCategory && activeSubcategory && (
          <div className="w-[240px] shrink-0 p-3 bg-slate-50/40 border-r border-slate-200/80 flex flex-col justify-between animate-in fade-in slide-in-from-left-2 duration-150">
            <div>
              <div className="px-1.5 py-1.5 mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Available Models
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                  {activeSubcategory.products?.length || 0} Models
                </span>
              </div>

              <div className="space-y-1.5">
                {activeSubcategory.products?.map((product) => {
                  const isHovered = hoveredProduct?.name === product.name;

                  return (
                    <Link
                      key={product.name}
                      href={product.link || `/products/${activeCategory.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => handleProductHover(product)}
                      className={`block p-2 rounded-xl border transition-all duration-150 group ${
                        isHovered
                          ? "bg-white border-[#0f7ae0] shadow-sm text-[#0f7ae0] -translate-x-0.5"
                          : "bg-white border-slate-200/80 hover:border-blue-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold truncate group-hover:text-[#0f7ae0]">
                          {product.name}
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#0f7ae0] shrink-0 ml-1">
                          {product.tag}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 truncate mt-1">
                        {product.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 px-1 border-t border-slate-200/60 mt-2">
              <Link
                href={`/products/${activeCategory.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11.5px] font-bold text-slate-700 hover:text-[#0f7ae0] transition-colors"
              >
                <span>View all in series</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        )}

        {/* ─── LEVEL 4: DYNAMIC SHOWCASE & SPEC PREVIEW (Column 4) ──────────── */}
        {activeCategory && activeSubcategory && previewData && (
          <div className="flex-1 min-w-[270px] p-4 bg-gradient-to-b from-blue-50/30 via-white to-slate-50/50 flex flex-col justify-between animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#0f7ae0]">
                  {previewData.badge}
                </span>
                <span className="text-[10.5px] font-bold text-slate-500">
                  {previewData.tonnage}
                </span>
              </div>

              {/* Dynamic Visual Stage */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group">
                <Image
                  key={previewData.image}
                  src={previewData.image}
                  alt={previewData.title}
                  fill
                  unoptimized={true}
                  priority={true}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 inline-block truncate max-w-full">
                    52°C Severe Ambient Rated
                  </span>
                </div>
              </div>

              {/* Dynamic Content Description */}
              <div className="mt-3">
                <h4 className="text-xs sm:text-[13px] font-black font-heading text-slate-900 leading-snug line-clamp-1">
                  {previewData.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                  {previewData.tagline}
                </p>
              </div>

              {/* Micro Spec Bullet Chips */}
              <div className="mt-2.5 space-y-1">
                {previewData.specs?.slice(0, 2).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10.5px] text-slate-600 font-medium">
                    <CheckCircle2 size={11} className="text-[#0f7ae0] shrink-0" />
                    <span className="truncate">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-3 border-t border-slate-200/60 mt-2">
              <Link
                href={previewData.link}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] shadow-md transition-all active:scale-95 group"
              >
                <span>Explore Specifications</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Footer Ribbon: Light / Grey Bar with PDF & Helpline ──── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-100/90 text-slate-700 text-xs border-t border-slate-200">
        <div className="flex items-center gap-4 text-slate-600">
          <a
            href="/uploads/OG Heavy Duty-updated.pdf"
            download
            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0f7ae0] font-semibold transition-colors"
          >
            <Download size={13} className="text-[#0f7ae0]" />
            <span>Download 2026-27 Product Catalogue (PDF)</span>
          </a>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-500">
            Custom commercial tonnage &amp; duct layout sizing available
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:01135727834"
            className="inline-flex items-center gap-1.5 text-[#0f7ae0] hover:text-[#0b5bb0] hover:underline font-bold"
          >
            <Phone size={12} className="text-[#0f7ae0]" />
            <span>011-35727834</span>
          </a>
        </div>
      </div>
    </div>
  );
}
