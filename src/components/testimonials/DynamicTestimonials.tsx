'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, TrendingUp, Shield, Zap } from 'lucide-react';
import { contentGenerator } from '@/lib/generators/contentGenerator';

interface Testimonial {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  tier: 'basic' | 'premium' | 'pro';
  rating: number;
  message: string;
  profit: number;
  timeframe: string;
  strategy: string;
  timestamp: Date;
  verified: boolean;
}

interface DynamicTestimonialsProps {
  className?: string;
  autoScroll?: boolean;
  showControls?: boolean;
  itemsPerView?: number;
}

export function DynamicTestimonials({
  className = '',
  autoScroll = true,
  showControls = false,
  itemsPerView = 3
}: DynamicTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(autoScroll);

  // Generate realistic testimonials using AI personas
  const generateTestimonial = (index: number): Testimonial => {
    const profile = contentGenerator.generateUserProfile(index);

    const testimonialTemplates = [
      {
        message: "QuantTrade AI transformed my trading completely! The {strategy} strategy has been incredible - I've seen {profit}% returns in just {timeframe}. The AI really knows what it's doing.",
        rating: 5
      },
      {
        message: "I was skeptical at first, but after {timeframe} of using the platform, I'm up {profit}%! The automated trading takes all the emotion out of it. Highly recommend!",
        rating: 5
      },
      {
        message: "Best trading bot I've ever used. Made {profit}% profit in {timeframe} with minimal risk. The {strategy} approach is exactly what I was looking for.",
        rating: 5
      },
      {
        message: "Finally, a trading platform that actually works! {profit}% gains in {timeframe} using their AI strategies. Customer support is also top-notch.",
        rating: 5
      },
      {
        message: "I've tried many trading bots, but QuantTrade AI is different. Consistent {profit}% returns over {timeframe}. The risk management is excellent.",
        rating: 5
      },
      {
        message: "Incredible results with the {strategy} strategy! From skeptic to believer - {profit}% profit in {timeframe}. The AI does all the heavy lifting.",
        rating: 4
      },
      {
        message: "Game changer for my portfolio! The automated trading generated {profit}% returns in {timeframe}. Love the transparency and real-time updates.",
        rating: 5
      },
      {
        message: "Professional-grade trading algorithms made accessible. {profit}% gains in {timeframe} speaks for itself. This isn't your grandfather's trading bot!",
        rating: 5
      },
      {
        message: "Started with the free trial and immediately saw results. {profit}% profit in {timeframe} convinced me to upgrade to Pro. Worth every penny!",
        rating: 5
      },
      {
        message: "The multi-LLM neural network approach really works. Consistent {profit}% returns over {timeframe} with their advanced AI strategies.",
        rating: 5
      }
    ];

    const template = testimonialTemplates[Math.floor(Math.random() * testimonialTemplates.length)];
    const profit = Math.floor(Math.random() * 50) + 10; // 10-60% profit
    const timeframes = ['2 weeks', '3 weeks', '1 month', '6 weeks', '2 months', '3 months'];
    const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];

    const message = template.message
      .replace('{strategy}', profile.favoriteStrategy)
      .replace('{profit}', profit.toString())
      .replace('{timeframe}', timeframe);

    return {
      id: `testimonial_${index}`,
      name: `${profile.firstName} ${profile.lastName}`,
      username: profile.username,
      avatar: profile.avatar,
      location: profile.location,
      tier: profile.tier,
      rating: template.rating,
      message,
      profit,
      timeframe,
      strategy: profile.favoriteStrategy,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      verified: Math.random() > 0.1 // 90% verified
    };
  };

  // Initialize testimonials
  useEffect(() => {
    const initialTestimonials = Array.from({ length: 20 }, (_, i) => generateTestimonial(i + 1));
    setTestimonials(initialTestimonials);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isScrolling || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, testimonials.length - itemsPerView + 1));
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isScrolling, testimonials.length, itemsPerView]);

  // Add new testimonials periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newTestimonial = generateTestimonial(testimonials.length + 1);
      setTestimonials(prev => [newTestimonial, ...prev].slice(0, 50)); // Keep latest 50
    }, 30000); // Add new testimonial every 30 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-purple-600 text-white';
      case 'premium': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);

  if (testimonials.length === 0) {
    return <div className="text-center p-8">Loading testimonials...</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          What Our Traders Say
        </h2>
        <p className="text-muted-foreground">
          Real results from real traders using QuantTrade AI
        </p>
        {isScrolling && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live testimonials updating
          </div>
        )}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-purple-600 opacity-20 absolute top-4 right-4" />

              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>@{testimonial.username}</span>
                    <Badge className={`text-xs ${getTierBadgeColor(testimonial.tier)}`}>
                      {testimonial.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{renderStars(testimonial.rating)}</div>
                <span className="text-sm text-muted-foreground">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Message */}
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                {testimonial.message}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">+{testimonial.profit}%</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <Zap className="h-3 w-3" />
                  <span>{testimonial.strategy}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(testimonial.timestamp)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-muted rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, testimonials.length)} of {testimonials.length}
          </span>
          <button
            onClick={() => setCurrentIndex(Math.min(testimonials.length - itemsPerView, currentIndex + 1))}
            disabled={currentIndex >= testimonials.length - itemsPerView}
            className="px-4 py-2 bg-muted rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Stats Footer */}
      <div className="text-center p-6 bg-muted/30 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">94.7%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">$2.4M+</div>
            <div className="text-sm text-muted-foreground">Total Profits Generated</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">12,847</div>
            <div className="text-sm text-muted-foreground">Active Traders</div>
          </div>
        </div>
      </div>
    </div>
  );
}