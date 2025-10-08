'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { TradingChart } from '@/components/trading/TradingChart';
import { AccountGrowthTicker } from '@/components/simulation/AccountGrowthTicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Brain,
  Zap,
  Shield,
  Clock,
  Target,
  Activity,
  Wallet,
  Settings,
  Bell,
  Calendar,
  Download,
  Share2
} from 'lucide-react';
import { useWallet } from '@/lib/web3/hooks/useWallet';

export default function DashboardPage() {
  const { isConnected, address, balance } = useWallet();
  const [selectedStrategy, setSelectedStrategy] = useState('conservative');

  // Mock dashboard data - in real app this would come from API
  const portfolioData = {
    totalValue: 25847.32,
    dailyChange: 1284.67,
    dailyChangePercent: 5.24,
    weeklyChange: 3642.18,
    weeklyChangePercent: 16.4,
    monthlyChange: 8921.45,
    monthlyChangePercent: 52.7
  };

  const activeStrategies = [
    {
      id: 'conservative',
      name: 'Conservative Growth',
      status: 'active',
      allocation: 60,
      profit: 1847.32,
      profitPercent: 12.4,
      trades: 47,
      winRate: 89.4,
      color: 'text-blue-600'
    },
    {
      id: 'aggressive',
      name: 'Aggressive Momentum',
      status: 'active',
      allocation: 25,
      profit: 2156.78,
      profitPercent: 23.8,
      trades: 23,
      winRate: 73.9,
      color: 'text-purple-600'
    },
    {
      id: 'arbitrage',
      name: 'Arbitrage Master',
      status: 'paused',
      allocation: 15,
      profit: 421.15,
      profitPercent: 7.2,
      trades: 156,
      winRate: 94.2,
      color: 'text-green-600'
    }
  ];

  const recentTrades = [
    { symbol: 'BTC/USDT', type: 'buy', amount: 0.024, profit: 67.32, timestamp: '2 min ago', status: 'completed' },
    { symbol: 'ETH/USDT', type: 'sell', amount: 1.2, profit: -12.45, timestamp: '8 min ago', status: 'completed' },
    { symbol: 'SOL/USDT', type: 'buy', amount: 45.7, profit: 89.76, timestamp: '15 min ago', status: 'completed' },
    { symbol: 'ADA/USDT', type: 'sell', amount: 2847, profit: 34.21, timestamp: '23 min ago', status: 'completed' },
    { symbol: 'DOT/USDT', type: 'buy', amount: 124.5, profit: 156.89, timestamp: '1 hour ago', status: 'completed' }
  ];

  const notifications = [
    { type: 'success', message: 'Conservative Growth strategy generated +$67.32 profit', time: '2 min ago' },
    { type: 'info', message: 'New market opportunity detected in BTC/USDT', time: '15 min ago' },
    { type: 'warning', message: 'High volatility detected - risk management activated', time: '1 hour ago' },
    { type: 'success', message: 'Weekly profit target achieved (+16.4%)', time: '2 hours ago' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to access your trading dashboard and start using QuantTrade AI.
            </p>
            <Button size="lg" onClick={() => {}}>
              Connect Wallet
            </Button>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Your AI trading dashboard • Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(portfolioData.dailyChange)}
                  </p>
                  <p className="text-sm text-green-600">
                    {formatPercent(portfolioData.dailyChangePercent)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Profit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercent(portfolioData.weeklyChangePercent)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(portfolioData.weeklyChange)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Trades</p>
                  <p className="text-2xl font-bold">226</p>
                  <p className="text-sm text-muted-foreground">3 pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trading Chart */}
          <div className="lg:col-span-2">
            <TradingChart symbol="BTCUSDT" height={400} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Start AI Trading
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Strategy Settings
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="strategies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strategies">Active Strategies</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="accounts">Live Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-4">
            <div className="grid gap-4">
              {activeStrategies.map((strategy) => (
                <Card key={strategy.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                            {strategy.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {strategy.allocation}% allocation
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${strategy.color}`}>
                          {formatCurrency(strategy.profit)}
                        </p>
                        <p className={`text-sm ${strategy.color}`}>
                          {formatPercent(strategy.profitPercent)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Trades</p>
                        <p className="font-semibold">{strategy.trades}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="font-semibold">{strategy.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allocation</p>
                        <Progress value={strategy.allocation} className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trading Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                          {trade.type.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium">{trade.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.amount} • {trade.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {trade.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercent(portfolioData.dailyChangePercent)}
                  </div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercent(portfolioData.weeklyChangePercent)}
                  </div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPercent(portfolioData.monthlyChangePercent)}
                  </div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            <AccountGrowthTicker showControls={false} />
          </TabsContent>
        </Tabs>
      </main>

      <AppFooter />
    </div>
  );
}