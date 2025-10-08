'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Lightbulb, Award } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'Democratize access to sophisticated AI-powered trading technology for everyone'
    },
    {
      icon: Users,
      title: 'User Focused',
      description: 'Building tools that empower traders of all experience levels'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge AI and blockchain technology'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality trading experience'
    }
  ];

  const team = [
    { name: 'AI Research Team', role: 'Developing next-generation trading algorithms' },
    { name: 'Blockchain Engineers', role: 'Building secure and scalable smart contracts' },
    { name: 'Trading Experts', role: 'Optimizing strategies and risk management' },
    { name: 'Security Team', role: 'Ensuring enterprise-grade protection' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About QuantTrade AI
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Pioneering the future of cryptocurrency trading with artificial intelligence
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Story Section */}
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                QuantTrade AI was born from a simple observation: traditional trading tools weren't keeping pace with the rapid evolution of cryptocurrency markets. We saw an opportunity to leverage the latest advances in artificial intelligence and blockchain technology to create something truly revolutionary.
              </p>
              <p>
                Our team of AI researchers, blockchain engineers, and trading experts came together with a shared vision: to build a platform that makes sophisticated, institutional-grade trading strategies accessible to everyone. By combining multiple large language models with advanced market analysis, we've created a neural network that operates 24/7, identifying opportunities that human traders might miss.
              </p>
              <p>
                Today, QuantTrade AI serves thousands of traders worldwide, executing millions in trading volume and consistently delivering results. But we're just getting started. Our commitment to innovation drives us to continuously improve our AI models, expand our feature set, and push the boundaries of what's possible in automated cryptocurrency trading.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <Card key={idx} className="text-center">
                  <CardHeader>
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <value.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {team.map((member, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">10,000+</div>
                <div className="text-muted-foreground">Active Traders</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">$100M+</div>
                <div className="text-muted-foreground">Trading Volume</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-muted-foreground">AI Operation</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6 py-12">
            <h2 className="text-4xl font-bold">Join the Future of Trading</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of AI-driven cryptocurrency trading today
            </p>
            <div>
              <a href="/dashboard" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 h-11 px-8 text-lg">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
