import { TradingChart } from './trading-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function FuturesOptionsSection() {
  return (
    <section id="futures-chart" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Live Futures & Options Charts</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real-time charts for popular futures and options contracts.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>Bitcoin/USDT Futures</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="BINANCE:BTCUSDT" />
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>Ethereum/USDT Futures</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="BINANCE:ETHUSDT" />
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>Solana/USDT Futures</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="BINANCE:SOLUSDT" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
