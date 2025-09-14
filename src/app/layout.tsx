import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { LiveGainsTicker } from '@/components/live-gains-ticker';
import { WalletProvider } from '@/context/wallet-context';
import { SignUpToast } from '@/components/signup-toast';

export const metadata: Metadata = {
  title: 'QuantTrade AI',
  description: 'The future of automated cryptocurrency trading. Leverage our Multi LLM Neural Network for unparalleled success.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <WalletProvider>
          {children}
          <Toaster />
          <SignUpToast />
          <LiveGainsTicker />
        </WalletProvider>
      </body>
    </html>
  );
}
