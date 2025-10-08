'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Shield, BarChart3, TrendingUp, Clock, Lock, Globe } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { icon: Brain, title: 'Multi-LLM Neural Network', description: 'Advanced AI combining multiple language models for superior market analysis', color: 'text-purple-600' },
    { icon: Zap, title: 'Real-time Execution', description: '24/7 market monitoring with lightning-fast trade execution', color: 'text-yellow-500' },
    { icon: Shield, title: 'Enterprise Security', description: 'Bank-grade security with multi-layer protection', color: 'text-blue-600' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Comprehensive market insights and portfolio tracking', color: 'text-green-600' },
    { icon: TrendingUp, title: 'Auto Trading', description: 'Automated trading strategies powered by AI', color: 'text-red-600' },
    { icon: Clock, title: '24/7 Operation', description: 'Never miss a trading opportunity', color: 'text-orange-600' },
    { icon: Lock, title: 'Risk Management', description: 'Intelligent risk controls and stop-loss automation', color: 'text-indigo-600' },
    { icon: Globe, title: 'Global Markets', description: 'Trade across multiple exchanges worldwide', color: 'text-cyan-600' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to dominate cryptocurrency trading with AI-powered intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
