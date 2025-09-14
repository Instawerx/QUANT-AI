import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { TradingChartSection } from "@/components/trading-chart-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsTicker } from "@/components/testimonials-ticker";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default async function Home() {
  const slogan = "QuantTrade AI: The future of automated cryptocurrency trading is here.";
  const mainContent = "Leverage our Multi LLM Neural Network for unparalleled success. Our platform offers real-time monitoring, automated algo robot trading via API, and is built on a resilient cloud infrastructure for high success rates, outperforming old trading bots.";
  
  const testimonials = ["As a beginner, QuantTrade AI made crypto trading accessible and profitable. The AI tools are easy to use, and I've already seen significant gains!"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection slogan={slogan} content={mainContent} />
        <StatsSection />
        <TradingChartSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <TestimonialsTicker testimonials={testimonials} />
      <Footer />
    </div>
  );
}
