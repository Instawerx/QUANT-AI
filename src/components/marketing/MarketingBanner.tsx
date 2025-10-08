'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MissionContributionFlow } from '@/components/mission/MissionContributionFlow';
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Award,
  Target,
  Cpu,
  BarChart3,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';

interface MarketingBannerProps {
  className?: string;
  variant?: 'hero' | 'compact' | 'full';
}

export function MarketingBanner({
  className = '',
  variant = 'hero'
}: MarketingBannerProps) {
  const [currentStat, setCurrentStat] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    activeTrades: 12847,
    successRate: 94.7,
    totalProfit: 2400000,
    avgReturn: 287,
    uptime: 99.9
  });

  // Animated statistics
  const stats = [
    { icon: TrendingUp, label: 'Success Rate', value: `${liveMetrics.successRate}%`, color: 'text-green-500' },
    { icon: Users, label: 'Active Traders', value: liveMetrics.activeTrades.toLocaleString(), color: 'text-blue-500' },
    { icon: DollarSign, label: 'Total Profits', value: `$${(liveMetrics.totalProfit / 1000000).toFixed(1)}M+`, color: 'text-purple-500' },
    { icon: Target, label: 'Avg Monthly Return', value: `${liveMetrics.avgReturn}%`, color: 'text-yellow-500' },
    { icon: Shield, label: 'Uptime', value: `${liveMetrics.uptime}%`, color: 'text-emerald-500' }
  ];

  // Cycle through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  // Update live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeTrades: prev.activeTrades + Math.floor(Math.random() * 3),
        successRate: Math.min(99.9, prev.successRate + (Math.random() - 0.5) * 0.1),
        totalProfit: prev.totalProfit + Math.floor(Math.random() * 1000),
        avgReturn: prev.avgReturn + (Math.random() - 0.5) * 2,
        uptime: Math.max(99.0, prev.uptime + (Math.random() - 0.5) * 0.01)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (variant === 'compact') {
    return (
      <Card className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">These Aren't Your Grandfather's Trading Bots</h3>
              <p className="text-sm opacity-90">Multi-LLM Neural Network • Real-time Monitoring • Cloud Infrastructure</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats[currentStat].value}</div>
              <div className="text-sm opacity-90">{stats[currentStat].label}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Main Hero Banner */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white border-0">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-lime-400 text-black font-semibold">
                    🚀 REVOLUTIONARY AI TRADING
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    These Aren't Your
                    <span className="block text-transparent bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text">
                      Grandfather's Trading Bots
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Advanced Multi-LLM Neural Network with real-time monitoring and
                    enterprise-grade cloud infrastructure delivering unprecedented results.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Brain className="h-5 w-5 text-lime-400" />
                    <span className="text-sm font-medium">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium">Real-time</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <MissionContributionFlow
                    buttonText="Start Free Trial"
                    buttonSize="lg"
                    buttonClassName="bg-lime-400 text-black hover:bg-lime-300 font-semibold"
                  />
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                    Watch Demo
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 4).map((stat, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur border-white/20">
                      <CardContent className="p-4 text-center">
                        <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-300">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
            <CardContent className="p-6">
              <Brain className="h-12 w-12 text-lime-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Multi-LLM Neural Network</h3>
              <p className="text-purple-100">
                Advanced AI combining multiple language models for superior market analysis and decision making.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <BarChart3 className="h-12 w-12 text-lime-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-blue-100">
                24/7 market surveillance with instant execution and risk management protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0">
            <CardContent className="p-6">
              <Cpu className="h-12 w-12 text-lime-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cloud Infrastructure</h3>
              <p className="text-emerald-100">
                Enterprise-grade cloud deployment ensuring maximum uptime and scalability.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Unprecedented Success Rates</h2>
              <p className="text-gray-300">
                Our advanced AI delivers results that traditional trading bots simply can't match
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg transition-all duration-500 ${
                    currentStat === index
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 scale-105'
                      : 'bg-white/5'
                  }`}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-lime-400 to-emerald-500 text-black border-0">
          <CardContent className="p-8 text-center">
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join the Trading Revolution</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Experience the power of next-generation AI trading. Start your free 30-day trial
              and see why thousands of traders have made the switch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MissionContributionFlow
                buttonText="Start Free Trial - 30 Days"
                buttonSize="lg"
                buttonClassName="bg-black text-white hover:bg-gray-800"
                showIcon={false}
              />
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                View Pricing Plans
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default hero variant
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white border-0 ${className}`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <Badge className="bg-lime-400 text-black font-semibold text-sm">
            🚀 NEXT-GENERATION AI TRADING
          </Badge>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            These Aren't Your
            <span className="block text-transparent bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text">
              Grandfather's Trading Bots
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Advanced Multi-LLM Neural Network with real-time monitoring and
            enterprise-grade cloud infrastructure delivering {liveMetrics.successRate.toFixed(1)}% success rates.
          </p>

          <div className="flex justify-center">
            <div className={`p-6 rounded-lg bg-white/10 backdrop-blur transition-all duration-500 ${
              'border-2 border-lime-400'
            }`}>
              <div className="flex items-center gap-3">
                {React.createElement(stats[currentStat].icon, {
                  className: `h-8 w-8 ${stats[currentStat].color}`
                })}
                <div>
                  <div className="text-2xl font-bold">{stats[currentStat].value}</div>
                  <div className="text-sm text-gray-300">{stats[currentStat].label}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MissionContributionFlow
              buttonText="Start Free Trial"
              buttonSize="lg"
              buttonClassName="bg-lime-400 text-black hover:bg-lime-300 font-semibold"
            />
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Watch Demo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}