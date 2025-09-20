import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FuturesOptionsSection } from "@/components/futures-options-section";

export default function FuturesOptionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <FuturesOptionsSection />
      </main>
      <Footer />
    </div>
  );
}
