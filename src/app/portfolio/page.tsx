'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Plus
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  allocation: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  asset: string;
  amount: number;
  value: number;
  date: string;
}

export default function PortfolioPage() {
  const portfolioValue = 45678.92;
  const dailyChange = 1234.56;
  const dailyChangePercent = 2.78;
  const totalProfit = 8456.23;
  const totalProfitPercent = 22.7;

  const assets: Asset[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.5432,
      value: 23450.67,
      change24h: 3.45,
      allocation: 51.3
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 5.234,
      value: 12345.89,
      change24h: -1.23,
      allocation: 27.0
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: 45.67,
      value: 6789.12,
      change24h: 5.67,
      allocation: 14.9
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      amount: 3093.24,
      value: 3093.24,
      change24h: 0.01,
      allocation: 6.8
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'buy',
      asset: 'BTC',
      amount: 0.0234,
      value: 1234.56,
      date: '2025-10-07 14:32'
    },
    {
      id: '2',
      type: 'sell',
      asset: 'ETH',
      amount: 0.5,
      value: 1180.50,
      date: '2025-10-07 12:15'
    },
    {
      id: '3',
      type: 'deposit',
      asset: 'USDT',
      amount: 5000,
      value: 5000.00,
      date: '2025-10-06 18:45'
    },
    {
      id: '4',
      type: 'buy',
      asset: 'SOL',
      amount: 15.5,
      value: 2304.75,
      date: '2025-10-06 15:20'
    },
    {
      id: '5',
      type: 'withdrawal',
      asset: 'USDT',
      amount: 2000,
      value: 2000.00,
      date: '2025-10-05 10:30'
    }
  ];

  const performanceData = [
    { period: '24H', value: '+2.78%', profit: '+$1,234.56' },
    { period: '7D', value: '+8.45%', profit: '+$3,678.90' },
    { period: '30D', value: '+15.23%', profit: '+$6,012.34' },
    { period: 'All Time', value: '+22.7%', profit: '+$8,456.23' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your crypto holdings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold mt-1">
                    ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    +${dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{dailyChangePercent}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    +${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{totalProfitPercent}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assets</p>
                  <p className="text-2xl font-bold mt-1">{assets.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Diversified
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {performanceData.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{item.period}</p>
                  <p className="text-xl font-bold text-green-600 mt-1">{item.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.profit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assets and Transactions Tabs */}
        <Tabs defaultValue="assets" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Assets</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="font-bold text-purple-600">{asset.symbol}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {asset.amount.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {asset.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          <Badge variant={asset.change24h >= 0 ? 'default' : 'destructive'} className="text-xs">
                            {asset.change24h >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(asset.change24h)}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {asset.allocation}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'buy' || tx.type === 'deposit'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {tx.type === 'buy' || tx.type === 'deposit' ? (
                            <ArrowDownRight className={`h-5 w-5 ${
                              tx.type === 'buy' || tx.type === 'deposit'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`} />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {tx.asset}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.type === 'buy' || tx.type === 'deposit'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {tx.type === 'buy' || tx.type === 'deposit' ? '+' : '-'}$
                          {tx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AppFooter />
    </div>
  );
}
