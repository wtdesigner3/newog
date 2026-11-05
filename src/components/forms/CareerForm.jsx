"use client";

import React, { useState, useRef } from "react";
import { getRecaptchaToken } from "../../lib/recaptchaClient";
import {
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";

const POSITIONS = [
  "General Application",
  "HVAC Service & Commissioning Engineer",
  "Commercial HVAC Sales Executive",
  "Production & Assembly Line Technician",
  "Quality Assurance & Testing Inspector",
  "Supply Chain & Procurement Specialist",
  "Industrial Design & CAD Draftsman",
];

const EXPERIENCE_LEVELS = [
  "Fresher / Entry Level (0–1 Year)",
  "Junior Professional (1–3 Years)",
  "Mid-Level Professional (3–5 Years)",
  "Senior Specialist / Lead (5–10 Years)",
  "Executive / Management (10+ Years)",
];

const INITIAL_STATE = {
  fullName: "",
  email: "",
  phone: "",
  position: "General Application",
  experienceYears: "Junior Professional (1–3 Years)",
  location: "Delhi NCR",
  message: "",
  consent: false,
  website: "", // Honeypot
  _hp: "", // Honeypot
};

export default function CareerForm({ defaultPosition = "General Application" }) {
  const [formData, setFormData] = useState({
    ...INITIAL_STATE,
    position: defaultPosition,
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrors((prev) => ({
        ...prev,
        resume: "Only PDF documents (.pdf) are accepted for resume submissions.",
      }));
      setResumeFile(null);
      return;
    }

    // Validate Size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "Resume file size exceeds the 5 MB limit.",
      }));
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters.";
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

    if (!resumeFile) {
      errs.resume = "Please attach your resume in PDF format (maximum 5 MB).";
    }

    if (!formData.consent) {
      errs.consent = "You must confirm that the information provided is accurate.";
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
      const recaptchaToken = await getRecaptchaToken("career_application");

      const data = new FormData();
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("phone", formData.phone.trim());
      data.append("position", formData.position);
      data.append("experienceYears", formData.experienceYears);
      data.append("location", formData.location.trim());
      data.append("message", formData.message.trim());
      data.append("website", formData.website);
      data.append("_hp", formData._hp);
      if (recaptchaToken) {
        data.append("recaptchaToken", recaptchaToken);
      }
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      const response = await fetch("/api/career/apply", {
        method: "POST",
        body: data,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to submit application. Please check your entries."
        );
      }

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          Application Submitted Successfully
        </h3>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
          Thank you for applying to <strong>OG Heavy Duty</strong>. Your credentials and resume have been securely transferred to our human resources and engineering leadership. Qualified candidates will be contacted directly for initial interviews.
        </p>

        <div className="inline-flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono mb-8 border border-slate-100">
          <span>HR Desk: hr@ogheavyduty.in</span>
          <span>•</span>
          <span>Adarsh Nagar, New Delhi</span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f7ae0] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f7ae0]"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Submit Another Application</span>
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
      {/* Honeypot Fields */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="career-website">Leave blank</label>
        <input
          type="text"
          id="career-website"
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
            <p className="font-semibold">Application Submission Error</p>
            <p className="mt-0.5 text-rose-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* Row 1: Full Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="career-name"
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
              id="career-name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ankit Verma"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "career-name-error" : undefined}
              className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
                errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
              }`}
            />
          </div>
          {errors.fullName && (
            <p id="career-name-error" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="career-email"
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
              id="career-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="candidate@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "career-email-error" : undefined}
              className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
                errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
              }`}
            />
          </div>
          {errors.email && (
            <p id="career-email-error" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Phone & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="career-phone"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Telephone / Mobile <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone size={16} aria-hidden="true" />
            </span>
            <input
              type="tel"
              id="career-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98111 22334"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "career-phone-error" : undefined}
              className={`min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all ${
                errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
              }`}
            />
          </div>
          {errors.phone && (
            <p id="career-phone-error" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="career-location"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Current Location / City
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin size={16} aria-hidden="true" />
            </span>
            <input
              type="text"
              id="career-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Delhi NCR, Haryana"
              className="min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Position & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="career-position"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Position Applied For
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Briefcase size={16} aria-hidden="true" />
            </span>
            <select
              id="career-position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="career-experience"
            className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
          >
            Years of Relevant Experience
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Clock size={16} aria-hidden="true" />
            </span>
            <select
              id="career-experience"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="min-h-[44px] w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 4: Resume File Upload */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Resume / Curriculum Vitae (PDF) <span className="text-rose-600">*</span>
        </label>

        {!resumeFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-[#0f7ae0] hover:bg-slate-50/50 ${
              errors.resume ? "border-rose-400 bg-rose-50/20" : "border-slate-300 bg-slate-50/20"
            }`}
          >
            <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Click to select or drag your PDF resume here
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Accepted format: PDF only • Maximum file size: 5 MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50 border border-sky-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-sky-100 text-[#0f7ae0] rounded-lg shrink-0">
                <FileText size={18} aria-hidden="true" />
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                  {resumeFile.name}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Remove attached resume"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf,.pdf"
          className="hidden"
          aria-hidden="true"
        />

        {errors.resume && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.resume}</p>
        )}
      </div>

      {/* Row 5: Introduction / Message */}
      <div>
        <label
          htmlFor="career-message"
          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
        >
          Cover Note / Professional Summary <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="career-message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Briefly highlight your HVAC expertise, certifications (e.g. ITI, Diploma, B.Tech), or key projects..."
          className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all bg-white"
        />
      </div>

      {/* Row 6: Consent Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0f7ae0] focus:ring-[#0f7ae0] cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            I certify that the information and resume submitted are accurate and understand that my credentials will be reviewed for employment suitability at OG Heavy Duty.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 text-xs text-rose-600 font-medium pl-7">{errors.consent}</p>
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
              <span>Verifying & Uploading Application...</span>
            </>
          ) : (
            <>
              <UploadCloud size={16} aria-hidden="true" />
              <span>Submit Job Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

