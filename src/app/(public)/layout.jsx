import Script from "next/script";
import { connectDB } from "src/app/lib/config";
import GlobalSetting from "src/app/models/GlobalSetting";
import PublicHeader from "src/components/public/PublicHeader";
import PublicFooter from "src/components/public/PublicFooter";
import { QuoteModalProvider } from "src/context/QuoteModalContext";

export const revalidate = 300; // ISR: 5 minutes cache

// Resilient settings fetch with 600ms timeout to prevent 10s offline TTFB delay (FINDING-5.4.1-PERF-01)
async function fetchGlobalSettingsFast() {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("DB_TIMEOUT")), 600)
  );

  try {
    return await Promise.race([
      (async () => {
        await connectDB();
        return await GlobalSetting.findOne().lean();
      })(),
      timeoutPromise,
    ]);
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  try {
    const settings = await fetchGlobalSettingsFast();
    const verificationKey = settings?.googleSearchConsoleKey || "";
    if (!verificationKey) return {};

    const match = verificationKey.match(/content=["']([^"']+)["']/i);
    const contentValue = match ? match[1] : verificationKey;

    return {
      verification: {
        google: contentValue,
      },
    };
  } catch {
    return {};
  }
}

export default async function PublicLayout({ children }) {
  let globalSettings = null;

  try {
    const settings = await fetchGlobalSettingsFast();
    if (settings) {
      globalSettings = JSON.parse(JSON.stringify(settings));
    }
  } catch (error) {
    // MongoDB might be unseeded or offline during pre-deployment builds
  }

  // Maintenance Mode Handler
  if (globalSettings?.isMaintenanceMode || globalSettings?.emergencyShutdown) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-[#0f7ae0]/20 text-[#0f7ae0] border border-[#0f7ae0]/40 flex items-center justify-center mb-6 mx-auto">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h1 className="text-3xl font-bold mb-3 tracking-tight">OG Heavy Duty Under Scheduled Maintenance</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
          {globalSettings?.maintenanceMessage ||
            "Our technical team is performing regular infrastructure enhancements. We will be back online shortly."}
        </p>
        <p className="text-xs text-slate-500">
          Direct Inquiries: <a href="mailto:info@ogheavyduty.in" className="text-[#0f7ae0] underline">info@ogheavyduty.in</a> | 011-35727834
        </p>
      </div>
    );
  }

  return (
    <QuoteModalProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#0f7ae0] selection:text-white w-full">
      {/* ─── Accessible Skip-to-Content Link ──────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0f7ae0] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ─── Shared Header ────────────────────────────────────────────── */}
      <PublicHeader settings={globalSettings} />

      {/* ─── Page Content ─────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
        {children}
      </main>

      {/* ─── Shared Footer ────────────────────────────────────────────── */}
      <PublicFooter settings={globalSettings} />

      {/* ─── Google Analytics & Tag Manager (Configured in Global Settings) ─ */}
      {globalSettings?.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${globalSettings.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${globalSettings.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {globalSettings?.googleTagManagerId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${globalSettings.googleTagManagerId}');
          `}
        </Script>
      )}

      {globalSettings?.customHeadCode && (
        <div
          id="custom-head-code"
          dangerouslySetInnerHTML={{ __html: globalSettings.customHeadCode }}
        />
      )}
      {globalSettings?.customBodyCode && (
        <div
          id="custom-body-code"
          dangerouslySetInnerHTML={{ __html: globalSettings.customBodyCode }}
        />
      )}
    </div>
  </QuoteModalProvider>
  );
}

