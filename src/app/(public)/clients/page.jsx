import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Radio,
  School,
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
  title: "Our Prestigious Clients | OG Heavy Duty — Institutional & Commercial HVAC",
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

// 6 Verified Client Categories with authentic logo files from public/uploads/client/
export const CLIENT_SECTORS = [
  {
    id: "universities",
    title: "Higher Education & Central Universities",
    subtitle: "Installed in premier lecture auditoriums, research faculties, and campus complexes",
    icon: GraduationCap,
    clients: [
      { name: "Delhi University (DU)", image: "/uploads/client/1691581726_Du.jpg" },
      { name: "Jawaharlal Nehru University (JNU)", image: "/uploads/client/1691581759_jnu.jpg" },
      { name: "Jamia Millia Islamia", image: "/uploads/client/1691581751_Jamia.jpg" },
      { name: "IIT Jodhpur", image: "/uploads/client/1691581741_IIT jodhpur.jpg" },
      { name: "BML Munjal University (BMU)", image: "/uploads/client/1691581514_BMU.jpg" },
      { name: "Dr. B.R. Ambedkar University Delhi", image: "/uploads/client/1691581497_Ambedkar University.jpg" },
      { name: "Punjab University", image: "/uploads/client/1691581787_punjab university.jpg" },
      { name: "Gorakhpur University", image: "/uploads/client/1691581734_Gorakhpur_university.jpg" },
      { name: "Annamalai University", image: "/uploads/client/1691581506_annamaali university.jpg" },
      { name: "Chandra Shekhar Azad University", image: "/uploads/client/1691581719_Chandra_Shekhar_Azad_University.jpg" },
      { name: "Lal Bahadur Shastri National Academy / University", image: "/uploads/client/1691581766_lalbahadur university.jpg" },
      { name: "Maharaja University", image: "/uploads/client/1691581774_maharaja university.jpg" },
      { name: "Dr. Panjabrao Deshmukh University", image: "/uploads/client/1691581780_panjabrao university.jpg" },
      { name: "Assam Agricultural University (AAU)", image: "/uploads/client/1691581479_aau university.jpg" },
      { name: "Agricultural University", image: "/uploads/client/1691581487_agricultural university.jpg" },
    ],
  },
  {
    id: "government-psu",
    title: "Government Ministries & Public Sector Enterprises",
    subtitle: "Supplied to central government ministries, defense bodies, and national infrastructure enterprises",
    icon: Building2,
    clients: [
      { name: "Ministry of Railways", image: "/uploads/client/1696507279_ministry-railways.jpg" },
      { name: "IRCTC", image: "/uploads/client/1696507201_irctc.jpg" },
      { name: "Northern Railway", image: "/uploads/client/1696507295_north-railway.jpg" },
      { name: "Western Railway", image: "/uploads/client/1696507303_western-railway.jpg" },
      { name: "Central Railway", image: "/uploads/client/1696507178_central-railway.jpg" },
      { name: "Central Public Works Department (CPWD)", image: "/uploads/client/1696507495_cpwd.jpg" },
      { name: "Oil and Natural Gas Corporation (ONGC)", image: "/uploads/client/1696507114_ongc.jpg" },
      { name: "Indian Oil Corporation (IOCL)", image: "/uploads/client/1696507092_io.jpg" },
      { name: "Bharat Petroleum (BPCL)", image: "/uploads/client/1696507002_bp.jpg" },
      { name: "Hindustan Petroleum (HPCL)", image: "/uploads/client/1696507025_hp.jpg" },
      { name: "Border Security Force (BSF)", image: "/uploads/client/1696507338_bsf.jpg" },
      { name: "Ministry of Communications & IT", image: "/uploads/client/1696507550_itandc.jpg" },
      { name: "Central Warehousing Development Board (CWDB)", image: "/uploads/client/1696507531_cwdb.jpg" },
      { name: "Ministry of Chemicals & Fertilizers", image: "/uploads/client/1696507485_chemical.jpg" },
    ],
  },
  {
    id: "banking",
    title: "Public Sector Banks & Financial Institutions",
    subtitle: "Serving regional administrative hubs, data centers, and major branch offices",
    icon: Landmark,
    clients: [
      { name: "State Bank of India (SBI)", image: "/uploads/client/1691642872_sbi.jpg" },
      { name: "Punjab National Bank (PNB)", image: "/uploads/client/1691642854_pnb.jpg" },
      { name: "Canara Bank", image: "/uploads/client/1691642824_canara bank.jpg" },
      { name: "Bank of Baroda (BOB)", image: "/uploads/client/1691642816_bob bank.jpg" },
      { name: "Central Bank of India", image: "/uploads/client/1691642832_central bank.jpg" },
      { name: "Bank of Maharashtra", image: "/uploads/client/1691642839_maharastra bank.jpg" },
      { name: "Punjab & Sind Bank", image: "/uploads/client/1691642846_p and s bank.jpg" },
      { name: "SIDBI Bank", image: "/uploads/client/1691642907_sidbibank.jpg" },
      { name: "Union Bank of India", image: "/uploads/client/1691642914_union bank.jpg" },
      { name: "Aryavart Bank / Arya Bank", image: "/uploads/client/1691642809_arya bank.jpg" },
      { name: "UP Gramin / Rural Bank", image: "/uploads/client/1691642929_up bank.jpg" },
    ],
  },
  {
    id: "healthcare-institutions",
    title: "Healthcare, Insurance & Public Bodies",
    subtitle: "Continuous 24/7 cooling for diagnostic centers, hospitals, and national agencies",
    icon: ShieldCheck,
    clients: [
      { name: "Employees' State Insurance Corporation (ESIC)", image: "/uploads/client/1696506179_esic.jpg" },
      { name: "Life Insurance Corporation of India (LIC)", image: "/uploads/client/1696506201_lic.jpg" },
      { name: "United India Insurance Company (UIICL)", image: "/uploads/client/1696506210_uiicl.jpg" },
      { name: "Quality Council of India (QCI)", image: "/uploads/client/1696507600_qci.jpg" },
    ],
  },
  {
    id: "broadcasting-media",
    title: "National Broadcasting & Media Organizations",
    subtitle: "Cooling national transmission hubs, broadcasting rooms, and media houses",
    icon: Radio,
    clients: [
      { name: "Doordarshan (National Broadcaster)", image: "/uploads/client/1691648263_durdarshan.jpg" },
      { name: "All India Radio (AIR / Prasar Bharati)", image: "/uploads/client/1691648243_air.jpg" },
      { name: "Broadcast Engineering Consultants / Bharti", image: "/uploads/client/1691648250_bharti brodcasting.jpg" },
      { name: "Sadhna Media Network", image: "/uploads/client/1691648269_sadhna.jpg" },
    ],
  },
  {
    id: "schools-academies",
    title: "Schools & Educational Foundations",
    subtitle: "Trusted across renowned senior secondary institutions and national open academies",
    icon: School,
    clients: [
      { name: "Kendriya Vidyalaya (KV School)", image: "/uploads/client/1691647786_kv school.jpg" },
      { name: "GD Goenka Public School", image: "/uploads/client/1691647773_goenka school.jpg" },
      { name: "St. Anthony's School", image: "/uploads/client/1691647765_antony school.jpg" },
      { name: "National Institute of Open Schooling (NIOS)", image: "/uploads/client/1691647791_nios.jpg" },
      { name: "School of Planning and Architecture", image: "/uploads/client/1691647810_planning school.jpg" },
      { name: "Orleans Public School", image: "/uploads/client/1691647801_orlean school.jpg" },
      { name: "Rohtak Model School", image: "/uploads/client/1691647827_rohtak school.jpg" },
      { name: "Tyagi Public School", image: "/uploads/client/1691647842_tyagi school.jpg" },
    ],
  },
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
          "Directory of verified government ministries, universities, public sector enterprises, and banks equipped with OG Heavy Duty air conditioning systems.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://ogheavyduty.in/#website",
          "url": "https://ogheavyduty.in",
          "name": "OG Heavy Duty",
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
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
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─── 1. PAGE BANNER ────────────────────────────────────────────── */}
      <PublicPageBanner
        title="Trusted by India's Foremost Institutions & Enterprises"
        subtitle="Over 50,000 commercial cooling units deployed across central government ministries, prestigious national universities, public sector undertakings, and leading banks."
        badge="PRESTIGIOUS CLIENTELE"
        bgImage="/uploads/breadcrumb/1648811556_download.jpg"
        breadcrumbItems={breadcrumbs}
      />

      {/* ─── 2. SECTOR-BY-SECTOR CLIENT MATRIX: Standardized 60px Spacing ─────────────── */}
      <SectionContainer variant="gray" className="py-[60px]">
        <PageContainer>
          <div className="space-y-16">
            {CLIENT_SECTORS.map((sector) => {
              const Icon = sector.icon;

              return (
                <div key={sector.id} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-start gap-4 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e8f2fc] text-[#0f7ae0] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
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

                  {/* Logo Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sector.clients.map((client, idx) => (
                      <div
                        key={idx}
                        className="group bg-white rounded-xl border border-slate-200/90 p-4 flex flex-col items-center justify-center aspect-[4/3] hover:border-[#0f7ae0]/60 hover:shadow-md transition-all duration-200 text-center"
                        title={client.name}
                      >
                        <div className="relative w-full h-16 flex items-center justify-center mb-2">
                          <Image
                            src={client.image}
                            alt={client.name}
                            width={140}
                            height={70}
                            className="max-h-14 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
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

          {/* ─── 3. TRADEMARK & LEGAL DISCLAIMER ───────────────────────── */}
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

      {/* ─── 4. INSTITUTIONAL PROCUREMENT CALL TO ACTION: Standardized 60px Spacing ───── */}
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
                <Mail size={18} className="text-[#0f7ae0]" />
                <span>sales@ogheavyduty.in</span>
              </a>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}

