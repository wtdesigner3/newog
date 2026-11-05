import {
  PageContainer,
  SectionContainer,
  SectionHeading,
  Breadcrumbs,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  NotFoundState,
} from "src/components/public";
import {
  Shield,
  Thermometer,
  Zap,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Palette,
  Type,
  Layout,
  MousePointer,
  Component,
} from "lucide-react";

export const metadata = {
  title: "Design System Showcase | OG Heavy Duty",
  description: "Internal design system tokens, typography, and reusable layout components.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemShowcase() {
  const breadcrumbItems = [
    { label: "Design System", href: "/design-system" },
    { label: "Component Library" },
  ];

  const brandColors = [
    { name: "Brand Blue (Primary)", hex: "#0f7ae0", class: "bg-[#0f7ae0]", text: "text-white", role: "Primary CTAs, Active Nav, Brand Identity" },
    { name: "Brand Blue Hover", hex: "#0c68c2", class: "bg-[#0c68c2]", text: "text-white", role: "Button Hover, Interactive Focus" },
    { name: "Deep Navy (Hero & Footer)", hex: "#0B132B", class: "bg-[#0B132B]", text: "text-white", role: "Hero Backgrounds, Footer, High-Contrast Cards" },
    { name: "Neutral Dark", hex: "#0f172a", class: "bg-[#0f172a]", text: "text-white", role: "Technical Section Backgrounds" },
    { name: "Deep Charcoal (Text)", hex: "#111827", class: "bg-[#111827]", text: "text-white", role: "Page Headings (H1-H3), Card Titles" },
    { name: "Cool Muted Gray", hex: "#666666", class: "bg-[#666666]", text: "text-white", role: "Body Paragraphs, Secondary Specs" },
    { name: "Light Surface", hex: "#f8fafc", class: "bg-[#f8fafc]", text: "text-slate-900 border border-slate-200", role: "Alternating Section Surfaces, Card Wells" },
    { name: "Border Neutral", hex: "#e2e8f0", class: "bg-[#e2e8f0]", text: "text-slate-800", role: "Card Outlines, Section Dividers, Table Lines" },
  ];

  return (
    <div className="w-full">
      {/* ─── Hero Header ────────────────────────────────────────────── */}
      <SectionContainer variant="dark" padding="sm" className="border-b border-slate-800">
        <PageContainer>
          <Breadcrumbs items={breadcrumbItems} theme="dark" />
          <div className="py-6 sm:py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0f7ae0]/20 text-[#0f7ae0] border border-[#0f7ae0]/30 mb-3">
              <Component size={14} />
              <span>Phase 5.1 Foundation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Public Website Design System
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Industrial, engineering-focused design tokens and accessible component primitives for OG Heavy Duty. Governed by clean typography, Brand Blue (<span className="text-[#0f7ae0] font-mono">#0f7ae0</span>), and Deep Navy (<span className="text-blue-300 font-mono">#0B132B</span>).
            </p>
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── Section 1: Brand Color Tokens ──────────────────────────── */}
      <SectionContainer variant="white" padding="md" id="colors">
        <PageContainer>
          <SectionHeading
            badge="COLOR TOKENS"
            title="Industrial Brand Palette"
            description="High-contrast, durable color language tailored for engineering authority, high-ambient cooling hardware, and commercial trust."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brandColors.map((color) => (
              <div
                key={color.hex}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`h-24 w-full flex items-end p-3 ${color.class}`}>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm text-white`}>
                    {color.hex}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900">{color.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{color.role}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── Section 2: Typography Hierarchy ────────────────────────── */}
      <SectionContainer variant="muted" padding="md" id="typography">
        <PageContainer>
          <SectionHeading
            badge="TYPOGRAPHY"
            title="Poppins Typographic Scale"
            description="Loaded via Next.js Google Fonts with zero cumulative layout shift. Clear hierarchy balancing industrial boldness and technical legibility."
            align="left"
          />

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-mono text-[#0f7ae0] block mb-1">Display H1 — font-extrabold / 48px</span>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">
                High-Ambient Heavy Duty Cooling Up To 52°C
              </p>
            </div>

            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-mono text-[#0f7ae0] block mb-1">Section Title H2 — font-bold / 36px</span>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] tracking-tight">
                Commercial &amp; Institutional Air Conditioning
              </p>
            </div>

            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-mono text-[#0f7ae0] block mb-1">Sub-heading H3 — font-semibold / 26px</span>
              <p className="text-xl sm:text-2xl font-semibold text-[#1a1a1a]">
                100% Grooved Copper Condenser Coils for Maximum Heat Transfer
              </p>
            </div>

            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-mono text-[#0f7ae0] block mb-1">Card Title H4 — font-semibold / 18px</span>
              <p className="text-lg font-semibold text-[#1a1a1a]">
                OG-W24H 2.0 Ton High-Tonnage Window Air Conditioner
              </p>
            </div>

            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-mono text-[#0f7ae0] block mb-1">Body Text — font-normal / 15-16px / line-height 1.65</span>
              <p className="text-base text-[#666666] leading-relaxed max-w-3xl">
                Engineered specifically for the demanding Indian climate, OG Heavy Duty units maintain rated cooling capacity even during peak 50°C+ heatwaves. Built with heavy-gauge sheet metal, anti-corrosive hydrophilic fins, and high-efficiency rotary compressors.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono text-[#0f7ae0] block mb-2">Pill Badges &amp; Metadata — font-semibold / 12px / uppercase</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#0f7ae0] border border-blue-200">
                  Heavy Duty Series
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0B132B] text-white">
                  100% Copper
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  BEE 5-Star Rated
                </span>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── Section 3: Buttons & Interactive Elements ──────────────── */}
      <SectionContainer variant="white" padding="md" id="buttons">
        <PageContainer>
          <SectionHeading
            badge="INTERACTIVE COMPONENTS"
            title="Button Variants & Touch Targets"
            description="Tactile, high-contrast buttons with min 44px touch targets on mobile viewports and visible focus states for keyboard accessibility."
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Buttons */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                PrimaryButton Variants
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryButton variant="primary" size="md" icon={true}>
                  Brand Blue (Primary)
                </PrimaryButton>
                <PrimaryButton variant="navy" size="md" icon={true}>
                  Deep Navy (CTA)
                </PrimaryButton>
                <PrimaryButton variant="dark" size="md">
                  Midnight Dark
                </PrimaryButton>
              </div>

              <div className="pt-2">
                <p className="text-xs font-mono text-slate-500 mb-2">Size Scale:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <PrimaryButton size="sm">Small (36px)</PrimaryButton>
                  <PrimaryButton size="md">Medium (44px)</PrimaryButton>
                  <PrimaryButton size="lg" icon={true}>Large (50px)</PrimaryButton>
                </div>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                SecondaryButton Variants
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <SecondaryButton variant="outline" size="md">
                  Blue Outline
                </SecondaryButton>
                <SecondaryButton variant="white" size="md">
                  White Card Style
                </SecondaryButton>
                <SecondaryButton variant="ghost" size="md">
                  Ghost Action
                </SecondaryButton>
              </div>

              <div className="pt-2">
                <p className="text-xs font-mono text-slate-500 mb-2">Disabled State:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <PrimaryButton disabled={true}>Disabled Primary</PrimaryButton>
                  <SecondaryButton disabled={true}>Disabled Secondary</SecondaryButton>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── Section 4: Card Component Standards ────────────────────── */}
      <SectionContainer variant="muted" padding="md" id="cards">
        <PageContainer>
          <SectionHeading
            badge="SURFACE SYSTEM"
            title="Industrial Card Primitives"
            description="Card layouts establishing consistent border radiuses, subtle elevation shadows, and technical specification grids."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[#e8f2fc] text-[#0f7ae0] flex items-center justify-center mb-4">
                <Thermometer size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">High-Ambient Thermal Operation</h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-4">
                Heavy-duty tropicalized compressors maintain stable suction and discharge pressures under severe summer ambient temperatures.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f7ae0]">
                <span>Engineered for Indian Conditions</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </span>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0f7ae0] flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">100% Inner-Grooved Copper</h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-4">
                Pure copper tubes with internal rifling provide up to 30% greater surface contact area, accelerating heat exchange efficiency.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f7ae0]">
                <span>Zero Aluminium Compromise</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </span>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[#111827] text-white flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Low Voltage Surge Guard</h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-4">
                Wide operational voltage window (145V - 285V) protects electronics against sudden Indian grid fluctuations and surges.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                <span>In-Built Stabilizer Free</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </span>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── Section 5: Form Elements ───────────────────────────────── */}
      <SectionContainer variant="white" padding="md" id="forms">
        <PageContainer>
          <SectionHeading
            badge="INPUT CONTROLS"
            title="Form Inputs & Data Entry"
            description="Consistent styling for enquiries, customer contact forms, and career application uploads."
            align="left"
          />

          <div className="max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            <form action="#" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name-demo" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-[#0f7ae0]">*</span>
                  </label>
                  <input
                    id="name-demo"
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="phone-demo" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Phone <span className="text-[#0f7ae0]">*</span>
                  </label>
                  <input
                    id="phone-demo"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="product-demo" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Interested AC Category
                </label>
                <select
                  id="product-demo"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all"
                >
                  <option>Window Air Conditioners (High Ambient)</option>
                  <option>Split Air Conditioners (Inverter / Fixed)</option>
                  <option>Cassette Air Conditioners (Commercial)</option>
                  <option>Floor Standing / Tower Units</option>
                  <option>Ductable Central Units</option>
                </select>
              </div>

              <div>
                <label htmlFor="message-demo" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Project Requirements
                </label>
                <textarea
                  id="message-demo"
                  rows={3}
                  placeholder="Specify cooling tonnage, application area, or site location..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Protected by Google reCAPTCHA v3
                </span>
                <PrimaryButton variant="primary" size="md" icon={true}>
                  Submit Enquiry
                </PrimaryButton>
              </div>
            </form>
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── Section 6: Loading & Empty States ──────────────────────── */}
      <SectionContainer variant="muted" padding="md" id="states">
        <PageContainer>
          <SectionHeading
            badge="STATE FEEDBACK"
            title="Feedback & Status States"
            description="Built-in states for network loading, empty queries, and route 404s."
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b">
                LoadingState Component (Spinner)
              </h3>
              <LoadingState type="spinner" message="Fetching OG Heavy Duty technical catalog..." />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b">
                NotFoundState Component (Empty)
              </h3>
              <NotFoundState
                title="Model Not Found"
                description="The specified air conditioner model code could not be verified in the active catalog."
                actionText="Back to Catalog"
                actionHref="/products/split-ac"
              />
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
