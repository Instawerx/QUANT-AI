'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Twitter,
  Github,
  MessageCircle,
  Mail,
  Shield,
  Clock,
  Users,
  ExternalLink
} from 'lucide-react';

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'API', href: '/api' },
      { label: 'Documentation', href: '/docs' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Risk Disclosure', href: '/risk' },
      { label: 'Compliance', href: '/compliance' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' },
      { label: 'Security', href: '/security' },
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/quanttradeai', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg/quanttradeai', label: 'Discord' },
    { icon: Github, href: 'https://github.com/quanttradeai', label: 'GitHub' },
    { icon: Mail, href: 'mailto:support@quanttradeai.com', label: 'Email' },
  ];

  const trustIndicators = [
    { icon: Shield, label: 'SOC 2 Compliant', description: 'Enterprise security' },
    { icon: Clock, label: '99.9% Uptime', description: 'Reliable service' },
    { icon: Users, label: '10K+ Users', description: 'Trusted by traders' },
  ];

  return (
    <footer className="bg-background border-t">
      {/* Trust Indicators */}
      <div className="border-b bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <indicator.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">{indicator.label}</div>
                  <div className="text-sm text-muted-foreground">{indicator.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  QuantTrade AI
                </h3>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs bg-lime-400 text-black">
                    Multi-LLM
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Neural Network
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              The most advanced AI-powered cryptocurrency trading platform.
              These aren't your grandfather's trading bots.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold mb-1">Stay updated with QuantTrade AI</h4>
              <p className="text-sm text-muted-foreground">
                Get the latest trading insights and platform updates
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-md border bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} QuantTrade AI. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>All systems operational</span>
              </div>
              <a
                href="/status"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Status
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
        <div className="container py-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Risk Warning:</strong> Trading cryptocurrencies involves substantial risk and may not be suitable for all investors.
            Past performance does not guarantee future results. Please consider your investment objectives and risk tolerance before trading.
          </p>
        </div>
      </div>
    </footer>
  );
}