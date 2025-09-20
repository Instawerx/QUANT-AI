import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Award, UserPlus } from "lucide-react";

export function CtaSection() {
  return (
    <section id="cta" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-br from-primary/80 to-primary/60 border-primary text-primary-foreground overflow-hidden">
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-3xl md:text-4xl font-headline">Join the Trading Revolution</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-2">
                  Be one of the first 10,000 users to get a 30-day free trial and experience the future of trading. No commitments.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-3 text-primary-foreground/90">
                  <li className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5 text-accent" />
                    <span>Full access to all AI trading tools.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-accent" />
                    <span>Earn a referral link to share and benefit.</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg glow-green font-bold text-lg px-8 py-6">
                    <Link href="/signup">
                      Start Your Free Trial
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
            <div className="hidden md:block relative h-full">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent"></div>
              <svg className="absolute bottom-0 left-0 -translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
                <defs>
                  <pattern id="d1b1e4b4-x" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" className="text-primary/40" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="404" height="404" fill="url(#d1b1e4b4-x)" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
