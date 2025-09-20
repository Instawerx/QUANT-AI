import { TradingChart } from './trading-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function FxTradingSection() {
  return (
    <section id="fx-chart" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Live Forex Charts</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real-time charts for the top traded Forex pairs.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>EUR/USD</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="FX:EURUSD" />
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>USD/JPY</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="FX:USDJPY" />
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/10 overflow-hidden">
            <CardHeader>
              <CardTitle>GBP/USD</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart symbol="FX:GBPUSD" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
