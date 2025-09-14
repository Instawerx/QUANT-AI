import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const navItems = [
    { name: "Features", href: "/#features" },
    { name: "Products", href: "/products" },
    { name: "Chart", href: "/#chart" },
    { name: "Prediction", href: "/prediction" },
    { name: "Crypto", href: "/crypto" },
    { name: "FX Trading", href: "/fx-trading" },
    { name: "Futures & Options", href: "/futures-and-options" },
    { name: "Start Trial", href: "/#cta" },
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
