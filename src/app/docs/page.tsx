'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Code, Zap, Shield, TrendingUp, Wallet, Gift, Settings } from 'lucide-react';

export default function DocsPage() {
  const docSections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of QuantTrade AI',
      topics: [
        'Creating your account',
        'Connecting your wallet',
        'Understanding the dashboard',
        'Making your first trade'
      ]
    },
    {
      icon: Wallet,
      title: 'Wallet Integration',
      description: 'Connect and manage your Web3 wallet',
      topics: [
        'Supported wallets',
        'Wallet security best practices',
        'Approving smart contracts',
        'Managing permissions'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Trading Guide',
      description: 'Master AI-powered trading strategies',
      topics: [
        'Understanding market orders',
        'Setting up limit orders',
        'Using leverage safely',
        'AI trading signals explained'
      ]
    },
    {
      icon: Zap,
      title: 'AI Features',
      description: 'Leverage our Multi-LLM Neural Network',
      topics: [
        'How the AI analyzes markets',
        'Configuring auto-trade',
        'Understanding confidence scores',
        'Risk management settings'
      ]
    },
    {
      icon: Gift,
      title: 'Spin to Win',
      description: 'Maximize your rewards',
      topics: [
        'How to earn free spins',
        'Understanding prize tiers',
        'Claiming your rewards',
        'Promotional events'
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Keep your assets safe',
      topics: [
        'Two-factor authentication',
        'Smart contract audits',
        'Withdrawal limits',
        'Incident response'
      ]
    },
    {
      icon: Code,
      title: 'API Documentation',
      description: 'Integrate with our platform',
      topics: [
        'API authentication',
        'REST endpoints',
        'WebSocket feeds',
        'Rate limits'
      ]
    },
    {
      icon: Settings,
      title: 'Advanced Settings',
      description: 'Customize your experience',
      topics: [
        'Notification preferences',
        'Trading parameters',
        'API key management',
        'Account security'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive guides and resources to help you make the most of QuantTrade AI
            </p>
          </div>

          {/* Quick Start */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
              <CardDescription className="text-base">
                Get up and running in 5 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Connect Wallet</p>
                    <p className="text-sm text-muted-foreground">Link your Web3 wallet</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Approve Contract</p>
                    <p className="text-sm text-muted-foreground">Enable trading features</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Fund Account</p>
                    <p className="text-sm text-muted-foreground">Deposit crypto</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Start Trading</p>
                    <p className="text-sm text-muted-foreground">Let AI do the work</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                    <section.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.topics.map((topic, tidx) => (
                      <li key={tidx} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Need Help */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Need More Help?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Can't find what you're looking for? Visit our help center or contact our support team.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="/help" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-6">
                  Help Center
                </a>
                <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6">
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
