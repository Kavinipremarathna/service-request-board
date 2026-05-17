import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { OnboardingBanner } from "@/components/layout/OnboardingBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeBoard — Service Request Board",
  description:
    "Post and browse home service job requests. Connect homeowners with skilled tradespeople.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus-ring"
        >
          Skip to content
        </a>
        <AuthProvider>
          <Navbar />
          <OnboardingBanner />
          <main id="main-content">{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 16px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#f8fafc" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#f8fafc" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
