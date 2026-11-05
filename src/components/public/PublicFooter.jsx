import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  Download,
  ArrowRight,
} from "lucide-react";

export default function PublicFooter({ settings = null }) {
  // Verified brand data
  const primaryPhone = settings?.primaryPhone || "011-35727834";
  const mobilePhone = "+91 93199 77568";
  const primaryEmail = settings?.primaryEmail || "info@ogheavyduty.in";
  const address =
    settings?.address || "D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033";
  const logo = settings?.logoImage || "/images/og-logo.png";
  const workingHours = "Mon – Sat: 10:00 AM – 7:30 PM";

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Our Clients", href: "/clients" },
    { label: "Technical Blogs", href: "/blogs" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ];

  const productLinks = [
    { label: "Window Air Conditioners", href: "/products/window-ac" },
    { label: "Split Air Conditioners", href: "/products/split-ac" },
    { label: "Cassette Air Conditioners", href: "/products/cassette-ac" },
    { label: "Floor Standing / Tower AC", href: "/products/floor-standing-ac" },
    { label: "Ductable Air Conditioners", href: "/products/ductable-ac" },
  ];

  return (
    <footer className="w-full bg-[#070D1F] text-white font-sans border-t border-slate-800/90 relative z-10">
      {/* ─── Modern Compact Main Footer Grid ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block" aria-label="OG Heavy Duty Homepage">
              <Image
                src={logo}
                alt="OG Heavy Duty"
                width={160}
                height={48}
                className="h-9 w-auto object-contain brightness-0 invert"
                style={{ maxHeight: "36px", width: "auto" }}
              />
            </Link>

            <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed max-w-sm">
              India&apos;s trusted manufacturer of commercial and high-ambient heavy-duty air conditioning systems. Engineered with 100% inner-grooved copper coils for severe 52°C tropical climates.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.08] border border-white/20 text-[11px] font-medium text-white">
                <ShieldCheck size={13} className="text-[#38bdf8]" />
                <span>ISO 9001:2015</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.08] border border-white/20 text-[11px] font-medium text-white">
                <Clock size={13} className="text-[#38bdf8]" />
                <span>{workingHours}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 pb-1.5 border-b border-white/15">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-white/85 hover:text-white hover:translate-x-1 transition-all duration-150"
                  >
                    <ChevronRight size={12} className="text-[#38bdf8] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products (3 Cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 pb-1.5 border-b border-white/15">
              AC Classifications
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-white/85 hover:text-white hover:translate-x-1 transition-all duration-150"
                  >
                    <ChevronRight size={12} className="text-[#38bdf8] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1.5">
                <a
                  href="/documents/og-heavy-duty-catalogue-2026-2027.pdf"
                  download
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8] hover:text-white transition-colors"
                >
                  <Download size={13} />
                  <span>Download Master Catalogue</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 pb-1.5 border-b border-white/15">
              Corporate Desk
            </h3>

            <div className="space-y-2.5 text-xs text-white">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#38bdf8] shrink-0 mt-0.5" />
                <span className="leading-snug text-white/95">{address}</span>
              </div>

              <div className="flex items-start gap-2">
                <Phone size={15} className="text-[#38bdf8] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                    className="block text-white hover:text-[#38bdf8] transition-colors font-semibold"
                  >
                    {primaryPhone} (Helpline)
                  </a>
                  <a
                    href={`tel:${mobilePhone.replace(/\s+/g, "")}`}
                    className="block text-white/90 hover:text-[#38bdf8] transition-colors"
                  >
                    {mobilePhone} (Desk)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail size={15} className="text-[#38bdf8] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${primaryEmail}`}
                  className="block text-white hover:text-[#38bdf8] transition-colors font-medium"
                >
                  {primaryEmail}
                </a>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0f7ae0] to-[#0a66c2] hover:from-[#1185f3] hover:to-[#0c59a3] shadow-md transition-all duration-200 active:scale-95"
              >
                <span>Request Quotation</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Compact Bottom Bar (Crisp White & Legal Links) ──────────── */}
      <div className="bg-[#050917] py-4 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-xs text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-white/95" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} <span className="font-bold text-white">O.G. HEAVY DUTY</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-condition" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <Link href="/warranty-terms-and-conditions" className="hover:text-white transition-colors">
              Warranty Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Floating WhatsApp Action Button ──────────────────────────── */}
      <aside aria-label="Direct support channels">
        <a
          href="https://api.whatsapp.com/send?phone=+919319977568&text=Hello%20Team%20OG%20Heavy%20Duty,%20I%20would%20like%20to%20enquire%20about%20your%20Heavy%20Duty%20Air%20Conditioners."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] min-h-[50px] min-w-[50px] flex items-center justify-center"
          aria-label="Chat with OG Heavy Duty on WhatsApp"
        >
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </aside>
    </footer>
  );
}
