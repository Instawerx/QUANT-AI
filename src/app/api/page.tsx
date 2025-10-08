'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Key, Zap, Shield, Database, Terminal, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function APIPage() {
  const apiFeatures = [
    {
      icon: Key,
      title: 'Authentication',
      description: 'Secure API key management with role-based access control',
      endpoint: 'POST /auth/api-key'
    },
    {
      icon: Database,
      title: 'Market Data',
      description: 'Real-time and historical cryptocurrency market data',
      endpoint: 'GET /market/data'
    },
    {
      icon: Zap,
      title: 'Trading',
      description: 'Execute trades programmatically with our AI-powered engine',
      endpoint: 'POST /trade/execute'
    },
    {
      icon: Shield,
      title: 'Portfolio',
      description: 'Access your portfolio data and performance metrics',
      endpoint: 'GET /portfolio/summary'
    }
  ];

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/market/ticker',
      description: 'Get current market ticker data for all trading pairs',
      auth: false
    },
    {
      method: 'GET',
      path: '/api/v1/market/orderbook',
      description: 'Retrieve order book depth for a specific trading pair',
      auth: false
    },
    {
      method: 'POST',
      path: '/api/v1/trade/order',
      description: 'Place a new trading order (limit, market, stop)',
      auth: true
    },
    {
      method: 'GET',
      path: '/api/v1/trade/orders',
      description: 'Get all open orders for authenticated user',
      auth: true
    },
    {
      method: 'DELETE',
      path: '/api/v1/trade/order/{id}',
      description: 'Cancel an open order by order ID',
      auth: true
    },
    {
      method: 'GET',
      path: '/api/v1/portfolio/balance',
      description: 'Get current portfolio balances',
      auth: true
    },
    {
      method: 'GET',
      path: '/api/v1/portfolio/history',
      description: 'Retrieve portfolio performance history',
      auth: true
    },
    {
      method: 'GET',
      path: '/api/v1/ai/signals',
      description: 'Get AI-generated trading signals and confidence scores',
      auth: true
    }
  ];

  const codeExample = `// Initialize QuantTrade AI SDK
const quantTrade = new QuantTradeAI({
  apiKey: 'your_api_key_here',
  environment: 'production'
});

// Get market data
const ticker = await quantTrade.market.getTicker('BTCUSDT');
console.log(ticker);

// Place a trade order
const order = await quantTrade.trade.createOrder({
  symbol: 'BTCUSDT',
  side: 'buy',
  type: 'limit',
  quantity: 0.01,
  price: 45000
});

// Get AI trading signals
const signals = await quantTrade.ai.getSignals({
  symbols: ['BTCUSDT', 'ETHUSDT'],
  timeframe: '1h'
});`;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="bg-lime-400 text-black mb-2">
              REST API v1.0
            </Badge>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Build powerful trading applications with our comprehensive REST API and WebSocket feeds
            </p>
          </div>

          {/* Quick Start */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Terminal className="h-6 w-6" />
                Quick Start
              </CardTitle>
              <CardDescription className="text-base">
                Get started with the QuantTrade AI API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{codeExample}</code>
                </pre>
              </div>
              <div className="flex gap-4">
                <Link href="/settings">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Key className="mr-2 h-4 w-4" />
                    Generate API Key
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Full Documentation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* API Features */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {apiFeatures.map((feature, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-md p-3 font-mono text-sm">
                      {feature.endpoint}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* API Endpoints */}
          <div>
            <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {endpoints.map((endpoint, idx) => (
                    <div key={idx} className="p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={endpoint.method === 'GET' ? 'default' :
                                   endpoint.method === 'POST' ? 'secondary' : 'destructive'}
                            className={
                              endpoint.method === 'GET' ? 'bg-blue-600' :
                              endpoint.method === 'POST' ? 'bg-green-600' :
                              'bg-red-600'
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        {endpoint.auth && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Key className="h-3 w-3" />
                            Auth Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground ml-0 md:ml-20">
                        {endpoint.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rate Limits */}
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Rate Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Public Endpoints</p>
                  <p className="text-2xl font-bold">120 req/min</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Authenticated</p>
                  <p className="text-2xl font-bold">300 req/min</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">WebSocket</p>
                  <p className="text-2xl font-bold">10 connections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Security Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-600 mt-2" />
                  <div>
                    <p className="font-semibold">Keep API Keys Secure</p>
                    <p className="text-sm text-muted-foreground">Never expose API keys in client-side code or public repositories</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-600 mt-2" />
                  <div>
                    <p className="font-semibold">Use IP Whitelisting</p>
                    <p className="text-sm text-muted-foreground">Restrict API access to specific IP addresses in your settings</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-600 mt-2" />
                  <div>
                    <p className="font-semibold">Rotate Keys Regularly</p>
                    <p className="text-sm text-muted-foreground">Generate new API keys periodically and revoke old ones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-600 mt-2" />
                  <div>
                    <p className="font-semibold">Monitor Usage</p>
                    <p className="text-sm text-muted-foreground">Review API logs regularly to detect unauthorized access</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="border-purple-500/50">
            <CardContent className="p-8 text-center space-y-4">
              <Code className="h-12 w-12 mx-auto text-purple-600" />
              <h3 className="text-2xl font-bold">Need Integration Help?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our developer support team is here to help you integrate the QuantTrade AI API into your application.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/docs">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Full Docs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">
                    Contact API Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
