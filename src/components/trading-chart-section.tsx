import { TradingChart } from './trading-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function TradingChartSection() {
  return (
    <section id="chart" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Live Polygon/USDT Futures Chart</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            This real-time chart shows Polygon/USDT futures, demonstrating market movements. Our AI operates on these charts with up to 100x leverage.
          </p>
        </div>
        <Card className="shadow-lg shadow-primary/10 overflow-hidden">
          <CardContent className="p-0">
            <TradingChart />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
