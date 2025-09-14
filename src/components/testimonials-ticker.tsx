"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type TestimonialsTickerProps = {
  testimonials: string[];
};

export function TestimonialsTicker({ testimonials }: TestimonialsTickerProps) {
  return (
    <div className="bg-background w-full overflow-hidden py-6 border-t">
      <div className="flex animate-scroll">
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center mx-4 w-auto"
          >
            <MessageSquare className="h-5 w-5 text-accent mr-3" />
            <p className="text-md text-muted-foreground whitespace-nowrap">
              "{testimonial}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
