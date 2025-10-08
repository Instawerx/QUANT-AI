'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { TradingChart } from '@/components/trading/TradingChart';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  time: string;
}

export default function TradingPage() {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState([1]);

  const currentPrice = 43567.89;
  const priceChange24h = 2.34;
  const volume24h = '28.4B';
  const high24h = 44123.45;
  const low24h = 42890.12;

  const orderBookBids: OrderBookEntry[] = [
    { price: 43567.50, amount: 0.5432, total: 23678.45 },
    { price: 43567.00, amount: 1.2345, total: 53789.12 },
    { price: 43566.50, amount: 0.8901, total: 38776.34 },
    { price: 43566.00, amount: 2.1234, total: 92501.23 },
    { price: 43565.50, amount: 0.6789, total: 29567.89 }
  ];

  const orderBookAsks: OrderBookEntry[] = [
    { price: 43568.00, amount: 0.4567, total: 19890.12 },
    { price: 43568.50, amount: 1.0123, total: 44098.76 },
    { price: 43569.00, amount: 0.7654, total: 33345.67 },
    { price: 43569.50, amount: 1.5678, total: 68321.45 },
    { price: 43570.00, amount: 0.9012, total: 39267.12 }
  ];

  const recentTrades: RecentTrade[] = [
    { id: '1', price: 43567.89, amount: 0.1234, type: 'buy', time: '14:32:45' },
    { id: '2', price: 43567.50, amount: 0.5678, type: 'sell', time: '14:32:42' },
    { id: '3', price: 43568.00, amount: 0.2345, type: 'buy', time: '14:32:38' },
    { id: '4', price: 43566.75, amount: 0.8901, type: 'sell', time: '14:32:35' },
    { id: '5', price: 43567.25, amount: 0.3456, type: 'buy', time: '14:32:30' }
  ];

  const aiSignals = [
    {
      type: 'Strong Buy',
      confidence: 87,
      timeframe: '1H',
      indicator: 'RSI + MACD',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      type: 'Buy',
      confidence: 72,
      timeframe: '4H',
      indicator: 'Moving Averages',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      type: 'Neutral',
      confidence: 55,
      timeframe: '1D',
      indicator: 'Volume Analysis',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    }
  ];

  const handleTrade = () => {
    console.log('Trade submitted:', { orderType, tradeType, amount, price, leverage: leverage[0] });
    // Trade logic would go here
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">BTC/USDT</h1>
              <Badge className="bg-purple-600">
                <Zap className="h-3 w-3 mr-1" />
                AI Trading
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-2xl font-bold">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <Badge variant={priceChange24h >= 0 ? 'default' : 'destructive'} className="text-sm">
                {priceChange24h >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(priceChange24h)}%
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">24h High</p>
              <p className="font-semibold">${high24h.toLocaleString('en-US')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Low</p>
              <p className="font-semibold">${low24h.toLocaleString('en-US')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Volume</p>
              <p className="font-semibold">${volume24h}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Trading Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  AI Trading Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiSignals.map((signal, index) => (
                    <div key={index} className={`p-4 rounded-lg ${signal.bgColor}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${signal.color}`}>{signal.type}</span>
                        <Badge variant="outline">{signal.timeframe}</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-semibold">{signal.confidence}%</span>
                        </div>
                        <div className="text-muted-foreground">{signal.indicator}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Chart */}
            <Card>
              <CardContent className="p-4">
                <TradingChart symbol="BTCUSDT" height={500} />
              </CardContent>
            </Card>

            {/* Order Book and Recent Trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Asks (Sell Orders) */}
                    <div className="space-y-1">
                      {orderBookAsks.reverse().map((ask, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2 text-sm py-1">
                          <span className="text-red-600 font-mono">
                            {ask.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-right font-mono">{ask.amount.toFixed(4)}</span>
                          <span className="text-right text-muted-foreground font-mono">
                            {ask.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Current Price Separator */}
                    <div className="py-2 border-t border-b">
                      <div className="flex items-center justify-center gap-2 font-semibold">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Bids (Buy Orders) */}
                    <div className="space-y-1">
                      {orderBookBids.map((bid, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2 text-sm py-1">
                          <span className="text-green-600 font-mono">
                            {bid.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-right font-mono">{bid.amount.toFixed(4)}</span>
                          <span className="text-right text-muted-foreground font-mono">
                            {bid.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="grid grid-cols-3 gap-2 text-sm py-2 border-b last:border-0">
                        <span className={`font-mono ${
                          trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-right font-mono">{trade.amount.toFixed(4)}</span>
                        <span className="text-right text-muted-foreground">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Buy/Sell Toggle */}
                <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as 'buy' | 'sell')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Order Type */}
                <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Price Input (for limit orders) */}
                {orderType === 'limit' && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        USDT
                      </span>
                    </div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      BTC
                    </span>
                  </div>
                </div>

                {/* Leverage Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Leverage</Label>
                    <span className="text-sm font-semibold">{leverage[0]}x</span>
                  </div>
                  <Slider
                    value={leverage}
                    onValueChange={setLeverage}
                    min={1}
                    max={20}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1x</span>
                    <span>5x</span>
                    <span>10x</span>
                    <span>20x</span>
                  </div>
                </div>

                {/* Total */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      {amount && !isNaN(parseFloat(amount))
                        ? `$${(parseFloat(amount) * currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : '$0.00'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full ${
                    tradeType === 'buy'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  size="lg"
                  onClick={handleTrade}
                >
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} BTC
                </Button>

                {/* AI Auto-Trade */}
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full" size="lg">
                    <Zap className="h-4 w-4 mr-2" />
                    Enable AI Auto-Trade
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className="font-semibold">$12,345.67</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Orders</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today's P&L</span>
                  <span className="font-semibold text-green-600">+$234.56</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
