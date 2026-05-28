import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { DemoBanner } from "@/components/demo-banner";
import { TicketWidget } from "@/components/ticket-widget";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BigSkyHarvest — Find harvest help. Live the harvest dream.",
  description:
    "The connector between Montana farms that can't find help and people who'd give up a summer to drive a combine. Free to post. Free to apply. Free forever.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DemoBanner />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
          BigSkyHarvest · Big Sky country, harvest season · Free to post. Free to apply. Always.
        </footer>
        <Toaster />
        <TicketWidget />
      </body>
    </html>
  );
}
