import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TradingChartSection } from "@/components/trading-chart-section";

export default function CryptoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <TradingChartSection />
      </main>
      <Footer />
    </div>
  );
}
