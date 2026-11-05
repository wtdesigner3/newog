import React from "react";

/**
 * ProductSpecTable — High-precision engineering specification table.
 * Standardized with elevated border-2 styling and brand visual tokens.
 */
export default function ProductSpecTable({ product }) {
  if (!product || !product.specs) {
    return (
      <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-8 text-center text-slate-500 shadow-xs">
        Engineering specifications currently undergoing technical calibration.
      </div>
    );
  }

  const { specs } = product;

  const specGroups = [
    {
      groupTitle: "Thermal & Cooling Performance",
      specs: [
        { label: "Nominal Cooling Capacity", value: specs.coolingCapacity },
        { label: "Heat Removal Rate", value: specs.coolingBtu },
        { label: "Tonnage Class", value: product.tonnage },
        { label: "Star Rating (BEE)", value: product.starRating || "Commercial Standard" },
        { label: "Energy Efficiency Ratio (ISEER)", value: specs.iseer ? `${specs.iseer} Wh/Wh` : null },
        { label: "Max Ambient Design Limit", value: specs.maxAmbient ? `${specs.maxAmbient}` : null },
      ],
    },
    {
      groupTitle: "Electrical & Power Input",
      specs: [
        { label: "Power Consumption (Rated)", value: specs.powerInput },
        { label: "Operating Current", value: specs.current },
        { label: "Power Supply", value: specs.powerSupply },
      ],
    },
    {
      groupTitle: "Compressor & Refrigeration System",
      specs: [
        { label: "Compressor Type", value: specs.compressorType },
        { label: "Eco Refrigerant", value: specs.refrigerant },
        { label: "Heat Exchanger Coil", value: specs.copperCondenser || "100% Inner-Grooved Heavy Copper" },
        { label: "Coil Protective Coating", value: specs.finType || "Hydrophilic Blue Fin Anti-Corrosion" },
      ],
    },
    {
      groupTitle: "Airflow & Acoustics",
      specs: [
        { label: "Air Circulation Volume", value: specs.airflow },
        { label: "Indoor Acoustic Noise Level", value: specs.noiseIndoor },
        { label: "Outdoor Acoustic Noise Level", value: specs.noiseOutdoor },
      ],
    },
    {
      groupTitle: "Physical Dimensions & Weight",
      specs: [
        { label: "Indoor Unit Dimensions (W×H×D)", value: specs.dimensionsIndoor || specs.dimensions },
        { label: "Indoor Unit Net Weight", value: specs.weightIndoor || specs.weight },
        { label: "Outdoor Unit Dimensions (W×H×D)", value: specs.dimensionsOutdoor },
        { label: "Outdoor Unit Net Weight", value: specs.weightOutdoor },
      ],
    },
    {
      groupTitle: "Manufacturing & Compliance Standards",
      specs: [
        { label: "Origin / Manufacturing", value: "100% Made in India (Vocal for Local)" },
        { label: "Standard Manufacturing Protocol", value: "Designed in Accordance with Indian HVAC Norms" },
        { label: "Model Code Identifier", value: product.model },
        { label: "Commercial Warranty", value: specs.warranty || "1 Year Comprehensive + 5 Years Compressor Warranty" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {specGroups.map((group, gIdx) => {
        // Filter out null or undefined rows
        const activeSpecs = group.specs.filter((s) => s.value);
        if (activeSpecs.length === 0) return null;

        return (
          <div key={gIdx} className="overflow-hidden rounded-2xl border-2 border-slate-200/90 bg-white shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)]">
            <div className="bg-[#0B132B] px-6 py-3.5 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D2FF]">
                {group.groupTitle}
              </h4>
            </div>

            <dl className="divide-y divide-slate-100">
              {activeSpecs.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 sm:grid-cols-3 px-6 py-3 text-xs sm:text-sm transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  } hover:bg-blue-50/50`}
                >
                  <dt className="font-semibold text-slate-600 sm:col-span-1 flex items-center">
                    {item.label}
                  </dt>
                  <dd className="font-bold text-slate-900 sm:col-span-2 mt-1 sm:mt-0 flex items-center">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
