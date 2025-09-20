import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

type HeroSectionProps = {
  slogan: string;
  content: string;
}

export function HeroSection({ slogan, content }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32 bg-grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent"></div>
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(166,74,201,0.3),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Button asChild variant="outline" className="mb-6 rounded-full border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
            <Link href="#features">
              Explore QuantTrade AI Features
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-4xl md:text-6xl font-headline font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300">
            {slogan}
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            {content}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-purple font-bold text-lg px-8 py-6">
              <Link href="/signup">
                Start 30-Day Free Trial
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold text-lg px-8 py-6">
              <Link href="/prediction">
                See Live Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
