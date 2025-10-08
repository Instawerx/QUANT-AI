'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, Zap, Play, Pause } from 'lucide-react';

interface TradingAccount {
  id: string;
  username: string;
  balance: number;
  initialBalance: number;
  profit: number;
  profitPercent: number;
  strategy: string;
  isActive: boolean;
  joinedAt: Date;
  lastUpdate: Date;
  avatar: string;
  tier: 'basic' | 'premium' | 'pro';
}

interface AccountGrowthTickerProps {
  className?: string;
  showControls?: boolean;
  tickerSpeed?: number;
}

export function AccountGrowthTicker({
  className = '',
  showControls = true,
  tickerSpeed = 3000
}: AccountGrowthTickerProps) {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [totalUsers, setTotalUsers] = useState(840 + Math.floor(Math.random() * 2816)); // 840-3,656
  const [totalProfit, setTotalProfit] = useState(0);

  // Generate realistic account data
  const generateAccount = (id: number): TradingAccount => {
    const usernames = [
      'CryptoWhale47', 'DiamondHands92', 'MoonRocket88', 'TradingPro22',
      'BitcoinBull', 'EthereumMax', 'AltcoinKing', 'DefiMaster', 'HODLer2024',
      'QuantTrader', 'AlgoBot99', 'CryptoNinja', 'BlockchainBoss', 'TokenHunter',
      'SmartTrader', 'ProfitMaker', 'TrendFollower', 'MarketMover', 'CoinCollector',
      'DigitalGold', 'CryptoSurfer', 'TradingGuru', 'PortfolioKing', 'InvestorPro'
    ];

    const strategies = [
      'Conservative Growth', 'Aggressive Momentum', 'DeFi Yield Farming',
      'Arbitrage Master', 'AI Pattern Recognition', 'Market Neutral',
      'Trend Following', 'Mean Reversion', 'Breakout Strategy', 'Scalping Pro'
    ];

    const tiers: ('basic' | 'premium' | 'pro')[] = ['basic', 'premium', 'pro'];
    const tierWeights = [0.7, 0.25, 0.05]; // 70% basic, 25% premium, 5% pro

    const randomTier = () => {
      const random = Math.random();
      let cumulative = 0;
      for (let i = 0; i < tierWeights.length; i++) {
        cumulative += tierWeights[i];
        if (random < cumulative) return tiers[i];
      }
      return 'basic';
    };

    const tier = randomTier();

    // Generate realistic profit amounts
    // Distribution: 50% <$4,300, 30% $4,300-$24,000, 15% $24,000-$343,000, 5% $343,000-$866,000
    const random = Math.random();
    let profit: number;

    if (random < 0.5) {
      // 50% chance: profits below $4,300
      profit = 836 + Math.random() * 3464; // $836 to $4,300
    } else if (random < 0.8) {
      // 30% chance: profits between $4,300 and $24,000
      profit = 4300 + Math.random() * 19700; // $4,300 to $24,000
    } else if (random < 0.95) {
      // 15% chance: profits between $24,000 and $343,000
      profit = 24000 + Math.random() * 319000; // $24,000 to $343,000
    } else {
      // 5% chance: high profits between $343,000 and $866,000
      profit = 343000 + Math.random() * 523000; // $343,000 to $866,000
    }

    // Calculate initial balance based on profit and a realistic percentage
    const profitPercent = 15 + Math.random() * 285; // 15% to 300% gain
    const initialBalance = profit / (profitPercent / 100);
    const currentBalance = initialBalance + profit;

    const hoursActive = 24 + Math.random() * 696; // 1-30 days

    return {
      id: `acc_${id}`,
      username: usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000),
      balance: Number(currentBalance.toFixed(2)),
      initialBalance: Number(initialBalance.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profitPercent: Number(profitPercent.toFixed(1)),
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      isActive: Math.random() > 0.1, // 90% active
      joinedAt: new Date(Date.now() - hoursActive * 60 * 60 * 1000),
      lastUpdate: new Date(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      tier
    };
  };

  // Initialize accounts
  useEffect(() => {
    const initialAccounts = Array.from({ length: 100 }, (_, i) => generateAccount(i + 1));
    setAccounts(initialAccounts);

    // Calculate total profit
    const total = initialAccounts.reduce((sum, acc) => sum + acc.profit, 0);
    setTotalProfit(total);
  }, []);

  // Update accounts and add new users
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAccounts(prevAccounts => {
        const updatedAccounts = prevAccounts.map(account => {
          if (!account.isActive) return account;

          // Simulate realistic small growth with volatility
          const timeElapsed = (Date.now() - account.lastUpdate.getTime()) / 1000; // seconds
          const volatility = (Math.random() - 0.5) * 0.0008; // Small random change

          // Very small realistic growth rate
          const growthRate = 0.00001 + volatility;

          const newBalance = account.balance * (1 + growthRate * timeElapsed);
          const newProfit = newBalance - account.initialBalance;
          const newProfitPercent = ((newProfit / account.initialBalance) * 100);

          return {
            ...account,
            balance: Number(newBalance.toFixed(2)),
            profit: Number(newProfit.toFixed(2)),
            profitPercent: Number(newProfitPercent.toFixed(1)),
            lastUpdate: new Date()
          };
        });

        // Occasionally add new users
        if (Math.random() < 0.003) {
          const newAccount = generateAccount(prevAccounts.length + 1);
          return [newAccount, ...updatedAccounts].slice(0, 100);
        }

        return updatedAccounts;
      });

      // Update total profit and dynamic user count
      setAccounts(accounts => {
        const total = accounts.reduce((sum, acc) => sum + acc.profit, 0);
        setTotalProfit(total);
        return accounts;
      });

      // Dynamic user count that fluctuates (840-3,656 range)
      setTotalUsers(prev => {
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newCount = prev + change;
        return Math.max(840, Math.min(3656, newCount)); // Keep in range
      });
    }, tickerSpeed);

    return () => clearInterval(interval);
  }, [isRunning, tickerSpeed]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-purple-600 text-white';
      case 'premium': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getVisibleAccounts = () => {
    return accounts.slice(0, 12); // Show top 12 accounts
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Profits</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalProfit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-600">4% /hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Trading Accounts */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Trading Accounts
            </CardTitle>
            {showControls && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {getVisibleAccounts().map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={account.avatar}
                    alt={account.username}
                    className="w-8 h-8 rounded-full bg-muted"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.username}</span>
                      <Badge
                        className={`text-xs ${getTierBadgeColor(account.tier)}`}
                      >
                        {account.tier.toUpperCase()}
                      </Badge>
                      {account.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.strategy}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">{formatCurrency(account.balance)}</div>
                  <div className={`text-sm flex items-center gap-1 justify-end ${
                    account.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {account.profit >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatCurrency(account.profit)} ({formatPercent(account.profitPercent)})
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-muted/25">
            <p className="text-sm text-muted-foreground text-center">
              {isRunning ? (
                <>Accounts updating in real-time • Growing at 4% per hour</>
              ) : (
                <>Simulation paused • Click resume to continue</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}