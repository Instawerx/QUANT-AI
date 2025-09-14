import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FxTradingSection } from "@/components/fx-trading-section";

export default function FxTradingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <FxTradingSection />
      </main>
      <Footer />
    </div>
  );
}
