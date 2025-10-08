'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Shield, Users, Globe, AlertCircle, CheckCircle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
              <FileCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold">Compliance</h1>
            <p className="text-xl text-muted-foreground">
              Our commitment to regulatory compliance and responsible operations
            </p>
          </div>

          {/* Regulatory Approach */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Regulatory Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                QuantTrade AI is committed to operating in full compliance with applicable laws and regulations. We work proactively with regulators and legal experts to ensure our platform meets the highest standards of regulatory compliance.
              </p>
              <p>
                Our compliance program is designed to protect our users, maintain market integrity, and prevent financial crime while enabling innovative blockchain-based services.
              </p>
            </CardContent>
          </Card>

          {/* Compliance Areas */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Compliance Framework</h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  <div>
                    <CardTitle>Know Your Customer (KYC)</CardTitle>
                    <CardDescription>Identity verification and customer due diligence</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  We implement robust KYC procedures to verify the identity of our users and ensure compliance with anti-money laundering regulations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Identity Verification
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Document Authentication
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Ongoing Monitoring
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>Anti-Money Laundering (AML)</CardTitle>
                    <CardDescription>Preventing financial crime and illicit activities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Our AML program includes transaction monitoring, suspicious activity reporting, and compliance with international AML standards.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                    <span>Real-time transaction monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                    <span>Suspicious Activity Report (SAR) filing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                    <span>Sanctions screening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                    <span>Enhanced due diligence for high-risk customers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle>Data Protection & Privacy</CardTitle>
                    <CardDescription>GDPR, CCPA, and global privacy regulations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  We comply with international data protection regulations including GDPR and CCPA, ensuring your personal information is handled securely and transparently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Data minimization</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Right to access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Right to deletion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Data portability</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                  <div>
                    <CardTitle>Sanctions Compliance</CardTitle>
                    <CardDescription>OFAC, UN, and international sanctions screening</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  We maintain comprehensive sanctions screening procedures to ensure compliance with OFAC, UN, EU, and other international sanctions programs.
                </p>
                <p className="text-muted-foreground text-sm">
                  Users from sanctioned jurisdictions or individuals on sanctions lists are prohibited from accessing our services.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Certifications */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Certifications & Standards</h2>
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">SOC 2</div>
                    <div className="text-sm text-muted-foreground">Type II Certified</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">ISO 27001</div>
                    <div className="text-sm text-muted-foreground">Information Security</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">GDPR</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Compliance Reporting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have concerns about potential violations of our compliance policies or applicable laws, please report them through our secure reporting channels.
              </p>
              <div className="flex gap-4">
                <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-6">
                  Report an Issue
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-2">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Compliance requirements vary by jurisdiction. Users are responsible for ensuring their use of QuantTrade AI complies with local laws and regulations. This page provides general information about our compliance approach and should not be considered legal advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
