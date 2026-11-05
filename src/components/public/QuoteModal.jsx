"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Layers,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

const AC_CATEGORY_OPTIONS = [
  "Split Air Conditioners (1.0T – 2.0T)",
  "Window Air Conditioners (1.0T – 1.5T)",
  "Cassette Air Conditioners (1.5T – 3.0T)",
  "Floor Standing / Tower AC (2.0T – 5.0T)",
  "Ductable Air Conditioners (1.5T – 5.5T)",
  "Survivor Heavy-Duty Commercial Series",
  "Turnkey Commercial HVAC / Multi-Ton",
  "Other / Engineering Sizing Query",
];

const ENQUIRY_TYPES = [
  "Commercial / Project Quotation",
  "Residential High-Ambient AC",
  "Institutional / Bulk Supply",
  "Architect & HVAC Consultant Inquiry",
  "Dealership / Distribution",
];

export default function QuoteModal({ isOpen, onClose, data = {} }) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    city: "",
    product: "",
    enquiryType: "Commercial / Project Quotation",
    message: "",
    website: "", // Honeypot
    _hp: "", // Honeypot
  });

  // Client hydration check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial product/model data when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setServerError("");
      setErrors({});

      let initialProduct = "";
      if (data.model && data.product) {
        initialProduct = `${data.model} — ${data.product}`;
      } else if (data.model) {
        initialProduct = `Model: ${data.model}`;
      } else if (data.category) {
        initialProduct = data.category;
      } else if (data.product) {
        initialProduct = data.product;
      } else {
        initialProduct = AC_CATEGORY_OPTIONS[0];
      }

      setFormData((prev) => ({
        ...prev,
        product: initialProduct,
        enquiryType: data.enquiryType || prev.enquiryType || "Commercial / Project Quotation",
        message: data.model ? `Inquiring for official quotation on ${data.model}. Please provide availability and pricing.` : "",
      }));
    }
  }, [isOpen, data]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const digitsOnly = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (digitsOnly.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit telephone number.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City / Project location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA client verification token
      const recaptchaToken = await getRecaptchaToken("enquiry_submission");

      const payload = {
        contactPerson: formData.name.trim(),
        companyName: formData.companyName.trim() || "Individual / Private Project",
        email: formData.email.trim().toLowerCase(),
        contactNo: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.city.trim(),
        product: formData.product || (data.model ? `Model ${data.model}` : "General Heavy-Duty Range"),
        enquiryType: formData.enquiryType,
        message: formData.message.trim() || `Quotation requested for ${formData.product}`,
        specialRequirements: formData.message.trim() || "",
        website: formData.website, // honeypot
        _hp: formData._hp, // honeypot
        recaptchaToken: recaptchaToken || "",
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.message || "Failed to submit request. Please try again.");
      }

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const modalMarkup = (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-2 border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Top Specular Brand Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#0f7ae0] via-[#00D2FF] to-[#0f7ae0]" />

        {/* ─── Header Section (Deep Industrial Navy) ───────────────────────── */}
        <div className="relative bg-[#061129] text-white p-5 sm:p-6 pb-6">
          {/* Subtle blueprint pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#0f7ae0_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10.5px] font-bold uppercase tracking-wider text-blue-300 mb-2">
                <ShieldCheck size={12} className="text-[#00D2FF]" />
                <span>Direct OEM Factory Quotation</span>
              </div>
              <h2 id="quote-modal-title" className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight leading-snug">
                {data.model ? `Enquire for ${data.model}` : "Request Equipment Quotation"}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 mt-1 max-w-md leading-relaxed">
                Receive official commercial pricing, cooling tonnage estimation &amp; engineering submittal sheets within 2 hours.
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Active Machine Pill (If triggered from a specific product or model) */}
          {(data.model || data.product) && (
            <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                {data.model && (
                  <span className="font-mono font-bold text-[#00D2FF] bg-blue-900/60 border border-blue-400/40 px-2 py-0.5 rounded-md">
                    {data.model}
                  </span>
                )}
                <span className="text-slate-200 font-semibold truncate max-w-[240px]">
                  {data.product || data.category}
                </span>
              </div>
              <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Inner-Grooved Copper Verified
              </span>
            </div>
          )}
        </div>

        {/* ─── Body Section: Form or Success ───────────────────────────────── */}
        <div className="p-5 sm:p-6 bg-slate-50/50">
          {isSuccess ? (
            /* ─── Success Confirmation State ────────────────────────────── */
            <div className="py-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
                Quotation Request Received!
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your requirement has been registered with our factory sales and application engineering desk.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-white border border-slate-200 max-w-md mx-auto text-left shadow-2xs space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Equipment / Subject:</span>
                  <span className="font-bold text-slate-800">{formData.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Number:</span>
                  <span className="font-bold text-slate-800">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Turnaround:</span>
                  <span className="font-bold text-emerald-700">Within 2 Business Hours</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:01135727834"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all"
                >
                  <Phone size={14} className="text-[#00D2FF]" />
                  <span>Call Hotline: 011-35727834</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            /* ─── Active Enquiry Form ───────────────────────────────────── */
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* Server-level error banner */}
              {serverError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Honeypot Fields (Hidden to humans, filled by spam bots) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData._hp}
                  onChange={handleChange}
                />
              </div>

              {/* Row 1: Full Name & Mobile Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border ${
                        errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-[#0f7ae0]"
                      } focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-600 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] font-bold text-slate-400 pointer-events-none font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={15}
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border ${
                        errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-[#0f7ae0]"
                      } focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              {/* Row 2: Work Email & Company/Firm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border ${
                        errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-[#0f7ae0]"
                      } focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-600 mt-0.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company / Firm Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Firm, Hotel or Private Residence"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border border-slate-300 focus:border-[#0f7ae0] focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: City & AC Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City / Delivery Location <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. New Delhi, NCR, Jaipur"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border ${
                        errors.city ? "border-rose-400 bg-rose-50/20" : "border-slate-300 focus:border-[#0f7ae0]"
                      } focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900`}
                    />
                  </div>
                  {errors.city && <p className="text-[11px] text-rose-600 mt-0.5">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Equipment Classification
                  </label>
                  <div className="relative">
                    <Layers size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      placeholder="e.g. Split AC 1.5 Ton / OG-18S5IN"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border border-slate-300 focus:border-[#0f7ae0] focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Project Scope / Requirements Note */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Cooling Requirements &amp; Commercial Scope <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Enter estimated unit quantity, room dimensions, heat load details, or commercial site timeline..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white rounded-xl border border-slate-300 focus:border-[#0f7ae0] focus:outline-none focus:ring-2 focus:ring-[#0f7ae0]/20 transition-all font-sans text-slate-900 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button & Fast Action Strip */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Submitting Quotation Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quotation Request</span>
                      <Send size={14} className="text-blue-100" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
}

