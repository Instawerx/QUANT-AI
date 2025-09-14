import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { ConnectWalletButton } from "./connect-wallet-button";

export function Header() {
  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Chart", href: "#chart" },
    { name: "Start Trial", href: "#cta" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Button key={item.name} variant="link" asChild className="text-foreground/80 hover:text-foreground text-base">
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
