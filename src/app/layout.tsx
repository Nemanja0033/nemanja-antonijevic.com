import type { Metadata } from "next";
import { IBM_Plex_Mono, Nunito } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.author, url: site.url }],
  openGraph: { type: "website", siteName: site.name, locale: "sr_RS" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr-Latn" className={`${nunito.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
