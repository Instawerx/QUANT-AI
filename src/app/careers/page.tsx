'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Briefcase, Users, Code, Brain, TrendingUp } from 'lucide-react';

export default function CareersPage() {
  const positions = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and optimize our Multi-LLM Neural Network for cryptocurrency trading',
      icon: Brain
    },
    {
      title: 'Blockchain Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and audit smart contracts for our DeFi trading platform',
      icon: Code
    },
    {
      title: 'Quantitative Trader',
      department: 'Trading',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design and implement algorithmic trading strategies',
      icon: TrendingUp
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product development and strategy for our AI trading platform',
      icon: Briefcase
    },
    {
      title: 'Community Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and engage our community across social platforms',
      icon: Users
    }
  ];

  const benefits = [
    'Competitive salary and equity',
    'Comprehensive health benefits',
    'Remote-first culture',
    'Flexible working hours',
    'Learning and development budget',
    'Latest tech and tools',
    'Quarterly team retreats',
    'Crypto bonuses and rewards'
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Help us build the future of AI-powered cryptocurrency trading
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Why Join Us */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">Why QuantTrade AI?</h2>
            <p className="text-xl text-muted-foreground">
              We're a fast-growing team of innovators pushing the boundaries of AI and blockchain technology. Join us in revolutionizing how people trade cryptocurrencies.
            </p>
          </div>

          {/* Open Positions */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Open Positions</h2>
              <p className="text-muted-foreground">
                {positions.length} open positions - Find your perfect role
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
              {positions.map((position, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <position.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                          <CardDescription className="mb-4">{position.description}</CardDescription>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {position.department}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {position.location}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {position.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-6 whitespace-nowrap">
                        Apply
                      </button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Benefits & Perks</h2>
              <p className="text-muted-foreground">
                We take care of our team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {benefits.map((benefit, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Culture */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
                  <p className="text-muted-foreground text-lg">
                    We believe in transparency, innovation, and continuous learning. Our team is passionate about technology, cryptocurrency, and building products that make a real impact.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">Remote</div>
                    <div className="text-sm text-muted-foreground">Work from anywhere</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">Global</div>
                    <div className="text-sm text-muted-foreground">Team across 20+ countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">Growing</div>
                    <div className="text-sm text-muted-foreground">Fast-paced environment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Don't see the right role?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're always looking for talented individuals. Send us your resume and let us know how you can contribute to our mission.
            </p>
            <div>
              <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-11 px-8">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
