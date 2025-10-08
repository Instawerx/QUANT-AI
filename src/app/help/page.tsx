'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, BookOpen, MessageCircle, Mail } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I get started with QuantTrade AI?',
      answer: 'Simply connect your wallet, approve the QuantMission contract, and start exploring our AI-powered trading features. New users get 3 free Spin to Win attempts!'
    },
    {
      question: 'What cryptocurrencies can I trade?',
      answer: 'We support major cryptocurrencies including BTC, ETH, BNB, SOL, and many more. Our platform integrates with multiple exchanges for comprehensive market coverage.'
    },
    {
      question: 'How does the AI trading work?',
      answer: 'Our Multi-LLM Neural Network analyzes market data 24/7, identifies trading opportunities, and executes trades based on your configured strategies and risk parameters.'
    },
    {
      question: 'Is my wallet safe?',
      answer: 'Yes! We use enterprise-grade security with multi-layer protection. Your private keys never leave your wallet, and all transactions require your explicit approval.'
    },
    {
      question: 'What are the fees?',
      answer: 'We charge a small platform fee on profitable trades. Check our pricing page for detailed tier information. No hidden fees, ever.'
    },
    {
      question: 'Can I withdraw my funds anytime?',
      answer: 'Absolutely! You maintain full control of your assets and can withdraw at any time. Withdrawals are processed immediately to your connected wallet.'
    },
    {
      question: 'How do I participate in Spin to Win?',
      answer: 'Connect your wallet and approve the QuantMission contract. New users get 3 free spins! Additional spins can be earned through trading activity and promotions.'
    },
    {
      question: 'What is the QuantMission contract approval?',
      answer: 'The contract approval enables you to interact with our smart contracts for trading, Spin to Win, and rewards. It\'s a standard Web3 security practice and can be revoked anytime.'
    }
  ];

  const quickLinks = [
    { icon: BookOpen, title: 'Documentation', description: 'Comprehensive guides and tutorials', href: '/docs' },
    { icon: MessageCircle, title: 'Community', description: 'Join our Discord community', href: '/community' },
    { icon: Mail, title: 'Contact Support', description: 'Get help from our team', href: '/contact' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions and get support
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10 h-12"
            />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                    <link.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Still need help?</h3>
              <p className="text-muted-foreground">
                Our support team is here to assist you 24/7
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-6">
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
