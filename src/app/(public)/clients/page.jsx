import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Shield,
  Radio,
  School,
  HeartPulse,
  Flame,
  Train,
  CheckCircle2,
  PhoneCall,
  Mail,
  ArrowRight,
  FileCheck,
} from "lucide-react";

import {
  PublicPageBanner,
  PageContainer,
  SectionContainer,
  SectionHeading,
  PrimaryButton,
} from "src/components/public";

export const revalidate = 3600; // 1 hour ISR

export const metadata = {
  title: "Our Prestigious Clients | OG Heavy Duty — Institutional & Commercial Air Conditioners",
  description:
    "View the premier government ministries, central universities, public sector undertakings (PSUs), and financial institutions across India that trust OG Heavy Duty air conditioners.",
  alternates: {
    canonical: "https://ogheavyduty.in/clients",
  },
  openGraph: {
    title: "Our Prestigious Clients | OG Heavy Duty",
    description:
      "Premier government ministries, central universities, public sector undertakings, and financial institutions across India that trust OG Heavy Duty air conditioners.",
    url: "https://ogheavyduty.in/clients",
    siteName: "OG Heavy Duty",
    type: "website",
    images: [
      {
        url: "/uploads/banner/1649073538_download.jpg",
        width: 1200,
        height: 630,
        alt: "OG Heavy Duty Institutional Clients",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Prestigious Clients | OG Heavy Duty",
    description:
      "Premier government ministries, central universities, public sector undertakings, and financial institutions across India that trust OG Heavy Duty air conditioners.",
    images: ["/uploads/banner/1649073538_download.jpg"],
  },
  robots: "index, follow",
};

// 10 Verified Client Categories with authentic logo files from public/uploads/client/ (66 Clients)
export const CLIENT_SECTORS = [
  {
    id: "banks",
    title: "Public Sector Banks & Financial Institutions",
    subtitle: "Heavy-duty climate control for currency chests, data server rooms, and retail branch networks across India",
    icon: Landmark,
    clients: [
      { name: "Aryavart Bank (Arya Bank)", image: "/uploads/client/1691642809_arya bank.jpg" },
      { name: "Bank of Baroda (BOB)", image: "/uploads/client/1691642816_bob bank.jpg" },
      { name: "Canara Bank", image: "/uploads/client/1691642824_canara bank.jpg" },
      { name: "Central Bank of India", image: "/uploads/client/1691642832_central bank.jpg" },
      { name: "Bank of Maharashtra", image: "/uploads/client/1691642839_maharastra bank.jpg" },
      { name: "Punjab & Sind Bank", image: "/uploads/client/1691642846_p and s bank.jpg" },
      { name: "Punjab National Bank (PNB)", image: "/uploads/client/1691642854_pnb.jpg" },
      { name: "Baroda UP Gramin / Rural Bank", image: "/uploads/client/1691642862_rural bank.jpg" },
      { name: "State Bank of India (SBI)", image: "/uploads/client/1691642872_sbi.jpg" },
      { name: "Small Industries Development Bank of India (SIDBI)", image: "/uploads/client/1691642907_sidbibank.jpg" },
      { name: "Union Bank of India", image: "/uploads/client/1691642914_union bank.jpg" },
      { name: "UP Cooperative Bank", image: "/uploads/client/1691642929_up bank.jpg" }
    ],
  },
  {
    id: "universities",
    title: "Higher Education & Central Universities",
    subtitle: "Installed in premier lecture auditoriums, advanced research faculties, and sprawling academic complexes",
    icon: GraduationCap,
    clients: [
      { name: "Assam Agricultural University (AAU)", image: "/uploads/client/1691581479_aau university.jpg" },
      { name: "Sardar Vallabhbhai Patel Agricultural University", image: "/uploads/client/1691581487_agricultural university.jpg" },
      { name: "Dr. B.R. Ambedkar University Delhi", image: "/uploads/client/1691581497_Ambedkar University.jpg" },
      { name: "Chandra Shekhar Azad University", image: "/uploads/client/1691581719_Chandra_Shekhar_Azad_University.jpg" },
      { name: "Delhi University (DU)", image: "/uploads/client/1691581726_Du.jpg" },
      { name: "Deen Dayal Upadhyaya Gorakhpur University", image: "/uploads/client/1691581734_Gorakhpur_university.jpg" },
      { name: "Indian Institute of Technology Jodhpur (IIT)", image: "/uploads/client/1691581741_IIT jodhpur.jpg" },
      { name: "Jamia Millia Islamia", image: "/uploads/client/1691581751_Jamia.jpg" },
      { name: "Jawaharlal Nehru University (JNU)", image: "/uploads/client/1691581759_jnu.jpg" },
      { name: "Lal Bahadur Shastri National Academy / University", image: "/uploads/client/1691581766_lalbahadur university.jpg" },
      { name: "Maharaja Sayajirao University", image: "/uploads/client/1691581774_maharaja university.jpg" },
      { name: "Dr. Panjabrao Deshmukh Krishi Vidyapeeth", image: "/uploads/client/1691581780_panjabrao university.jpg" },
      { name: "Panjab University Chandigarh", image: "/uploads/client/1691581787_punjab university.jpg" },
      { name: "Annamalai University", image: "/uploads/client/1691581506_annamaali university.jpg" },
      { name: "BML Munjal University (BMU)", image: "/uploads/client/1691581514_BMU.jpg" }
    ],
  },
  {
    id: "railways",
    title: "Indian Railways & Mass Transit Infrastructure",
    subtitle: "Continuous cooling duty across administrative railway headquarters, passenger terminals, and reservation hubs",
    icon: Train,
    clients: [
      { name: "Central Railway", image: "/uploads/client/1696507178_central-railway.jpg" },
      { name: "Indian Railway Catering & Tourism Corp (IRCTC)", image: "/uploads/client/1696507201_irctc.jpg" },
      { name: "West Central Railway (Madhya Railway)", image: "/uploads/client/1696507253_madhyarail.jpg" },
      { name: "Ministry of Railways (Govt. of India)", image: "/uploads/client/1696507279_ministry-railways.jpg" },
      { name: "Northern Railway", image: "/uploads/client/1696507295_north-railway.jpg" },
      { name: "Western Railway", image: "/uploads/client/1696507303_western-railway.jpg" }
    ],
  },
  {
    id: "petroleum",
    title: "Petroleum, Oil & Gas Navratna PSUs",
    subtitle: "Explosion-resistant and tropical high-ambient cooling for refineries, pipeline offices, and distribution terminals",
    icon: Flame,
    clients: [
      { name: "Bharat Petroleum Corporation Limited (BPCL)", image: "/uploads/client/1696507002_bp.jpg" },
      { name: "Hindustan Petroleum Corporation Limited (HPCL)", image: "/uploads/client/1696507025_hp.jpg" },
      { name: "Indian Oil Corporation Limited (IOCL)", image: "/uploads/client/1696507092_io.jpg" },
      { name: "Oil and Natural Gas Corporation (ONGC)", image: "/uploads/client/1696507114_ongc.jpg" }
    ],
  },
  {
    id: "defense",
    title: "Defense, Border Security & Armed Forces",
    subtitle: "Mission-critical air conditioning deployed across strategic air force stations and border security outposts",
    icon: ShieldCheck,
    clients: [
      { name: "Indian Air Force Base Command (AF 1)", image: "/uploads/client/1696506019_af1.jpg" },
      { name: "Indian Air Force Station (AF 2)", image: "/uploads/client/1696506023_af2.jpg" },
      { name: "Indian Air Force Technical Wing (AF 3)", image: "/uploads/client/1696506028_af3.jpg" },
      { name: "Indian Air Force Training Command (AF 4)", image: "/uploads/client/1696506032_af4.jpg" }
    ],
  },
  {
    id: "government",
    title: "Central Government Ministries & National Public Works",
    subtitle: "Supplied to central CPWD projects, cabinet ministries, and national regulatory authorities",
    icon: Building2,
    clients: [
      { name: "Department of Chemicals & Petrochemicals", image: "/uploads/client/1696507485_chemical.jpg" },
      { name: "Central Public Works Department (CPWD)", image: "/uploads/client/1696507495_cpwd.jpg" },
      { name: "Central Warehousing Development Board (CWDB)", image: "/uploads/client/1696507531_cwdb.jpg" },
      { name: "Ministry of Electronics & Information Technology", image: "/uploads/client/1696507550_itandc.jpg" },
      { name: "Jammu & Kashmir Government Directorate", image: "/uploads/client/1696507562_jandk.jpg" },
      { name: "Quality Council of India (QCI)", image: "/uploads/client/1696507600_qci.jpg" },
      { name: "National Skill & Technical Training Institute", image: "/uploads/client/1696507610_training.jpg" }
    ],
  },
  {
    id: "insurance",
    title: "Insurance, Healthcare & Public Corporations",
    subtitle: "Reliable continuous climate control for national insurance headquarters, hospital wards, and service boards",
    icon: HeartPulse,
    clients: [
      { name: "Employees' State Insurance Corporation (ESIC)", image: "/uploads/client/1696506179_esic.jpg" },
      { name: "Life Insurance Corporation of India (LIC)", image: "/uploads/client/1696506201_lic.jpg" },
      { name: "United India Insurance Company (UIICL)", image: "/uploads/client/1696506210_uiicl.jpg" }
    ],
  },
  {
    id: "broadcasting",
    title: "National Broadcasting & Media Organizations",
    subtitle: "Ultra-quiet vibration-free cooling engineered for broadcast recording studios, transmission hubs, and newsrooms",
    icon: Radio,
    clients: [
      { name: "All India Radio (AIR / Prasar Bharati)", image: "/uploads/client/1691648243_air.jpg" },
      { name: "Broadcast Engineering Consultants / Bharti", image: "/uploads/client/1691648250_bharti brodcasting.jpg" },
      { name: "Sadhna Media Network", image: "/uploads/client/1691648269_sadhna.jpg" },
      { name: "Doordarshan (National Broadcaster)", image: "/uploads/client/1691648263_durdarshan.jpg" }
    ],
  },
  {
    id: "schools",
    title: "Renowned Schools & Educational Foundations",
    subtitle: "Energy-efficient classroom and auditorium climate systems across leading public school chains and institutions",
    icon: School,
    clients: [
      { name: "Model School Rohtak", image: "/uploads/client/1691647827_rohtak school.jpg" },
      { name: "Delhi Model School", image: "/uploads/client/1691647833_school delhi.jpg" },
      { name: "St. Anthony's Senior Secondary School", image: "/uploads/client/1691647765_antony school.jpg" },
      { name: "G.D. Goenka Public School", image: "/uploads/client/1691647773_goenka school.jpg" },
      { name: "Kendriya Vidyalaya (KV School)", image: "/uploads/client/1691647786_kv school.jpg" },
      { name: "National Institute of Open Schooling (NIOS)", image: "/uploads/client/1691647791_nios.jpg" },
      { name: "Orleans Public School", image: "/uploads/client/1691647801_orlean school.jpg" },
      { name: "School of Planning and Architecture (SPA)", image: "/uploads/client/1691647810_planning school.jpg" },
      { name: "Tyagi Public School", image: "/uploads/client/1691647842_tyagi school.jpg" }
    ],
  },
  {
    id: "police",
    title: "State Police & Public Administration",
    subtitle: "Reliable commercial cooling units supporting state administration centers and law enforcement facilities",
    icon: Shield,
    clients: [
      { name: "Border Security Force (BSF)", image: "/uploads/client/1696507338_bsf.jpg" },
      { name: "Uttar Pradesh Police & Administration", image: "/uploads/client/1696507410_up.jpg" }
    ],
  }
];

export default function ClientsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Our Clients" },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://ogheavyduty.in/clients#webpage",
        "url": "https://ogheavyduty.in/clients",
        "name": "Our Prestigious Clients | OG Heavy Duty",
        "description":
          "Premier universities, government agencies, banks, and enterprises equipped with OG Heavy Duty climate engineering systems.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://ogheavyduty.in/#website",
          "name": "OG Heavy Duty",
          "url": "https://ogheavyduty.in",
        },
        "about": {
          "@type": "Organization",
          "name": "OG Heavy Duty",
          "url": "https://ogheavyduty.in",
          "logo": "https://ogheavyduty.in/images/og-logo.png",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ogheavyduty.in/clients#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://ogheavyduty.in",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Our Clients",
            "item": "https://ogheavyduty.in/clients",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─── 1. PAGE BANNER ─── */}
      <PublicPageBanner
        title="Our Prestigious Clients"
        subtitle="Over 50,000 commercial cooling units deployed across central government ministries, prestigious national universities, public sector undertakings, and leading banks."
        badge="PRESTIGIOUS CLIENTELE"
        bgImage="/uploads/breadcrumb/1648811556_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── 2. SECTOR-BY-SECTOR CLIENT MATRIX: Colorful Logos by Default ─── */}
      <SectionContainer variant="gray" className="py-[60px]">
        <PageContainer>
          <div className="space-y-16">
            {CLIENT_SECTORS.map((sector) => {
              const Icon = sector.icon;

              return (
                <div key={sector.id} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-start gap-4 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e8f2fc] text-[#0f7ae0] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 tracking-tight">
                        {sector.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
                        {sector.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Logo Cards Grid - Colorful by Default (No Grayscale / No Dark Filter) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sector.clients.map((client, idx) => (
                      <div
                        key={idx}
                        className="group bg-white rounded-xl border border-slate-200/90 p-4 flex flex-col items-center justify-center aspect-[4/3] hover:border-[#0f7ae0] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center cursor-default"
                        title={client.name}
                      >
                        <div className="relative w-full h-16 flex items-center justify-center mb-2">
                          <Image
                            src={client.image}
                            alt={client.name}
                            width={140}
                            height={70}
                            unoptimized={true}
                            className="max-h-14 w-auto object-contain transition-all duration-200 group-hover:scale-105"
                          />
                        </div>
                        <p className="text-[11px] font-semibold text-slate-700 line-clamp-1 group-hover:text-[#0f7ae0] transition-colors">
                          {client.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── 3. TRADEMARK & LEGAL DISCLAIMER ─── */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 text-slate-600 text-xs font-semibold mb-3">
              <FileCheck size={14} />
              <span>Trademark &amp; Installation Record Notice</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              All company logos, institutional crests, university seals, and trademarks displayed on this page belong exclusively to their respective corporate, government, and educational entities. Their display acknowledges verified institutional installations and equipment procurement fulfilled by OG Heavy Duty and its authorized national dealer network.
            </p>
          </div>
        </PageContainer>
      </SectionContainer>

      {/* ─── 4. INSTITUTIONAL PROCUREMENT CALL TO ACTION ─── */}
      <SectionContainer variant="dark" className="py-[60px]">
        <PageContainer size="wide">
          <div className="rounded-3xl bg-[#0B132B] border border-slate-700/80 p-8 sm:p-12 lg:p-16 text-white text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-400">
                GOVERNMENT &amp; INSTITUTIONAL TENDERS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Planning a Commercial or Public Sector Procurement?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Our institutional sales division provides prompt technical submittals, heat load calculations, customized dimensional drawings, and formal commercial quotations for GeM and institutional tenders.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <PrimaryButton
                href="/contact-us"
                variant="primary"
                size="lg"
                icon={true}
              >
                Request Institutional Quotation
              </PrimaryButton>

              <a
                href="mailto:sales@ogheavyduty.in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white font-medium text-base hover:bg-white/10 transition-colors"
              >
                <Mail size={18} />
                <span>Email Tender Desk</span>
              </a>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
