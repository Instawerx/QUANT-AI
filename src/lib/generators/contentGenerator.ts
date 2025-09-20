// Realistic content generation for QuantTrade AI platform

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: Date;
  tier: 'basic' | 'premium' | 'pro';
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  favoriteStrategy: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: number;
  expectedReturn: number;
  winRate: number;
  minInvestment: number;
  features: string[];
  backtestResults: {
    period: string;
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    trades: number;
  };
}

export interface TradeRecord {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  profit: number;
  profitPercent: number;
  timestamp: Date;
  strategy: string;
  confidence: number;
}

class ContentGenerator {
  private firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
    'Cameron', 'Blake', 'Drew', 'Sage', 'River', 'Phoenix', 'Skylar', 'Rowan',
    'Jamie', 'Hayden', 'Emery', 'Dakota', 'Finley', 'Harper', 'Parker', 'Reese'
  ];

  private lastNames = [
    'Chen', 'Rodriguez', 'Patel', 'Johnson', 'Williams', 'Brown', 'Jones',
    'Garcia', 'Miller', 'Davis', 'Martinez', 'Anderson', 'Taylor', 'Thomas',
    'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall',
    'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Adams', 'Baker'
  ];

  private locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
    'London, UK', 'Tokyo, Japan', 'Singapore', 'Hong Kong', 'Toronto, Canada',
    'Sydney, Australia', 'Berlin, Germany', 'Paris, France', 'Dubai, UAE', 'Mumbai, India'
  ];

  private cryptoSymbols = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT', 'XRP/USDT',
    'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'SHIB/USDT', 'MATIC/USDT', 'LTC/USDT',
    'UNI/USDT', 'LINK/USDT', 'ATOM/USDT', 'ETC/USDT', 'XLM/USDT', 'BCH/USDT',
    'ALGO/USDT', 'VET/USDT', 'ICP/USDT', 'THETA/USDT', 'FIL/USDT', 'TRX/USDT'
  ];

  private strategies = [
    {
      name: 'Conservative Growth',
      description: 'Low-risk strategy focusing on stable returns with minimal drawdown',
      category: 'Conservative',
      riskLevel: 2,
      expectedReturn: 15,
      winRate: 78,
      minInvestment: 100
    },
    {
      name: 'Momentum Scalper',
      description: 'High-frequency trading capturing small price movements',
      category: 'Aggressive',
      riskLevel: 8,
      expectedReturn: 45,
      winRate: 65,
      minInvestment: 1000
    },
    {
      name: 'DeFi Yield Optimizer',
      description: 'Automated yield farming across multiple DeFi protocols',
      category: 'Moderate',
      riskLevel: 5,
      expectedReturn: 28,
      winRate: 72,
      minInvestment: 500
    },
    {
      name: 'AI Pattern Recognition',
      description: 'Machine learning algorithm identifying market patterns',
      category: 'Moderate',
      riskLevel: 6,
      expectedReturn: 35,
      winRate: 68,
      minInvestment: 750
    },
    {
      name: 'Arbitrage Hunter',
      description: 'Cross-exchange arbitrage opportunities with minimal risk',
      category: 'Conservative',
      riskLevel: 3,
      expectedReturn: 20,
      winRate: 85,
      minInvestment: 2000
    },
    {
      name: 'Breakout Momentum',
      description: 'Captures explosive moves during key resistance breaks',
      category: 'Aggressive',
      riskLevel: 7,
      expectedReturn: 40,
      winRate: 62,
      minInvestment: 800
    }
  ];

  private bioTemplates = [
    'Crypto enthusiast since {year}. Love finding alpha in the markets.',
    'Professional trader turned algo developer. Building the future of finance.',
    'Former Wall Street analyst now focused on DeFi and crypto trading.',
    'Tech entrepreneur exploring quantitative trading strategies.',
    'Data scientist applying machine learning to cryptocurrency markets.',
    'Full-time trader specializing in {strategy} strategies.',
    'Blockchain developer and trading algorithm creator.',
    'Financial advisor helping clients navigate the crypto landscape.',
    'Former hedge fund manager, now trading independently.',
    'Passionate about decentralized finance and automated trading.'
  ];

  generateUserProfile(index: number): UserProfile {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    const username = this.generateUsername(firstName, lastName);
    const tier = this.generateTier();
    const strategy = this.strategies[Math.floor(Math.random() * this.strategies.length)];

    const joinedDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const daysActive = Math.floor((Date.now() - joinedDate.getTime()) / (24 * 60 * 60 * 1000));

    // Generate realistic trading statistics
    const totalTrades = Math.floor(Math.random() * 500) + 50;
    const winRate = Math.random() * 30 + 60; // 60-90%
    const avgProfitPerTrade = (Math.random() * 200) + 50;
    const totalProfit = totalTrades * avgProfitPerTrade * (winRate / 100);

    return {
      id: `user_${index}`,
      username,
      email: `${username.toLowerCase()}@example.com`,
      firstName,
      lastName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: this.generateBio(strategy.name),
      location: this.locations[Math.floor(Math.random() * this.locations.length)],
      joinedDate,
      tier,
      totalProfit: Number(totalProfit.toFixed(2)),
      winRate: Number(winRate.toFixed(1)),
      totalTrades,
      favoriteStrategy: strategy.name,
      riskTolerance: this.generateRiskTolerance(tier)
    };
  }

  generateTradingStrategy(index: number): TradingStrategy {
    const baseStrategy = this.strategies[index % this.strategies.length];

    const features = this.generateStrategyFeatures(baseStrategy.category);
    const backtestResults = this.generateBacktestResults(baseStrategy);

    return {
      id: `strategy_${index}`,
      ...baseStrategy,
      features,
      backtestResults
    };
  }

  generateTradeRecord(userId: string, index: number): TradeRecord {
    const symbol = this.cryptoSymbols[Math.floor(Math.random() * this.cryptoSymbols.length)];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const amount = Math.random() * 10000 + 100;
    const price = this.generateRealisticPrice(symbol);

    // Generate profit with 70% win rate
    const isWinning = Math.random() < 0.7;
    const profitPercent = isWinning
      ? Math.random() * 15 + 1 // 1-16% profit
      : -(Math.random() * 8 + 1); // 1-9% loss

    const profit = amount * (profitPercent / 100);
    const confidence = Math.random() * 40 + 60; // 60-100% confidence

    const strategy = this.strategies[Math.floor(Math.random() * this.strategies.length)];

    return {
      id: `trade_${index}`,
      userId,
      symbol,
      type,
      amount: Number(amount.toFixed(2)),
      price: Number(price.toFixed(4)),
      profit: Number(profit.toFixed(2)),
      profitPercent: Number(profitPercent.toFixed(2)),
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      strategy: strategy.name,
      confidence: Number(confidence.toFixed(1))
    };
  }

  private generateUsername(firstName: string, lastName: string): string {
    const patterns = [
      `${firstName}${lastName}${Math.floor(Math.random() * 100)}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      `${firstName}Trader${Math.floor(Math.random() * 1000)}`,
      `Crypto${firstName}${Math.floor(Math.random() * 100)}`,
      `${lastName}${Math.floor(Math.random() * 10000)}`,
      `${firstName.slice(0, 3)}${lastName.slice(0, 3)}${Math.floor(Math.random() * 100)}`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private generateTier(): 'basic' | 'premium' | 'pro' {
    const random = Math.random();
    if (random < 0.6) return 'basic';
    if (random < 0.9) return 'premium';
    return 'pro';
  }

  private generateRiskTolerance(tier: string): 'conservative' | 'moderate' | 'aggressive' {
    const weights = tier === 'pro'
      ? [0.2, 0.4, 0.4] // Pro users more aggressive
      : tier === 'premium'
      ? [0.3, 0.5, 0.2] // Premium users moderate
      : [0.5, 0.4, 0.1]; // Basic users conservative

    const random = Math.random();
    if (random < weights[0]) return 'conservative';
    if (random < weights[0] + weights[1]) return 'moderate';
    return 'aggressive';
  }

  private generateBio(strategy: string): string {
    const template = this.bioTemplates[Math.floor(Math.random() * this.bioTemplates.length)];
    const year = 2015 + Math.floor(Math.random() * 8);

    return template
      .replace('{year}', year.toString())
      .replace('{strategy}', strategy.toLowerCase());
  }

  private generateStrategyFeatures(category: string): string[] {
    const allFeatures = {
      conservative: [
        'Risk management protocols',
        'Stop-loss automation',
        'Portfolio diversification',
        'Stable return optimization',
        'Low volatility targeting'
      ],
      moderate: [
        'Technical analysis integration',
        'Market sentiment analysis',
        'Dynamic position sizing',
        'Multi-timeframe analysis',
        'Risk-adjusted returns'
      ],
      aggressive: [
        'High-frequency execution',
        'Leverage optimization',
        'Volatility exploitation',
        'Momentum indicators',
        'Quick profit realization'
      ]
    };

    const categoryFeatures = allFeatures[category.toLowerCase() as keyof typeof allFeatures] || allFeatures.moderate;
    const numFeatures = Math.floor(Math.random() * 3) + 3; // 3-5 features

    return categoryFeatures
      .sort(() => Math.random() - 0.5)
      .slice(0, numFeatures);
  }

  private generateBacktestResults(strategy: any) {
    const periods = ['1 Year', '6 Months', '3 Months', '1 Month'];
    const period = periods[Math.floor(Math.random() * periods.length)];

    const baseReturn = strategy.expectedReturn;
    const variance = baseReturn * 0.3; // 30% variance
    const totalReturn = baseReturn + (Math.random() - 0.5) * variance;

    return {
      period,
      totalReturn: Number(totalReturn.toFixed(1)),
      sharpeRatio: Number((Math.random() * 1.5 + 0.5).toFixed(2)),
      maxDrawdown: Number((Math.random() * 15 + 5).toFixed(1)),
      trades: Math.floor(Math.random() * 1000) + 100
    };
  }

  private generateRealisticPrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BTC/USDT': 45000,
      'ETH/USDT': 2800,
      'BNB/USDT': 320,
      'ADA/USDT': 0.45,
      'SOL/USDT': 95,
      'XRP/USDT': 0.52,
      'DOT/USDT': 6.8,
      'DOGE/USDT': 0.08,
      'AVAX/USDT': 25,
      'SHIB/USDT': 0.000012,
      'MATIC/USDT': 0.85,
      'LTC/USDT': 75
    };

    const basePrice = basePrices[symbol] || 1;
    const variance = 0.1; // 10% price variance

    return basePrice * (1 + (Math.random() - 0.5) * variance);
  }

  // Batch generation methods
  generateUserProfiles(count: number): UserProfile[] {
    return Array.from({ length: count }, (_, i) => this.generateUserProfile(i + 1));
  }

  generateTradingStrategies(): TradingStrategy[] {
    return this.strategies.map((strategy, index) => this.generateTradingStrategy(index));
  }

  generateTradeRecords(userIds: string[], tradesPerUser: number = 10): TradeRecord[] {
    const trades: TradeRecord[] = [];
    let tradeIndex = 1;

    userIds.forEach(userId => {
      for (let i = 0; i < tradesPerUser; i++) {
        trades.push(this.generateTradeRecord(userId, tradeIndex++));
      }
    });

    return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const contentGenerator = new ContentGenerator();