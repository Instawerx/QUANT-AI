"use client";

import { useState, useEffect, Children, cloneElement, isValidElement } from 'react';
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content";
import { simulateUserTestimonials } from "@/ai/flows/simulate-user-testimonials";

type Content = {
  slogan: string;
  mainContent: string;
  testimonials: string[];
};

type DynamicContentProps = {
  fallback: Content;
  children: React.ReactNode;
};

export function DynamicContent({ fallback, children }: DynamicContentProps) {
  const [content, setContent] = useState<Content>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const marketingInfoPromise = generateMarketingContent({
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

        const testimonialsPromise = simulateUserTestimonials({});

        const [marketingInfo, testimonialsData] = await Promise.all([
          marketingInfoPromise,
          testimonialsPromise,
        ]);

        const slogan = marketingInfo.marketingContent.split('Slogan: "')[1]?.split('"')[0] || fallback.slogan;
        const mainContent = marketingInfo.marketingContent.split('"\n\n')[1] || fallback.mainContent;
        const testimonials = testimonialsData.testimonials.map(t => t.testimonial);

        setContent({ slogan, mainContent, testimonials });
      } catch (error) {
        console.error("Error generating dynamic page content:", error);
        setContent(fallback);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [fallback]);

  const currentContent = isLoading ? fallback : content;

  // Clone children and pass down the dynamic props
  const enhancedChildren = Children.map(children, child => {
    if (isValidElement(child)) {
      // Pass content to any child that can accept these props
      // This is a flexible way to pass props down
      return cloneElement(child as React.ReactElement<any>, {
        slogan: currentContent.slogan,
        content: currentContent.mainContent,
        testimonials: currentContent.testimonials,
        ...child.props // Retain original props
      });
    }
    return child;
  });

  return <>{enhancedChildren}</>;
}
