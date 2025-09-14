import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { TradingChartSection } from "@/components/trading-chart-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsTicker } from "@/components/testimonials-ticker";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

import { generateMarketingContent } from '@/ai/flows/generate-marketing-content';
import { simulateUserTestimonials } from '@/ai/flows/simulate-user-testimonials';

export default async function Home() {
  const marketingContentPromise = generateMarketingContent({
    productName: 'QuantTrade AI',
    uniqueFeatures: [
      'Multi LLM Neural Network',
      'Real-time monitoring',
      'Automated algo robot trading via API',
      'Cloud infrastructure'
    ],
    advantages: ['High success rates', 'Better than old trading bots.']
  });

  const testimonialsPromise = Promise.all(
    Array(10).fill(0).map(() => simulateUserTestimonials({}))
  );

  const [marketingContentData, testimonialsData] = await Promise.all([
    marketingContentPromise,
    testimonialsPromise
  ]);

  const testimonials = testimonialsData.map(t => t.testimonial);
  const { marketingContent } = marketingContentData;

  const [slogan, ...contentPoints] = marketingContent.split('\n').filter(line => line.trim() !== '');
  const mainContent = contentPoints.join(' ');


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
