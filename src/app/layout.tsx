import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { getGaMeasurementId } from "@/lib/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoEarn — Passive Income Hub | Earn While You Sleep",
  description:
    "AutoEarn builds automated income streams — affiliate marketing, digital products, display ads, and recurring subscriptions — that generate revenue 24/7. Watch your dashboard earn while you sleep.",
  keywords: [
    "passive income",
    "affiliate marketing",
    "digital products",
    "make money online",
    "automated income",
    "side hustle",
    "online business",
    "earn while sleeping",
  ],
  authors: [{ name: "AutoEarn" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "AutoEarn — Earn While You Sleep",
    description:
      "A complete passive income website with affiliate store, digital products, blog, newsletter, and a live revenue dashboard.",
    siteName: "AutoEarn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoEarn — Earn While You Sleep",
    description:
      "A complete passive income website with affiliate store, digital products, blog, newsletter, and a live revenue dashboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = getGaMeasurementId();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname + window.location.hash,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
