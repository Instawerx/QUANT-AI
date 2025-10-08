'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, DollarSign, Shield, Info } from 'lucide-react';

export default function RiskPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-5xl font-bold">Risk Disclosure</h1>
            <p className="text-xl text-muted-foreground">
              Important information about cryptocurrency trading risks
            </p>
          </div>

          {/* Warning Card */}
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-semibold text-lg">High Risk Investment Warning</p>
                  <p className="text-muted-foreground">
                    Trading cryptocurrencies carries a high level of risk and may not be suitable for all investors. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Key Risk Factors</h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                  <CardTitle>Market Volatility</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>
                  Cryptocurrency markets are highly volatile and can experience rapid price movements. Prices can fluctuate significantly within short periods, potentially resulting in substantial gains or losses.
                </p>
                <p>
                  Past performance is not indicative of future results. Historical data and AI predictions should not be solely relied upon for making investment decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                  <CardTitle>Leverage and Margin Trading</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>
                  Using leverage amplifies both potential profits and losses. Trading with leverage can result in losses exceeding your initial investment.
                </p>
                <p>
                  Margin calls may occur if your account balance falls below required levels, potentially resulting in the automatic liquidation of your positions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <CardTitle>Technology and Security Risks</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>
                  While we implement robust security measures, no system is completely immune to cyber attacks, technical failures, or unauthorized access.
                </p>
                <p>
                  Smart contract risks include potential bugs or vulnerabilities despite thorough auditing. Blockchain networks may experience congestion, forks, or other technical issues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Info className="h-6 w-6 text-purple-600" />
                  <CardTitle>AI and Algorithmic Trading Limitations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>
                  AI trading algorithms are based on historical data and mathematical models. They cannot predict unprecedented market events or guarantee profitable outcomes.
                </p>
                <p>
                  Automated trading systems may experience technical failures, connectivity issues, or unexpected behavior during extreme market conditions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Risks */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Additional Considerations</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-2" />
                    <span><strong>Regulatory Risk:</strong> Cryptocurrency regulations vary by jurisdiction and are subject to change, potentially affecting your ability to trade or access funds.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-2" />
                    <span><strong>Liquidity Risk:</strong> Some cryptocurrencies may have limited liquidity, making it difficult to execute large trades at desired prices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-2" />
                    <span><strong>Counterparty Risk:</strong> Trading through exchanges or platforms involves reliance on third parties who may experience financial difficulties or operational failures.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-2" />
                    <span><strong>Tax Implications:</strong> Cryptocurrency transactions may have tax consequences. Consult with a tax professional regarding your specific situation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 mt-2" />
                    <span><strong>No Guarantees:</strong> QuantTrade AI does not guarantee profits or protection against losses. All trading involves risk.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Risk Management */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Risk Management Recommendations</h2>
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span>Only invest what you can afford to lose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span>Diversify your portfolio across different assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span>Use stop-loss orders to limit potential losses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span>Start with smaller positions and use lower leverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span>Continuously educate yourself about market dynamics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
                    <span>Regularly review and adjust your risk tolerance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-2">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <strong>Disclaimer:</strong> This risk disclosure does not disclose all possible risks. You should carefully consider whether trading is appropriate for you in light of your experience, objectives, financial resources, and other relevant circumstances. If you are unsure, seek independent financial advice before trading.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                By using QuantTrade AI, you acknowledge that you have read, understood, and accepted the risks associated with cryptocurrency trading.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
