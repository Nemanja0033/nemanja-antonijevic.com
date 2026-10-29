import type { Metadata } from "next";
import { alternates, getDictionary, toLocale } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  return { title: getDictionary(lang).contact.title, alternates: alternates(lang, "/contact") };
}

export default function ContactPage() {
  return <main />;
}
