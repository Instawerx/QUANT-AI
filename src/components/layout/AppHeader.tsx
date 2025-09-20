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
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: BarChart3,
      description: 'View your trading performance and analytics'
    },
    {
      title: 'AI Trading',
      href: '/trading',
      icon: Brain,
      description: 'Start automated AI-powered trading'
    },
    {
      title: 'Portfolio',
      href: '/portfolio',
      icon: Wallet,
      description: 'Manage your crypto portfolio'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Configure your trading preferences'
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
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
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
              {navigationItems.map((item) => (
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