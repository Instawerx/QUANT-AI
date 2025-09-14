import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { TradingChartSection } from "@/components/trading-chart-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsTicker } from "@/components/testimonials-ticker";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { FaqSection } from "@/components/faq-section";

export default function Home() {
  const staticContent = {
    slogan: "The Future of Trading is Here. Don't Get Left Behind.",
    mainContent: "Leverage our Multi-LLM Neural Network to analyze market data with unprecedented depth and accuracy. Our automated trading bots work for you 24/7, executing trades based on AI-driven insights.",
    testimonials: [
      "QuantTrade AI has completely changed how I approach the market. The AI insights are a game-changer!",
      "As a beginner, I was intimidated by trading, but this platform made it so easy to get started and see results.",
      "The automated bots are incredible. I'm literally making money while I sleep. Highly recommended!",
      "I've been trading for years, and QuantTrade AI is the most powerful tool I've ever used.",
      "The real-time monitoring and resilient infrastructure give me total peace of mind. A must-have for any serious trader."
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
          <HeroSection slogan={staticContent.slogan} content={staticContent.mainContent} />
          <StatsSection />
          <TradingChartSection />
          <FeaturesSection />
          <TestimonialsTicker testimonials={staticContent.testimonials} />
          <CtaSection />
          <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
