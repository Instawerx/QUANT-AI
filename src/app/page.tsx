import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { TradingChartSection } from "@/components/trading-chart-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsTicker } from "@/components/testimonials-ticker";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SignUpToast } from "@/components/signup-toast";
import { SignupChatbot } from "@/components/signup-chatbot";
import { FaqSection } from "@/components/faq-section";
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content";
import { simulateUserTestimonials } from "@/ai/flows/simulate-user-testimonials";

export default async function Home() {
  const marketingInfo = await generateMarketingContent({
    productName: "QuantTrade AI",
    uniqueFeatures: [
      "Multi-LLM Neural Network",
      "Automated Algo-Trading Bots",
      "Resilient Cloud Infrastructure",
      "Real-Time Monitoring",
    ],
    advantages: [
      "Unparalleled success rates",
      "24/7 automated trading",
      "High-availability and scalability",
      "Live portfolio and AI performance tracking",
    ],
  });

  const slogan = marketingInfo.marketingContent.split('Slogan: "')[1].split('"')[0];
  const mainContent = marketingInfo.marketingContent.split('"\n\n')[1];
  
  const testimonialsData = await simulateUserTestimonials({});
  const testimonials = testimonialsData.testimonials.map(t => t.testimonial);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection slogan={slogan} content={mainContent} />
        <StatsSection />
        <TradingChartSection />
        <FeaturesSection />
        <TestimonialsTicker testimonials={testimonials} />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
      <SignUpToast />
      <SignupChatbot />
    </div>
  );
}
