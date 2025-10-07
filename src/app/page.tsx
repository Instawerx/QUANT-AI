'use client';

import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';
import SpinPromoModal from '@/components/marketing/SpinPromoModal';
import { TradingChart } from '@/components/trading/TradingChart';
import { AccountGrowthTicker } from '@/components/simulation/AccountGrowthTicker';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { FreeTrialSignup } from '@/components/trial/FreeTrialSignup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Zap,
  Shield,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'Multi-LLM Neural Network',
      description: 'Advanced AI combining multiple language models for superior market analysis and decision making.',
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Execution',
      description: '24/7 market monitoring with lightning-fast trade execution and automated risk management.',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with multi-layer protection and cold storage for maximum safety.',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive performance tracking with detailed insights and portfolio optimization.',
      color: 'text-green-600'
    }
  ];

  const stats = [
    { value: '94.7%', label: 'Success Rate', icon: TrendingUp },
    { value: '12,847', label: 'Active Traders', icon: Users },
    { value: '99.9%', label: 'Uptime', icon: Clock },
    { value: '4.8/5', label: 'User Rating', icon: Star }
  ];

  const benefits = [
    'No credit card required for trial',
    'Cancel anytime, no commitment',
    '2-minute setup process',
    '24/7 customer support',
    'Real-time performance tracking',
    'Multi-language support'
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="space-y-16 pb-16">
        {/* Spin to Win Promo Modal (appears after 15s for new visitors only) */}
        <SpinPromoModal />
        {/* Hero Section */}
        <section className="container pt-8">
          <MarketingBanner variant="full" />
        </section>

        {/* Trading Chart Section */}
        <section className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Live Market Analysis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch our AI in action with real-time market analysis and trading signals.
              Our advanced algorithms process thousands of data points every second.
            </p>
          </div>
          <TradingChart symbol="BTCUSDT" height={500} />
        </section>

        {/* Account Growth Simulation */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live Trading Results</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real traders, real results. Watch accounts grow in real-time with our
                AI-powered trading strategies delivering consistent 4% hourly growth.
              </p>
            </div>
            <AccountGrowthTicker />
          </div>
        </section>

        {/* Features Section */}
        <section className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose QuantTrade AI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge technology combines multiple AI models to deliver
              unprecedented trading performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-muted mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get started with QuantTrade AI in just three simple steps.
                No complex setup or technical knowledge required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your MetaMask or preferred Web3 wallet to get started with our platform.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Strategy</h3>
                <p className="text-muted-foreground">
                  Select from our AI-powered trading strategies based on your risk tolerance and goals.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Trading</h3>
                <p className="text-muted-foreground">
                  Watch our AI execute trades automatically while you track performance in real-time.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo Video
              </Button>
            </div>
          </div>
        </section>

        {/* Free Trial Section */}
        <section className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Your Free Trial</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful traders already using QuantTrade AI.
              Try all premium features free for 30 days.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FreeTrialSignup />
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">What's Included in Your Trial</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                <h4 className="font-semibold mb-2">Limited Time Offer</h4>
                <p className="text-sm opacity-90 mb-4">
                  First 10,000 users get access to our exclusive trading strategies
                  and priority support during the trial period.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-lime-400 text-black">
                    Only 1,457 spots remaining
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <DynamicTestimonials />
          </div>
        </section>

        {/* Final CTA */}
        <section className="container">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Join the trading revolution and experience the power of next-generation
                AI trading. Start your journey to financial freedom today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-lime-400 text-black hover:bg-lime-300">
                  Start Free Trial Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
