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
  let slogan = "The Future of Trading is Here. Don't Get Left Behind.";
  let mainContent = "Leverage our Multi-LLM Neural Network to analyze market data with unprecedented depth and accuracy. Our automated trading bots work for you 24/7, executing trades based on AI-driven insights.";
  let testimonials = [
    "QuantTrade AI has completely changed how I approach the market. The AI insights are a game-changer!",
    "As a beginner, I was intimidated by trading, but this platform made it so easy to get started and see results.",
    "The automated bots are incredible. I'm literally making money while I sleep. Highly recommended!",
    "I've been trading for years, and QuantTrade AI is the most powerful tool I've ever used.",
    "The real-time monitoring and resilient infrastructure give me total peace of mind. A must-have for any serious trader."
  ];

  try {
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

    slogan = marketingInfo.marketingContent.split('Slogan: "')[1].split('"')[0];
    mainContent = marketingInfo.marketingContent.split('"\n\n')[1];
  } catch (error) {
    console.error("Error generating marketing content:", error);
    // Fallback content is already set
  }

  try {
    const testimonialsData = await simulateUserTestimonials({});
    testimonials = testimonialsData.testimonials.map(t => t.testimonial);
  } catch(error) {
    console.error("Error generating testimonials:", error);
    // Fallback content is already set
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection slogan={slogan} content={mainContent} />
        <StatsSection />
        <TradingChartSection />
        <FeaturesSection />
        <CtaSection />
        <FaqSection />
        <TestimonialsTicker testimonials={testimonials} />
      </main>
      <Footer />
      <SignUpToast />
      <SignupChatbot />
    </div>
  );
}
