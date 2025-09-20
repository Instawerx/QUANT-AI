import Link from "next/link";
import { Button } from "./ui/button";
import { Zap, Trophy, CandlestickChart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ConnectWalletButton } from "./connect-wallet-button";

export function PredictionHeader() {
  const navItems = [
    { name: "Prediction", href: "/prediction", icon: <CandlestickChart /> },
    { name: "Leaderboard", href: "#", icon: <Trophy /> },
    { name: "Lottery", href: "#", icon: <Zap /> },
  ];

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Button key={item.name} variant="link" asChild className="text-foreground/80 hover:text-foreground text-base px-4 py-6 border-b-2 border-transparent hover:border-primary data-[active=true]:border-primary data-[active=true]:text-foreground" data-active={item.href === "/prediction"}>
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile: Prediction link always visible */}
            <Button variant="link" asChild className="text-foreground/80 hover:text-foreground text-base px-2 py-6 border-b-2 border-primary text-foreground" data-active={true}>
              <Link href="/prediction">
                <CandlestickChart />
                <span className="ml-2">Prediction</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="sr-only">Prediction Menu</SheetTitle>
                  <SheetDescription className="sr-only">Prediction-related navigation menu</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                   <div className="mt-4">
                    <ConnectWalletButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
