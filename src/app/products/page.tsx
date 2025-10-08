'use client';

export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductsSection } from "@/components/products-section";

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
}
