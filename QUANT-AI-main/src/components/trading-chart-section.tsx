import { TradingChart } from './trading-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function TradingChartSection() {
  return (
    <section id="chart" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Live Crypto Futures Charts</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            These real-time charts demonstrate market movements our AI operates on with up to 100x leverage.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>Solana/USDT Futures</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="BINANCE:SOLUSDT" />
            </CardContent>
          </Card>
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
        </div>
      </div>
    </section>
  );
}
