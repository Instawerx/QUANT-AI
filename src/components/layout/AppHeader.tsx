'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { WalletConnectButton, NetworkSwitcher } from '@/components/wallet';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Brain,
  BarChart3,
  Wallet,
  Settings,
  HelpCircle,
  Menu,
  X,
  Zap,
  Gift
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavigationItems = [
    {
      title: 'Features',
      href: '/features',
      icon: Zap,
      description: 'Explore powerful AI trading features'
    },
    {
      title: 'How It Works',
      href: '/how-it-works',
      icon: HelpCircle,
      description: 'Learn about our platform'
    },
    {
      title: 'Products',
      href: '/products',
      icon: Brain,
      description: 'View our product offerings'
    },
    {
      title: 'Pricing',
      href: '/pricing',
      icon: BarChart3,
      description: 'View pricing plans'
    }
  ];

  const userNavigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'View your trading performance'
    },
    {
      title: 'Portfolio',
      href: '/portfolio',
      icon: Wallet,
      description: 'Manage your crypto portfolio'
    },
    {
      title: 'Trading',
      href: '/trading',
      icon: Brain,
      description: 'AI-powered trading interface'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Configure your preferences'
    }
  ];

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-600" />
              <Zap className="absolute -top-1 -right-1 h-4 w-4 text-lime-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                QuantTrade AI
              </h1>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs bg-lime-400 text-black">
                  AI
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Beta
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <NavigationMenu>
            <NavigationMenuList>
              {publicNavigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <a href="/spin">
            <Button variant="outline" size="sm" className="border-purple-500 text-purple-600 hover:bg-purple-500/10">
              <Gift className="h-4 w-4 mr-2" />
              🎰 Spin to Win
            </Button>
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <NetworkSwitcher />
          <WalletConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {/* Mobile Navigation */}
            <div className="space-y-2">
              {publicNavigationItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </a>
              ))}
              <a
                href="/spin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-purple-500/10 text-purple-600 hover:bg-purple-500/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Gift className="h-4 w-4" />
                🎰 Spin to Win
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <LanguageSelector />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network</span>
                <NetworkSwitcher />
              </div>
              <WalletConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}