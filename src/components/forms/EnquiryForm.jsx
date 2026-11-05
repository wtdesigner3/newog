"use client";

import React, { useState } from "react";
import { getRecaptchaToken } from "../../lib/recaptchaClient";
import {
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
  RotateCcw,
} from "lucide-react";

const ENQUIRY_TYPES = [
  "General Product Enquiry",
  "Commercial / Project Quotation",
  "Dealership & Distribution",
  "Institutional / Bulk Supply",
  "Technical & Service Assistance",
  "Architect & HVAC Consultant Query",
];

const PRODUCT_CATEGORIES = [
  "General Inquiries / Unsure",
  "Window Air Conditioners (1.5T / 2.0T)",
  "Inverter Split Air Conditioners (1.0T to 2.0T)",
  "Cassette Air Conditioners (2.0T / 4.0T)",
  "Floor Standing / Tower AC (2.0T / 4.0T)",
  "Ductable Air Conditioners (2.0T to 8.5T)",
  "Survivor Commercial Heavy-Duty Series",
];

const INITIAL_STATE = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  city: "",
  enquiryType: "General Product Enquiry",
  product: "General Inquiries / Unsure",
  message: "",
  website: "", // Honeypot
  _hp: "", // Honeypot
};

export default function EnquiryForm({ initialProduct = "", initialType = "" }) {
  const [formData, setFormData] = useState({
    ...INITIAL_STATE,
    product: initialProduct || INITIAL_STATE.product,
    enquiryType: initialType || INITIAL_STATE.enquiryType,
  });

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

    // Clear field error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errs.phone = "Please enter a valid telephone number (7 to 15 digits).";
    }

    if (!formData.message.trim()) {
      errs.message = "Please include a message or describe your requirements.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate client-side reCAPTCHA v3 token
      const recaptchaToken = await getRecaptchaToken("enquiry_submission");

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactPerson: formData.name.trim(),
          companyName: formData.companyName.trim() || "Individual / Residential",
          email: formData.email.trim().toLowerCase(),
          contactNo: formData.phone.trim(),
          city: formData.city.trim(),
          address: formData.city.trim(),
          enquiryType: formData.enquiryType,
          product: formData.product,
          message: formData.message.trim(),
          specialRequirements: formData.message.trim(),
          website: formData.website,
          _hp: formData._hp,
          recaptchaToken: recaptchaToken || "",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit your enquiry. Please check your inputs."
        );
      }

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    setIsSuccess(false);
    setServerError("");
  };

  if (isSuccess) {
    return (
      <div className="py-6 sm:py-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 size={36} aria-hidden="true" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Enquiry Received Successfully
        </h3>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
          Thank you for reaching out to <strong>OG Heavy Duty</strong>. Your enquiry has been securely logged with our sales and engineering desk. A technical representative will review your cooling requirements and respond promptly.
        </p>

        <div className="inline-flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono mb-8 border border-slate-100">
          <span>Priority Desk: 011-35727834</span>
          <span>•</span>
          <span>sales@ogheavyduty.in</span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f7ae0] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f7ae0]"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Submit Another Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 sm:space-y-5"
    >
      {/* Honeypot Fields (Hidden from human users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="form-website">Leave blank</label>
        <input
          type="text"
          id="form-website"
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

      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Submission Failed</p>
            <p className="mt-0.5 text-rose-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* Row 1: Name & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="enquiry-name"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Full Name <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={16} aria-hidden="true" />
            </span>
            <input
              type="text"
              id="enquiry-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Chandra"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
                errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
              }`}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-company"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building size={16} aria-hidden="true" />
            </span>
            <input
              type="text"
              id="enquiry-company"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Apollo Hospitals / Residential"
              className="min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="enquiry-email"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Email Address <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={16} aria-hidden="true" />
            </span>
            <input
              type="email"
              id="enquiry-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@organization.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
                errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
              }`}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Contact Telephone <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone size={16} aria-hidden="true" />
            </span>
            <input
              type="tel"
              id="enquiry-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
                errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
              }`}
            />
          </div>
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Row 3: City, Enquiry Type & Product */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label
            htmlFor="enquiry-city"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            City / State
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin size={16} aria-hidden="true" />
            </span>
            <input
              type="text"
              id="enquiry-city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. New Delhi, NCR"
              className="min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="enquiry-type"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Enquiry Type
          </label>
          <div className="relative">
            <select
              id="enquiry-type"
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              className="min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            >
              {ENQUIRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="enquiry-product"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Equipment Interest
          </label>
          <div className="relative">
            <select
              id="enquiry-product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="min-h-[44px] w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            >
              {PRODUCT_CATEGORIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 4: Message Textarea */}
      <div>
        <label
          htmlFor="enquiry-message"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
        >
          Message & Project Details <span className="text-rose-600">*</span>
        </label>
        <div className="relative">
          <textarea
            id="enquiry-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please specify room dimensions, tonnage requirements, quantity, installation timeline, or any special high-ambient operating considerations..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
              errors.message ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
            }`}
          />
        </div>
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-rose-600 font-medium">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl bg-[#0f7ae0] hover:bg-[#0d69c2] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f7ae0] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              <span>Transmitting Secure Enquiry...</span>
            </>
          ) : (
            <>
              <Send size={15} aria-hidden="true" />
              <span>Send Official Enquiry</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

