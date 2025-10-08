'use client';

export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FaqSection } from "@/components/faq-section";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
