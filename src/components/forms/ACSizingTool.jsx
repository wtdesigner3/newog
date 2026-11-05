"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Compass,
  Building,
  Users,
  Sun,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Info,
} from "lucide-react";

const APPLICATION_TYPES = [
  { id: "office", label: "Office & Corporate Space", desc: "Workstations, cabins, conference rooms" },
  { id: "retail", label: "Retail Showroom & Shop", desc: "High footfall, display lighting, frequent door openings" },
  { id: "hospitality", label: "Restaurant & Hospitality", desc: "Dining areas, hotel rooms, guest lounges" },
  { id: "healthcare", label: "Healthcare & Clinic", desc: "Patient rooms, diagnostic labs, consultation suites" },
  { id: "industrial", label: "Industrial & Server Facilities", desc: "Control rooms, IT server enclosures, workshops" },
  { id: "residential", label: "Residential Living & Master Bedroom", desc: "Apartments, villas, top-floor bedrooms" },
];

const CEILING_HEIGHTS = [
  { id: "standard", label: "Standard (8 to 10 ft)", factor: "Normal air volume" },
  { id: "medium", label: "Medium (10 to 12 ft)", factor: "Elevated volume" },
  { id: "high", label: "High Industrial (12 to 16 ft)", factor: "Large thermal column" },
  { id: "double", label: "Double Height (> 16 ft)", factor: "Extensive air mass requiring staging" },
];

const SUN_EXPOSURES = [
  { id: "top_floor", label: "Top Floor / Direct Exposed Roof", desc: "Direct solar radiation absorbed through roof slab" },
  { id: "west_facing", label: "Large West/South Facing Windows", desc: "Intense afternoon solar gain through glass" },
  { id: "middle_floor", label: "Middle Floor / Shaded Walls", desc: "Protected by adjacent structures or floors above" },
  { id: "minimal", label: "North Facing / Fully Insulated", desc: "Minimal direct sunlight entry" },
];

const EQUIPMENT_PREFERENCES = [
  "Engineering Team Recommendation (Consultant Choice)",
  "Heavy-Duty Window Air Conditioners",
  "Inverter Split Air Conditioners (High-Wall)",
  "Ceiling Cassette Air Conditioners (4-Way)",
  "Floor Standing / Tower Air Conditioners",
  "Ductable / Packaged Concealed Units",
];

const INITIAL_DATA = {
  // Step 1: Dimensions & Space
  applicationType: "office",
  roomLength: "15",
  roomWidth: "12",
  ceilingHeight: "standard",
  
  // Step 2: Heat Load Inputs
  occupancy: "4",
  sunExposure: "middle_floor",
  heatEquipment: "Standard office PCs & LED lighting",
  installationCity: "New Delhi NCR",
  
  // Step 3: Equipment Preference & Notes
  preferredEquipment: "Engineering Team Recommendation (Consultant Choice)",
  specialNotes: "",

  // Step 4: Contact Info
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  consent: false,
  website: "", // Honeypot
  _hp: "", // Honeypot
};

export default function ACSizingTool() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  // Calculated floor area
  const areaSqFt = useMemo(() => {
    const l = parseFloat(formData.roomLength) || 0;
    const w = parseFloat(formData.roomWidth) || 0;
    return Math.round(l * w);
  }, [formData.roomLength, formData.roomWidth]);

  const validateStep = (currentStep) => {
    const errs = {};

    if (currentStep === 1) {
      const l = parseFloat(formData.roomLength);
      const w = parseFloat(formData.roomWidth);
      if (!formData.roomLength || isNaN(l) || l <= 0) {
        errs.roomLength = "Valid room length is required.";
      }
      if (!formData.roomWidth || isNaN(w) || w <= 0) {
        errs.roomWidth = "Valid room width is required.";
      }
    }

    if (currentStep === 2) {
      const occ = parseInt(formData.occupancy, 10);
      if (!formData.occupancy || isNaN(occ) || occ < 1) {
        errs.occupancy = "Please enter typical number of occupants.";
      }
      if (!formData.installationCity.trim()) {
        errs.installationCity = "Installation city/state is required.";
      }
    }

    if (currentStep === 4) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
        errs.fullName = "Full name is required.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        errs.email = "Valid email address is required.";
      }
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (!formData.phone.trim() || phoneDigits.length < 7 || phoneDigits.length > 15) {
        errs.phone = "Valid telephone number is required (7 to 15 digits).";
      }
      if (!formData.consent) {
        errs.consent = "You must consent to being contacted by an engineering specialist.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    const sizingPayload = {
      spaceType: formData.applicationType,
      roomDimensions: `${formData.roomLength} ft × ${formData.roomWidth} ft`,
      totalAreaSqFt: areaSqFt,
      ceilingHeight: formData.ceilingHeight,
      occupancy: formData.occupancy,
      sunExposure: formData.sunExposure,
      heatEquipment: formData.heatEquipment,
      preferredType: formData.preferredEquipment,
      city: formData.installationCity,
    };

    const combinedMessage = [
      `[GUIDED AC SIZING ENQUIRY]`,
      `Application: ${formData.applicationType.toUpperCase()}`,
      `Dimensions: ${formData.roomLength} ft × ${formData.roomWidth} ft (${areaSqFt} sq.ft)`,
      `Ceiling Height: ${formData.ceilingHeight}`,
      `Peak Occupancy: ${formData.occupancy} persons`,
      `Sun Exposure: ${formData.sunExposure}`,
      `Equipment In Space: ${formData.heatEquipment}`,
      `Preferred Type: ${formData.preferredEquipment}`,
      `Installation City: ${formData.installationCity}`,
      formData.specialNotes ? `Additional Notes: ${formData.specialNotes}` : null,
    ].filter(Boolean).join("\n");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactPerson: formData.fullName.trim(),
          companyName: formData.companyName.trim() || "Individual / Residential",
          email: formData.email.trim().toLowerCase(),
          contactNo: formData.phone.trim(),
          city: formData.installationCity.trim(),
          address: formData.installationCity.trim(),
          enquiryType: "AC Sizing & Heat Load Calculation",
          product: formData.preferredEquipment,
          message: combinedMessage,
          specialRequirements: combinedMessage,
          sizingDetails: sizingPayload,
          website: formData.website,
          _hp: formData._hp,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit sizing enquiry.");
      }

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
    setStep(1);
    setIsSuccess(false);
    setServerError("");
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-sky-100 text-[#0f7ae0] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 size={36} aria-hidden="true" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Sizing Consultation Request Logged
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Your room dimensions (<strong>{areaSqFt} sq.ft</strong>) and environmental parameters have been submitted to the OG Heavy Duty applications engineering desk. A certified thermal engineer will review the sensible and latent heat loads and contact you with calibrated tonnage options.
        </p>

        {/* Structured Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2 mb-8">
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-500">Target Area:</span>
            <span className="font-semibold text-slate-900">{formData.roomLength} × {formData.roomWidth} ft ({areaSqFt} sq.ft)</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-500">Space Classification:</span>
            <span className="font-semibold text-slate-900 capitalize">{formData.applicationType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-900">{formData.installationCity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Equipment Type:</span>
            <span className="font-semibold text-[#0f7ae0]">{formData.preferredEquipment}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f7ae0] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Size Another Room</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
      {/* Progress Steps Header */}
      <div className="mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
          <span>Step {step} of 4</span>
          <span className="text-[#0f7ae0]">
            {step === 1 && "Space & Dimensions"}
            {step === 2 && "Thermal & Solar Load"}
            {step === 3 && "Equipment Preference"}
            {step === 4 && "Contact & Engineering Review"}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#0f7ae0] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Mandatory Engineering Disclosure Alert */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold">Engineering Disclaimer:</strong> This tool collects preliminary layout parameters to prepare for heat-load calculation. Real-world cooling tonnage depends on building envelope materials, window glazing U-factors, ceiling insulation, and regional ambient design dry-bulb temperatures. Final capacity must be certified by an HVAC engineer.
        </div>
      </div>

      {/* STEP 1: Dimensions & Space Classification */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-3">
              1. What type of room or facility are you cooling?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {APPLICATION_TYPES.map((app) => (
                <button
                  type="button"
                  key={app.id}
                  onClick={() => setFormData((p) => ({ ...p, applicationType: app.id }))}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.applicationType === app.id
                      ? "border-[#0f7ae0] bg-sky-50/60 ring-2 ring-[#0f7ae0]/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{app.label}</p>
                  <p className="text-[11px] text-slate-500 leading-normal">{app.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-3">
              2. Room Dimensions (Feet)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label htmlFor="room-length" className="block text-xs text-slate-600 mb-1 font-medium">
                  Length (Feet) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  id="room-length"
                  name="roomLength"
                  min="1"
                  max="500"
                  value={formData.roomLength}
                  onChange={handleChange}
                  className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                    errors.roomLength ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                  }`}
                />
                {errors.roomLength && <p className="mt-1 text-xs text-rose-600">{errors.roomLength}</p>}
              </div>

              <div>
                <label htmlFor="room-width" className="block text-xs text-slate-600 mb-1 font-medium">
                  Width (Feet) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  id="room-width"
                  name="roomWidth"
                  min="1"
                  max="500"
                  value={formData.roomWidth}
                  onChange={handleChange}
                  className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                    errors.roomWidth ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                  }`}
                />
                {errors.roomWidth && <p className="mt-1 text-xs text-rose-600">{errors.roomWidth}</p>}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <span className="block text-xs text-slate-500 font-medium">Calculated Floor Area</span>
                <span className="text-lg font-black text-slate-900">{areaSqFt} <span className="text-xs font-semibold text-slate-500">sq.ft</span></span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-3">
              3. Approximate Ceiling Height
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CEILING_HEIGHTS.map((h) => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => setFormData((p) => ({ ...p, ceilingHeight: h.id }))}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.ceilingHeight === h.id
                      ? "border-[#0f7ae0] bg-sky-50/60 ring-2 ring-[#0f7ae0]/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{h.label}</p>
                  <p className="text-[11px] text-slate-500">{h.factor}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Thermal & Environmental Factors */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-3">
              4. Sunlight Exposure & Structural Position
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUN_EXPOSURES.map((exp) => (
                <button
                  type="button"
                  key={exp.id}
                  onClick={() => setFormData((p) => ({ ...p, sunExposure: exp.id }))}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.sunExposure === exp.id
                      ? "border-[#0f7ae0] bg-sky-50/60 ring-2 ring-[#0f7ae0]/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">{exp.label}</p>
                  <p className="text-[11px] text-slate-500 leading-normal">{exp.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label htmlFor="occupancy-input" className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                5. Peak Number of People In Space <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users size={16} aria-hidden="true" />
                </span>
                <input
                  type="number"
                  id="occupancy-input"
                  name="occupancy"
                  min="1"
                  max="1000"
                  value={formData.occupancy}
                  onChange={handleChange}
                  className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                    errors.occupancy ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.occupancy && <p className="mt-1 text-xs text-rose-600">{errors.occupancy}</p>}
            </div>

            <div>
              <label htmlFor="city-input" className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                6. Installation City / State <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="city-input"
                name="installationCity"
                value={formData.installationCity}
                onChange={handleChange}
                placeholder="e.g. New Delhi, Jaipur, Gurugram"
                className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                  errors.installationCity ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.installationCity && <p className="mt-1 text-xs text-rose-600">{errors.installationCity}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label htmlFor="heat-equipment" className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
              7. Heat-Generating Machinery / Electrical Appliances
            </label>
            <input
              type="text"
              id="heat-equipment"
              name="heatEquipment"
              value={formData.heatEquipment}
              onChange={handleChange}
              placeholder="e.g. 10 Laptops, 2 Printers, Ovens, Server Racks, Heavy Lighting"
              className="min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0]"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Equipment Preference & Notes */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-3">
              8. Preferred Equipment Style or Architecture
            </label>
            <div className="space-y-2.5">
              {EQUIPMENT_PREFERENCES.map((eq) => (
                <label
                  key={eq}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.preferredEquipment === eq
                      ? "border-[#0f7ae0] bg-sky-50/50 ring-2 ring-[#0f7ae0]/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredEquipment"
                    value={eq}
                    checked={formData.preferredEquipment === eq}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#0f7ae0] focus:ring-[#0f7ae0]"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">{eq}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label htmlFor="special-notes" className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
              9. Additional Project or Space Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="special-notes"
              name="specialNotes"
              rows={3}
              value={formData.specialNotes}
              onChange={handleChange}
              placeholder="Mention power supply constraints (e.g. 1-phase vs 3-phase), piping length limits, or architectural preferences..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0]"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Contact & Submission */}
      {step === 4 && (
        <form onSubmit={handleSubmit} noValidate className="space-y-6 animate-in fade-in duration-200">
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            <input type="text" name="_hp" value={formData._hp} onChange={handleChange} tabIndex={-1} autoComplete="off" />
          </div>

          {serverError && (
            <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Submission Failed</p>
                <p className="mt-0.5 text-rose-700">{serverError}</p>
              </div>
            </div>
          )}

          {/* Sizing Parameters Recap */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-1.5">
            <p className="font-bold text-slate-900 text-sm mb-2">Collected Sizing Parameters Summary:</p>
            <p>• <strong>Dimensions:</strong> {formData.roomLength} ft × {formData.roomWidth} ft ({areaSqFt} sq.ft) with {formData.ceilingHeight} ceiling</p>
            <p>• <strong>Application:</strong> {formData.applicationType.toUpperCase()} in {formData.installationCity}</p>
            <p>• <strong>Thermal Load:</strong> {formData.occupancy} persons, {formData.sunExposure}, {formData.heatEquipment}</p>
            <p>• <strong>Equipment:</strong> {formData.preferredEquipment}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-fullname" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="contact-fullname"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Full Name"
                className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                  errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="contact-company" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="contact-company"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Delhi University / Private Residence"
                className="min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@domain.com"
                className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                  errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="contact-phone" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Telephone / WhatsApp <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] ${
                  errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0f7ae0] focus:ring-[#0f7ae0]"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I request an official heat-load calculation and technical sizing proposal from OG Heavy Duty engineering desk.
              </span>
            </label>
            {errors.consent && <p className="mt-1.5 text-xs text-rose-600 pl-7">{errors.consent}</p>}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0f7ae0] hover:bg-[#0d69c2] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Sizing Data...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Sizing For Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP NAVIGATION BUTTONS (Steps 1, 2, 3) */}
      {step < 4 && (
        <div className="pt-6 mt-8 flex items-center justify-between border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="min-h-[44px] inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f7ae0] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

