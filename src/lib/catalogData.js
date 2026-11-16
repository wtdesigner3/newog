/**
 * catalogData.js — Authoritative Product Catalog Data Layer
 * 
 * Conforms to:
 * - 2 Main Categories: Domestic AC & Light Commercial AC
 * - 7 Subcategories: Window AC, Split AC, Four Way Cassette AC, Ductable AC, One-Way Cassette AC, Floor Standing (Tower) AC, Survivor AC
 * - 34 Models from official manufacturer specifications
 */

export const VERIFIED_CATEGORIES = [
  // ─── MAIN CATEGORY 1: DOMESTIC AC ──────────────────────────────────────────
  {
    slug: "domestic-ac",
    name: "Domestic AC",
    shortName: "Domestic AC",
    series: "Residential & Domestic Range",
    badge: "HEAVY-DUTY DOMESTIC SERIES",
    tagline: "Engineered for Tropical Ambient Indian Climates & Continuous Home Duty",
    description:
      "High-performance heavy-duty residential and domestic air conditioning systems engineered with tropicalized compressors and 100% copper coils for continuous cooling up to 52°C ambient temperatures.",
    bannerImage: "/uploads/breadcrumb/1648811523_download.jpg",
    image: "/uploads/category/1649065306_air-conditioner-1.gif",
    isGif: true,
    tonnageRange: "1.0 Ton • 1.5 Ton • 1.8 Ton • 2.0 Ton",
    subcategories: [
      {
        slug: "window-ac",
        name: "Window AC",
        series: [
          { slug: "fixed-speed-series", name: "Fixed speed series" },
          { slug: "variable-speed-series", name: "Variable speed series" },
        ],
        description: "Heavy-duty window air conditioners built for severe tropical high-ambient cooling without compressor thermal tripping.",
        image: "/uploads/category/1649065324_window-ac.gif",
      },
      {
        slug: "split-ac",
        name: "Split Hi-Wall Air Conditioner",
        series: [
          { slug: "fixed-speed-series", name: "Fixed speed series" },
          { slug: "variable-speed-series", name: "Variable speed series" },
        ],
        description: "High-efficiency heavy-duty wall-mounted split air conditioning systems with dual inverter and fixed speed technology.",
        image: "/uploads/category/1649065306_air-conditioner-1.gif",
      },
    ],
    features: [
      "100% Inner-Grooved Pure Copper Coils",
      "Extreme High Ambient Cooling Tested up to 52°C",
      "Stabilizer-Free Operation (Wide Voltage Band)",
      "Dual Rotary Inverter & High-Torque Fixed Speed Options",
      "Hydrophilic Blue Fin Anti-Corrosion Protection",
    ],
  },

  // ─── MAIN CATEGORY 2: LIGHT COMMERCIAL AC ──────────────────────────────────
  {
    slug: "light-commercial-ac",
    name: "Light Commercial AC",
    shortName: "Light Commercial AC",
    series: "Light Commercial AC Range",
    badge: "COMMERCIAL AIR CONDITIONING",
    tagline: "Institutional & Commercial Climate Control Engineered for Severe Tropical Climates",
    description:
      "Commercial-grade heavy-duty air conditioning systems designed for corporate boardrooms, retail showrooms, hospitals, universities, and commercial spaces.",
    bannerImage: "/uploads/breadcrumb/1648815831_download.jpg",
    image: "/uploads/products/1648809114_project_4.jpg",
    isGif: false,
    tonnageRange: "1.0 Ton to 8.0 Ton",
    subcategories: [
      {
        slug: "four-way-cassette-ac",
        name: "Four Way Cassette AC",
        series: [{ slug: "fixed-speed-series", name: "Fixed speed series" }],
        description: "Ceiling-recessed 4-way airflow commercial cassette units with integrated high-lift condensate drain pump.",
        image: "/uploads/products/1648809114_project_4.jpg",
      },
      {
        slug: "ductable-ac",
        name: "Ductable AC",
        series: [{ slug: "fixed-speed-series", name: "Fixed speed series" }],
        description: "Centralized ducted air conditioning systems with high external static pressure for commercial and institutional projects.",
        image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg",
      },
      {
        slug: "one-way-cassette-ac",
        name: "One-Way Cassette AC",
        series: [{ slug: "fixed-speed-series", name: "Fixed speed series" }],
        description: "Slim-line 1-way directional airflow ceiling cassette units engineered for modern luxury architectural interiors.",
        image: "/uploads/products/1648809114_project_4.jpg",
      },
      {
        slug: "floor-standing-ac",
        name: "Floor Standing (Tower) AC",
        series: [{ slug: "fixed-speed-series", name: "Fixed speed series" }],
        description: "High-tonnage vertical column tower air conditioners with long-distance air throw for banquets, lobbies, and auditoriums.",
        image: "/uploads/products/1675757183_og-24 fcc.jpg",
      },
      {
        slug: "survivor-ac",
        name: "Survivor AC",
        series: [{ slug: "fixed-speed-series", name: "Fixed speed series" }],
        description: "Extreme high-ambient industrial heavy-duty air conditioning units engineered for harsh, dusty industrial factory floors.",
        image: "/uploads/products/1648809194_project_1.jpg",
      },
    ],
    features: [
      "High External Static Pressure & 360° Air Distribution",
      "100% Heavy-Duty Copper Heat Exchangers",
      "Continuous Duty in Harsh Environments up to 52°C",
      "High Airflow Throw for Large Commercial Spaces",
      "Available in Single-Phase & 3-Phase Industrial Power",
    ],
  },

  // ─── SUBCATEGORY ENTRIES (FOR DIRECT /products/[slug] RESOLUTION) ───────────
  {
    slug: "window-ac",
    name: "Window AC",
    shortName: "Window AC",
    parentCategorySlug: "domestic-ac",
    parentCategoryName: "Domestic AC",
    series: "Residential Series",
    badge: "Flagship High-Ambient",
    tagline: "Engineered for High-Ambient Indian Summers & Continuous Duty",
    description: "Heavy-duty window air conditioners built for severe tropical high-ambient cooling without compressor thermal tripping.",
    bannerImage: "/uploads/breadcrumb/1648811523_download.jpg",
    image: "/uploads/category/1649065324_window-ac.gif",
    isGif: true,
    tonnageRange: "1.0 Ton • 1.5 Ton • 2.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
      { slug: "variable-speed-series", name: "Variable speed series" },
    ],
  },
  {
    slug: "split-ac",
    name: "Split Hi-Wall Air Conditioner",
    shortName: "Split AC",
    parentCategorySlug: "domestic-ac",
    parentCategoryName: "Domestic AC",
    series: "Residential & Commercial Series",
    badge: "Dual Rotary Inverter",
    tagline: "Continuous Commercial Duty with Hydrophilic Blue Fin Coating",
    description: "Heavy-duty wall-mounted split air conditioning systems featuring dual rotary inverter compressors and fixed-speed heavy-duty models.",
    bannerImage: "/uploads/breadcrumb/1648811531_download.jpg",
    image: "/uploads/category/1649065306_air-conditioner-1.gif",
    isGif: true,
    tonnageRange: "1.0 Ton • 1.5 Ton • 1.8 Ton • 2.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
      { slug: "variable-speed-series", name: "Variable speed series" },
    ],
  },
  {
    slug: "four-way-cassette-ac",
    previousSlugs: ["cassette-ac"],
    name: "Four Way Cassette AC",
    shortName: "4-Way Cassette",
    parentCategorySlug: "light-commercial-ac",
    parentCategoryName: "Light Commercial AC",
    series: "Commercial Series",
    badge: "360° Uniform Airflow",
    tagline: "Ceiling-Recessed Commercial Cooling for Boardrooms & Retail",
    description: "Ceiling-recessed 4-way airflow commercial cassette units equipped with integrated high-lift condensate drain pump.",
    bannerImage: "/uploads/breadcrumb/1648811539_download.jpg",
    image: "/uploads/products/1648809114_project_4.jpg",
    isGif: false,
    tonnageRange: "1.0 Ton to 5.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
    ],
  },
  {
    slug: "ductable-ac",
    name: "Ductable AC",
    shortName: "Ductable AC",
    parentCategorySlug: "light-commercial-ac",
    parentCategoryName: "Light Commercial AC",
    series: "Light Commercial Series",
    badge: "Central Ducted Split",
    tagline: "High External Static Pressure for Institutional Projects",
    description: "Centralized ducted split systems with high external static pressure (ESP) and scroll compressor architecture.",
    bannerImage: "/uploads/breadcrumb/1648815831_download.jpg",
    image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg",
    isGif: false,
    tonnageRange: "1.0 Ton to 8.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
    ],
  },
  {
    slug: "one-way-cassette-ac",
    name: "One-Way Cassette AC",
    shortName: "1-Way Cassette",
    parentCategorySlug: "light-commercial-ac",
    parentCategoryName: "Light Commercial AC",
    series: "Commercial Series",
    badge: "Slim Line Architectural",
    tagline: "Slim Directional Cooling for Architectural Ceilings",
    description: "Slim-line 1-way directional airflow ceiling cassette units engineered for modern luxury architectural interiors.",
    bannerImage: "/uploads/breadcrumb/1648811539_download.jpg",
    image: "/uploads/products/1648809114_project_4.jpg",
    isGif: false,
    tonnageRange: "1.5 Ton • 2.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
    ],
  },
  {
    slug: "floor-standing-ac",
    previousSlugs: ["tower-ac"],
    name: "Floor Standing (Tower) AC",
    shortName: "Tower AC",
    parentCategorySlug: "light-commercial-ac",
    parentCategoryName: "Light Commercial AC",
    series: "Light Commercial Series",
    badge: "High Airflow Column",
    tagline: "Powerful Vertical Throw for Banquets, Lobbies & Auditoriums",
    description: "High-throw vertical column air conditioning systems featuring multi-stage centrifugal blowers.",
    bannerImage: "/uploads/breadcrumb/1648811556_download.jpg",
    image: "/uploads/products/1675757183_og-24 fcc.jpg",
    isGif: false,
    tonnageRange: "2.0 Ton • 4.0 Ton • 5.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
    ],
  },
  {
    slug: "survivor-ac",
    previousSlugs: ["commercial-range"],
    name: "Survivor AC",
    shortName: "Survivor Series",
    parentCategorySlug: "light-commercial-ac",
    parentCategoryName: "Light Commercial AC",
    series: "Heavy Industrial Series",
    badge: "Industrial 52°C Ambient",
    tagline: "Rugged Heavy-Duty Cooling for Extreme Harsh Environments",
    description: "Specialized extreme-ambient industrial climate control units featuring oversized outdoor heat exchangers and 20-micron heavy dust filtration.",
    bannerImage: "/uploads/breadcrumb/1648815844_download.jpg",
    image: "/uploads/products/1648809194_project_1.jpg",
    isGif: false,
    tonnageRange: "2.0 Ton",
    subcategories: [
      { slug: "fixed-speed-series", name: "Fixed speed series" },
    ],
  },
];

function normalizeProduct(p) {
  if (!p) return null;
  const cleanTonnage = (p.tonnage || "").trim();
  const cleanStar = (p.starRating || "").trim();
  const cleanTech = (p.technology || "").trim();

  const specs = {
    coolingCapacity: cleanTonnage ? `${cleanTonnage} Rated Capacity` : "Heavy Duty",
    starRating: cleanStar || "Commercial Grade",
    technology: cleanTech || "Heavy Duty",
    maxAmbient: "52°C Tropical Peak",
    copperCondenser: "100% Inner-Grooved Heavy Copper",
    finType: "Hydrophilic Blue Fin Anti-Corrosion Coating",
    warranty: "1 Year Comprehensive + 5 Years Compressor Warranty",
  };

  return {
    ...p,
    name: p.name || `${p.model} ${cleanTonnage} ${cleanStar ? cleanStar + ' ' : ''}${cleanTech} Air Conditioner`,
    maxAmbient: "52°C Tropical",
    specs,
    features: [
      "100% Inner-Grooved Pure Copper Coils",
      "Continuous Duty up to 52°C Tropical Ambient",
      "High-Torque Tropical Compressor",
      "Hydrophilic Blue Fin Protection",
    ],
  };
}

export const RAW_PRODUCTS = [
  // ─── 1. WINDOW AC (6 models) ────────────────────────────────────────────────
  { model: "OG-12WA3", slug: "og-12wa3", tonnage: "1 Ton", starRating: "1 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "window-ac", image: "/uploads/category/1649065324_window-ac.gif" },
  { model: "OG-18W3A", slug: "og-18w3a", tonnage: "1.5 ton", starRating: "3 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "window-ac", image: "/uploads/category/1649065324_window-ac.gif" },
  { model: "OG-19WA5", slug: "og-19wa5", tonnage: "1.5 Ton", starRating: "4 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "window-ac", image: "/uploads/category/1649065324_window-ac.gif" },
  { model: "OG-18W3IN", slug: "og-18w3in", tonnage: "1.5 TON", starRating: "3 Star", technology: "VARIABLE (INVERTER) SERIES", categorySlug: "domestic-ac", subcategorySlug: "window-ac", image: "/uploads/category/1649065324_window-ac.gif" },
  { model: "OG-18W5IN", slug: "og-18w5in", tonnage: "1.5 Ton", starRating: "5 Star", technology: "VARIABLE (INVERTER) SERIES", categorySlug: "domestic-ac", subcategorySlug: "window-ac", image: "/uploads/category/1649065324_window-ac.gif" },
  { model: "OG-25WA3", slug: "og-25wa3", tonnage: "2 Ton", starRating: "2 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "window-ac", image: "/uploads/category/1649065324_window-ac.gif" },

  // ─── 2. SPLIT AC (8 models) ─────────────────────────────────────────────────
  { model: "OG-12FS3", slug: "og-12fs3", tonnage: "1 Ton", starRating: "2 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-12S5IN", slug: "og-12s5in", tonnage: "1.5 ton", starRating: "5 Star", technology: "VARIABLE (INVERTER) SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-18S3FS", slug: "og-18s3fs", tonnage: "1.5 Ton", starRating: "3 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-18S3IN", slug: "og-18s3in", tonnage: "1.5 TON", starRating: "3 Star", technology: "VARIABLE (INVERTER) SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-18S5IN", slug: "og-18s5in", tonnage: "1.5 Ton", starRating: "5 Star", technology: "VARIABLE (INVERTER) SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-243SA", slug: "og-243sa", tonnage: "2 Ton", starRating: "1 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-22S3IN", slug: "og-22s3in", tonnage: "1.8 ton", starRating: "3 Star", technology: "VARIABLE (INVERTER) SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },
  { model: "OG-25IN5", slug: "og-25in5", tonnage: "2 Ton", starRating: "4 Star", technology: "FIXED SPEED SERIES", categorySlug: "domestic-ac", subcategorySlug: "split-ac", image: "/uploads/category/1649065306_air-conditioner-1.gif" },

  // ─── 3. FOUR WAY CASSETTE AC (8 models) ─────────────────────────────────────
  { model: "OGC-12C", slug: "ogc-12c", tonnage: "1 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-18C", slug: "ogc-18c", tonnage: "1.5 ton (2*2)", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-18L", slug: "ogc-18l", tonnage: "1.5 Ton (3*3)", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-24", slug: "ogc-24", tonnage: "2 TON", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-30", slug: "ogc-30", tonnage: "2.5 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-36", slug: "ogc-36", tonnage: "3 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-48", slug: "ogc-48", tonnage: "4 ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OGC-60", slug: "ogc-60", tonnage: "5 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "four-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },

  // ─── 4. DUCTABLE AC (6 models) ──────────────────────────────────────────────
  { model: "OG-MTB-18C", slug: "og-mtb-18c", tonnage: "1 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "ductable-ac", image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg" },
  { model: "OG-MTB-24C", slug: "og-mtb-24c", tonnage: "2 ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "ductable-ac", image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg" },
  { model: "OG-MHC-36C", slug: "og-mhc-36c", tonnage: "3 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "ductable-ac", image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg" },
  { model: "OG-MHC-48C", slug: "og-mhc-48c", tonnage: "4 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "ductable-ac", image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg" },
  { model: "OG-MHC-60C", slug: "og-mhc-60c", tonnage: "5 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "ductable-ac", image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg" },
  { model: "OG-MHC-96C", slug: "og-mhc-96c", tonnage: "8 ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "ductable-ac", image: "/uploads/products/1684564736_ductable_ac_supplier_in_delhi.jpg" },

  // ─── 5. ONE-WAY CASSETTE AC (2 models) ──────────────────────────────────────
  { model: "OG-52OWC", slug: "og-52owc", tonnage: "1.5  Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "one-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },
  { model: "OG-70OWC", slug: "og-70owc", tonnage: "2 ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "one-way-cassette-ac", image: "/uploads/products/1648809114_project_4.jpg" },

  // ─── 6. FLOOR STANDING (TOWER) AC (3 models) ────────────────────────────────
  { model: "OG-24FCC", slug: "og-24fcc", tonnage: "2  Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "floor-standing-ac", image: "/uploads/products/1675757183_og-24 fcc.jpg" },
  { model: "OG-48FCC", slug: "og-48fcc", tonnage: "4 ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "floor-standing-ac", image: "/uploads/products/1675757454_og-48fcc.jpg" },
  { model: "OG-60FCC", slug: "og-60fcc", tonnage: "5 Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "floor-standing-ac", image: "/uploads/products/1675757454_og-48fcc.jpg" },

  // ─── 7. SURVIVOR AC (1 model) ───────────────────────────────────────────────
  { model: "OG-SV24", slug: "og-sv24", tonnage: "2  Ton", starRating: "", technology: "FIXED SPEED SERIES", categorySlug: "light-commercial-ac", subcategorySlug: "survivor-ac", image: "/uploads/products/1648809194_project_1.jpg" },
];

export const VERIFIED_PRODUCTS = RAW_PRODUCTS.map(normalizeProduct);

export function getCategories() {
  return VERIFIED_CATEGORIES;
}

export function getCategoryBySlug(slug) {
  if (!slug) return null;
  const direct = VERIFIED_CATEGORIES.find((c) => c.slug === slug);
  if (direct) return direct;
  return VERIFIED_CATEGORIES.find(
    (c) => Array.isArray(c.previousSlugs) && c.previousSlugs.includes(slug)
  ) || null;
}

export function getAllProducts() {
  return VERIFIED_PRODUCTS;
}

export function getProductsByCategory(categorySlug) {
  if (!categorySlug) return [];
  // Match either categorySlug or subcategorySlug
  return VERIFIED_PRODUCTS.filter(
    (p) =>
      p.categorySlug === categorySlug ||
      p.subcategorySlug === categorySlug
  );
}

export function getProductBySlug(categorySlug, productSlug) {
  if (!productSlug) return null;
  if (categorySlug) {
    const p = VERIFIED_PRODUCTS.find(
      (item) =>
        item.slug === productSlug &&
        (item.categorySlug === categorySlug || item.subcategorySlug === categorySlug)
    );
    if (p) return p;
  }
  return VERIFIED_PRODUCTS.find((item) => item.slug === productSlug) || null;
}

export function getRelatedProducts(categorySlug, currentProductSlug, limit = 8) {
  const categoryProducts = getProductsByCategory(categorySlug);
  return categoryProducts
    .filter((p) => p.slug !== currentProductSlug)
    .slice(0, limit);
}
