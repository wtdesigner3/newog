/**
 * resourcesData.js — Authoritative technical resources, manuals & downloads repository.
 *
 * All entries map strictly to authentic manufacturer PDF assets verified on disk in /public/documents/.
 * No fabricated documents, synthetic download URLs, or unverified claims.
 */

export const RESOURCE_CATEGORIES = [
  {
    slug: "catalogues",
    name: "Product Catalogues",
    description: "Official manufacturer technical specifications, engineering brochures, and commercial product range catalogues.",
    icon: "BookOpen",
  },
  {
    slug: "manuals",
    name: "Operation & Installation Manuals",
    description: "Detailed user operating instructions, installation guidelines, wiring diagrams, and routine maintenance protocols.",
    icon: "FileText",
  },
  {
    slug: "error-codes",
    name: "Diagnostic Error Codes & Guides",
    description: "Official diagnostic fault charts, PCB error code indices, sensor resistance charts, and systematic troubleshooting flowcharts.",
    icon: "AlertTriangle",
  },
  {
    slug: "warranty",
    name: "Warranty Terms & Policies",
    description: "Standard commercial warranty terms, compressor coverage guidelines, jurisdiction policies, and service conditions.",
    icon: "ShieldCheck",
  },
];

export const TECHNICAL_RESOURCES = [
  // ─── 1. PRODUCT CATALOGUES ───────────────────────────────────────
  {
    id: "catalogue-2026-2027",
    title: "OG Heavy Duty Product Catalogue (2026–2027 Edition)",
    category: "catalogues",
    categoryName: "Product Catalogues",
    description:
      "Comprehensive 27-page manufacturer catalogue covering the complete OG Heavy Duty cooling range: Inverter & Fixed-Speed Window ACs, Inverter & Fixed-Speed Split ACs, Cassette ACs, Ductable Systems, and Survivor High-Ambient Series.",
    applicableProducts: "All Models (Window, Split, Cassette, Tower, Survivor Series)",
    applicableCategorySlug: "all",
    applicableModels: ["OG-18W5IN", "OG-19WA5", "OG-18S5IN", "OG-25IN5", "OGC-24", "OG-70OWC", "OG-24FCC", "OG-48FCC", "OG-SV24"],
    filePath: "/documents/og-heavy-duty-catalogue-2026-2027.pdf",
    legacyPaths: ["/uploads/OG Heavy Duty-updated.pdf"],
    fileType: "PDF",
    fileSize: "3.28 MB",
    pageCount: 27,
    edition: "2026–2027 Official Edition",
    verified: true,
  },
  {
    id: "catalogue-2025-2026",
    title: "OG Heavy Duty Product Range Catalogue (2025–2026 Edition)",
    category: "catalogues",
    categoryName: "Product Catalogues",
    description:
      "Official 16-page technical product range brochure presenting engineering capacities, dimensional drawings, and technical parameters for commercial and institutional air conditioners.",
    applicableProducts: "Commercial & Residential Air Conditioning Range",
    applicableCategorySlug: "all",
    applicableModels: ["OG-19WA5", "OG-18S5IN", "OG-25IN5", "OGC-24", "OG-70OWC"],
    filePath: "/documents/og-heavy-duty-catalogue-2025-2026.pdf",
    legacyPaths: ["/uploads/final-cat-2025-2026.pdf"],
    fileType: "PDF",
    fileSize: "28.16 MB",
    pageCount: 16,
    edition: "2025–2026 Edition",
    verified: true,
  },
  {
    id: "catalogue-2023-2024",
    title: "OG Heavy Duty Air Conditioners Catalogue (2023–2024 Edition)",
    category: "catalogues",
    categoryName: "Product Catalogues",
    description:
      "Legacy 16-page catalogue detailing 100% inner-grooved copper tube construction, blue hydrophilic fin protection, and rotary compressor cooling specifications.",
    applicableProducts: "Air-Conditioners 100% Copper Blue Coil Range",
    applicableCategorySlug: "all",
    applicableModels: ["OG-19WA5", "OG-18S5IN", "OG-25IN5"],
    filePath: "/documents/og-heavy-duty-catalogue-2023-2024.pdf",
    legacyPaths: ["/uploads/og-heavy-duty-product-catalogue.pdf"],
    fileType: "PDF",
    fileSize: "10.38 MB",
    pageCount: 16,
    edition: "2023–2024 Edition",
    verified: true,
  },

  // ─── 2. OPERATION & INSTALLATION MANUALS ────────────────────────
  {
    id: "manual-window-ac",
    title: "Window Air Conditioner User Operation & Installation Manual",
    category: "manuals",
    categoryName: "Operation & Installation Manuals",
    description:
      "Official 25-page operational guide for Window AC units. Covers cabinet installation, electrical connection requirements, wireless remote controller operation, air filter removal/cleaning, and seasonal maintenance.",
    applicableProducts: "Heavy-Duty Window Air Conditioners (1.5 Ton & 2.0 Ton)",
    applicableCategorySlug: "window-ac",
    applicableModels: ["OG-18W5IN", "OG-19WA5", "OG-18WA3", "OG-24WA3"],
    filePath: "/documents/window-ac-user-manual.pdf",
    legacyPaths: ["/images/windowUSER MANUAL.pdf"],
    fileType: "PDF",
    fileSize: "7.19 MB",
    pageCount: 25,
    edition: "Official Manufacturer Manual",
    verified: true,
  },
  {
    id: "manual-split-ac",
    title: "Split Air Conditioner Installation & User Operation Manual",
    category: "manuals",
    categoryName: "Operation & Installation Manuals",
    description:
      "Comprehensive 44-page technical manual for Inverter and Fixed-Speed Split Air Conditioners. Detailed guidance on indoor unit wall-mounting, outdoor unit placement, refrigerant copper piping connection, vacuuming, flare nut torques, and operating modes.",
    applicableProducts: "High-Wall & Inverter Split Air Conditioners (1.0 to 2.0 Ton)",
    applicableCategorySlug: "split-ac",
    applicableModels: ["OG-18S5IN", "OG-25IN5", "OG-12S5IN", "OG-18S3FS", "OG-243SA"],
    filePath: "/documents/split-ac-user-manual.pdf",
    legacyPaths: ["/images/SPlitMANUALOGFS.pdf"],
    fileType: "PDF",
    fileSize: "11.96 MB",
    pageCount: 44,
    edition: "Official Split Series Manual",
    verified: true,
  },
  {
    id: "manual-commercial-ac",
    title: "Legacy Window & Compact Series Operating Manual (Part No. EPAM10O22008)",
    category: "manuals",
    categoryName: "Operation & Installation Manuals",
    description:
      "Legacy manufacturer operating manual for chassis-based Window and Compact room air conditioner series (Part No. EPAM10O22008). Covers slide-out chassis mounting, electrical connections, remote controller usage, and air filter maintenance.",
    applicableProducts: "Legacy Chassis Window & Compact Air Conditioners",
    applicableCategorySlug: "window-ac",
    applicableModels: ["OG-18W5IN", "OG-19WA5", "OG-12WA3"],
    filePath: "/documents/og-user-manual-commercial.pdf",
    legacyPaths: ["/images/OG USER MANUAL EPAM10O22008.pdf"],
    fileType: "PDF",
    fileSize: "7.19 MB",
    pageCount: 25,
    edition: "Legacy Factory Edition (EPAM10O22008)",
    verified: true,
  },

  // ─── 3. DIAGNOSTIC ERROR CODES & GUIDES ─────────────────────────
  {
    id: "error-codes-split",
    title: "Split Air Conditioner Diagnostic Error Codes & Fault Index",
    category: "error-codes",
    categoryName: "Diagnostic Error Codes & Guides",
    description:
      "Authoritative diagnostic reference chart for split air conditioner digital display fault codes (including indoor coil thermistor, outdoor discharge sensor, IPM power module fault, communication fault, and overcurrent trip indicators).",
    applicableProducts: "Split Air Conditioners (Inverter & Fixed Speed)",
    applicableCategorySlug: "split-ac",
    applicableModels: ["OG-18S5IN", "OG-25IN5", "OG-12S5IN"],
    filePath: "/documents/split-ac-error-code.pdf",
    legacyPaths: ["/images/split-ac-error-code.pdf"],
    fileType: "PDF",
    fileSize: "2.97 MB",
    pageCount: 1,
    edition: "Technical Service Bulletin",
    verified: true,
  },
  {
    id: "error-codes-window",
    title: "Window Air Conditioner Diagnostic Error Codes Guide",
    category: "error-codes",
    categoryName: "Diagnostic Error Codes & Guides",
    description:
      "Official fault code guide for Window AC electronic displays. Identifies ambient temperature sensor open/short circuits, evaporator frost protection cutoffs, and compressor thermal trip resolution.",
    applicableProducts: "Window Air Conditioners (Electronic Display Models)",
    applicableCategorySlug: "window-ac",
    applicableModels: ["OG-18W5IN", "OG-19WA5", "OG-24WA3"],
    filePath: "/documents/window-ac-error-code.pdf",
    legacyPaths: ["/images/window-ac-error-code.pdf"],
    fileType: "PDF",
    fileSize: "1.72 MB",
    pageCount: 1,
    edition: "Technical Service Bulletin",
    verified: true,
  },
  {
    id: "troubleshooting-guide",
    title: "Commercial HVAC Systematic Troubleshooting Guide",
    category: "error-codes",
    categoryName: "Diagnostic Error Codes & Guides",
    description:
      "Systematic HVAC troubleshooting flowchart for service engineers and facility managers. Diagnoses inadequate cooling, insufficient airflow, abnormal acoustic noise, electrical tripping, and refrigerant leak verification.",
    applicableProducts: "All Commercial & Residential Cooling Systems",
    applicableCategorySlug: "all",
    applicableModels: ["OG-18W5IN", "OG-19WA5", "OG-18S5IN", "OG-25IN5", "OGC-24", "OG-70OWC", "OG-24FCC", "OG-48FCC", "OG-SV24"],
    filePath: "/documents/hvac-troubleshooting-guide.pdf",
    legacyPaths: ["/images/troubleshooting.pdf"],
    fileType: "PDF",
    fileSize: "2.17 MB",
    pageCount: 1,
    edition: "Engineering Field Manual",
    verified: true,
  },

  // ─── 4. WARRANTY TERMS & CONDITIONS ─────────────────────────────
  {
    id: "warranty-terms",
    title: "Commercial Air Conditioner Warranty Terms & Conditions Policy",
    category: "warranty",
    categoryName: "Warranty Terms & Policies",
    description:
      "Official commercial warranty terms specifying 1-year comprehensive unit warranty and 5-year heavy-duty compressor warranty coverage. Details warranty claim procedures, exclusion criteria, installation inspection requirements, and Delhi jurisdiction terms.",
    applicableProducts: "All OG Heavy Duty Air Conditioning Units",
    applicableCategorySlug: "all",
    applicableModels: ["OG-18W5IN", "OG-19WA5", "OG-18S5IN", "OG-25IN5", "OGC-24", "OG-70OWC", "OG-24FCC", "OG-48FCC", "OG-SV24"],
    filePath: "/documents/warranty-terms-and-conditions.pdf",
    legacyPaths: ["/images/termsandcondition.pdf"],
    fileType: "PDF",
    fileSize: "79.7 KB",
    pageCount: 2,
    edition: "Official Warranty Policy",
    verified: true,
  },
];

// Helper Query Functions
export function getAllResources() {
  return TECHNICAL_RESOURCES;
}

export function getResourceCategories() {
  return RESOURCE_CATEGORIES.map((cat) => ({
    ...cat,
    count: TECHNICAL_RESOURCES.filter((r) => r.category === cat.slug).length,
  }));
}

export function getResourcesByCategory(categorySlug) {
  if (!categorySlug || categorySlug === "all") return TECHNICAL_RESOURCES;
  return TECHNICAL_RESOURCES.filter((r) => r.category === categorySlug.toLowerCase().trim());
}

export function getResourcesForProduct(categorySlug, productModel) {
  const normCategory = categorySlug?.toLowerCase().trim();
  const normModel = productModel?.toUpperCase().trim();

  const matching = TECHNICAL_RESOURCES.filter((r) => {
    // If it's a global document, include it
    if (r.applicableCategorySlug === "all") return true;

    // If category matches
    if (normCategory && r.applicableCategorySlug === normCategory) return true;

    // If model is explicitly mapped
    if (normModel && r.applicableModels && r.applicableModels.includes(normModel)) return true;

    return false;
  });

  // Prioritize category-specific manuals and diagnostic error codes over general catalogues
  return matching.sort((a, b) => {
    const aIsSpecific = a.applicableCategorySlug !== "all";
    const bIsSpecific = b.applicableCategorySlug !== "all";
    if (aIsSpecific && !bIsSpecific) return -1;
    if (!aIsSpecific && bIsSpecific) return 1;
    return 0;
  });
}
