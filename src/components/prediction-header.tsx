import Link from "next/link";
import { Button } from "./ui/button";
import { Zap, Trophy, CandlestickChart } from "lucide-react";

export function PredictionHeader() {
  const navItems = [
    { name: "Prediction", href: "/prediction", icon: <CandlestickChart /> },
    { name: "Leaderboard", href: "#", icon: <Trophy /> },
    { name: "Lottery", href: "#", icon: <Zap /> },
  ];

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Button key={item.name} variant="link" asChild className="text-foreground/80 hover:text-foreground text-base px-4 py-6 border-b-2 border-transparent hover:border-primary data-[active=true]:border-primary data-[active=true]:text-foreground" data-active={item.href === "/prediction"}>
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline">Connect Wallet</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
