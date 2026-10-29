import type { Metadata } from "next";
import { alternates, getDictionary, toLocale } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  return { title: getDictionary(lang).about.title, alternates: alternates(lang, "/about") };
}

export default function AboutPage() {
  return <main />;
}
