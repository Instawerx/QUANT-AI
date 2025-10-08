'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Server, Key, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Smart Contract Audits',
      description: 'All smart contracts undergo rigorous third-party security audits before deployment',
      status: 'Verified'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data transmission is protected with industry-standard TLS 1.3 encryption',
      status: 'Active'
    },
    {
      icon: Key,
      title: 'Non-Custodial Architecture',
      description: 'Your private keys never leave your wallet - you maintain complete control',
      status: 'Guaranteed'
    },
    {
      icon: Server,
      title: 'Secure Infrastructure',
      description: 'Multi-region cloud infrastructure with automated failover and DDoS protection',
      status: 'Enterprise'
    },
    {
      icon: Eye,
      title: 'Real-time Monitoring',
      description: '24/7 security monitoring with automated threat detection and response',
      status: 'Active'
    },
    {
      icon: FileCheck,
      title: 'Regular Penetration Testing',
      description: 'Quarterly security assessments by independent cybersecurity firms',
      status: 'Ongoing'
    }
  ];

  const bestPractices = [
    {
      title: 'Use Strong Passwords',
      description: 'Create unique, complex passwords and never reuse them across platforms',
      icon: CheckCircle
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security with 2FA on your account',
      icon: CheckCircle
    },
    {
      title: 'Verify Smart Contract Addresses',
      description: 'Always double-check contract addresses before approving transactions',
      icon: CheckCircle
    },
    {
      title: 'Keep Software Updated',
      description: 'Regularly update your wallet software and browser extensions',
      icon: CheckCircle
    },
    {
      title: 'Beware of Phishing',
      description: 'Never share your private keys or seed phrases with anyone',
      icon: AlertTriangle
    },
    {
      title: 'Use Hardware Wallets',
      description: 'For large holdings, consider using a hardware wallet for added security',
      icon: CheckCircle
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Shield className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Security First
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Your assets and data are protected by enterprise-grade security measures
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Security Features */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Security Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Multiple layers of protection to keep your assets safe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Smart Contract Security */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-purple-600" />
                  Smart Contract Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our smart contracts are developed following industry best practices and undergo comprehensive security audits by leading blockchain security firms. All contract code is open source and verifiable on the blockchain.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">3+</div>
                    <div className="text-sm text-muted-foreground">Security Audits</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">Open Source</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
                    <div className="text-sm text-muted-foreground">Security Incidents</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Security Best Practices</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Follow these guidelines to maximize your account security
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {bestPractices.map((practice, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        practice.icon === AlertTriangle
                          ? 'bg-yellow-500/10'
                          : 'bg-green-500/10'
                      }`}>
                        <practice.icon className={`h-5 w-5 ${
                          practice.icon === AlertTriangle
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{practice.title}</CardTitle>
                        <CardDescription>{practice.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Bug Bounty */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-3xl font-bold">Security Researchers Welcome</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We value the security research community. If you discover a vulnerability, please report it responsibly to our security team.
                </p>
                <div>
                  <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-11 px-8">
                    Report Security Issue
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-3xl font-bold">Compliance & Regulations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantTrade AI operates in compliance with applicable regulations and follows industry best practices for data protection and privacy.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                GDPR Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                SOC 2 Type II
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                ISO 27001
              </Badge>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
