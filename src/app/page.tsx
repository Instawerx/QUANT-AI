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

export default async function Home() {
  const slogan = "These are not your Grandfather's trading bots.";
  const mainContent = "Unparalleled success rates with our Multi LLM Neural Network and real time monitoring via our cloud infrastructure.";
  const testimonials = [
    "QuantTrade AI has revolutionized my trading strategy, delivering consistent profits with its advanced AI.",
    "As a seasoned trader, I'm impressed by the accuracy and reliability of QuantTrade AI's algorithms.",
    "The real-time monitoring and cloud infrastructure provide peace of mind and exceptional performance.",
    "I've seen a 4% hourly growth in my portfolio since I started using QuantTrade AI's automated trading.",
    "The platform is intuitive and powerful, making it the best trading tool I've ever used."
  ];

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
      </main>
      <TestimonialsTicker testimonials={testimonials} />
      <Footer />
      <SignUpToast />
      <SignupChatbot />
    </div>
  );
}
