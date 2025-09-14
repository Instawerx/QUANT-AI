import { TradingChart } from './trading-chart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function FuturesOptionsSection() {
  return (
    <section id="futures-chart" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">US Stocks & ETFs</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real-time charts for popular US stocks and exchange-traded funds (ETFs).
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>SPDR S&P 500 ETF (SPY)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="ARCA:SPY" />
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>Apple Inc. (AAPL)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="NASDAQ:AAPL" />
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>Tesla, Inc. (TSLA)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="NASDAQ:TSLA" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
