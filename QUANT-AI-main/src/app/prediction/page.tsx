import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PredictionHeader } from "@/components/prediction-header";
import { PredictionCard } from "@/components/prediction-card";
import { PredictionHistory } from "@/components/prediction-history";
import { HowToPlaySidebar } from "@/components/how-to-play-sidebar";

export default function PredictionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PredictionHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PredictionCard />
            <PredictionHistory />
          </div>
          <div>
            <HowToPlaySidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
