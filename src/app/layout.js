import { Space_Grotesk, Plus_Jakarta_Sans, Montserrat, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import NavigationProgress from "src/components/core/NavigationProgress";
import ClientTracker from "src/components/core/ClientTracker";
import { connectDB } from "./lib/config";
import GlobalSetting from "./models/GlobalSetting";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata() {
  let faviconUrl = "/favicon.ico";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ogheavyduty.in";

  try {
    await connectDB();
    const settings = await GlobalSetting.findOne().lean();
    if (settings?.favicon) faviconUrl = settings.favicon;
  } catch (e) {
    // MongoDB might not be seeded or reachable during initial build
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "OG Heavy Duty | Heavy-Duty Air Conditioners & Commercial HVAC Solutions",
      template: "%s | OG Heavy Duty",
    },
    description:
      "OG Heavy Duty is India's premier manufacturer of high-ambient heavy-duty air conditioners, including Window ACs, Split ACs, Cassette ACs, Tower ACs, and Commercial HVAC systems engineered for severe high-ambient climates.",
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      title: "OG Heavy Duty | Heavy-Duty Air Conditioners & Commercial HVAC Solutions",
      description:
        "India's trusted heavy-duty cooling manufacturer. High-ambient thermal tolerance, 100% copper coils, Window, Split, Cassette, and Tower ACs for residential and commercial spaces.",
      url: siteUrl,
      siteName: "OG Heavy Duty",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "OG Heavy Duty | Heavy-Duty Air Conditioners & Commercial HVAC Solutions",
      description:
        "India's trusted heavy-duty cooling manufacturer. High-ambient thermal tolerance, 100% copper coils, Window, Split, Cassette, and Tower ACs.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ogheavyduty.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "OG Heavy Duty",
    url: siteUrl,
    logo: `${siteUrl}/images/og-logo.png`,
    description:
      "Manufacturer and supplier of heavy-duty air conditioners, commercial HVAC systems, high-ambient window ACs, and inverter split units.",
    telephone: "011-35727834",
    email: "info@ogheavyduty.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "D-14, Rajan Babu Road, Adarsh Nagar",
      addressLocality: "New Delhi",
      postalCode: "110033",
      addressCountry: "IN",
    },
  };

  return (
    <html
      lang="en"
      className={`antialiased ${spaceGrotesk.variable} ${plusJakartaSans.variable} ${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans font-normal text-slate-800 antialiased selection:bg-blue-600 selection:text-white w-full max-w-full">
        <Script
          id="schema-org-global"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NavigationProgress />
        <ClientTracker />
        {children}
      </body>
    </html>
  );
}
