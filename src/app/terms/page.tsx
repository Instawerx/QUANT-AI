'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertTriangle, Scale, Ban, Shield, Gavel } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing or using the QuantTrade AI platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not access or use our services.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old and have the legal capacity to enter into contracts in your jurisdiction. By using our services, you represent and warrant that you meet these eligibility requirements.'
        },
        {
          subtitle: 'Account Registration',
          text: 'To use certain features of QuantTrade AI, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and current. You are responsible for maintaining the confidentiality of your account credentials.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Use of Services',
      content: [
        {
          subtitle: 'License Grant',
          text: 'Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the QuantTrade AI platform for your personal or internal business purposes.'
        },
        {
          subtitle: 'Permitted Uses',
          text: 'You may use our platform to access AI-powered trading services, manage your trading portfolio, view market analysis, and utilize features we make available to you. You must comply with all applicable laws and regulations when using our services.'
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You agree not to: (a) violate any laws or regulations; (b) infringe on intellectual property rights; (c) transmit harmful code or malware; (d) attempt to gain unauthorized access to our systems; (e) manipulate or interfere with platform operations; (f) use automated systems to access the platform without permission; (g) engage in market manipulation or fraud; or (h) use the platform for money laundering or other illegal activities.'
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Trading Risks and Disclaimers',
      content: [
        {
          subtitle: 'Investment Risk',
          text: 'Trading cryptocurrency and financial instruments involves substantial risk of loss. You acknowledge that you may lose some or all of your invested capital. Past performance does not guarantee future results. The AI trading algorithms are not infallible and may experience losses.'
        },
        {
          subtitle: 'No Financial Advice',
          text: 'QuantTrade AI provides automated trading services but does not provide financial, investment, legal, or tax advice. Any information or analysis provided through the platform is for informational purposes only. You should consult with qualified professionals before making investment decisions.'
        },
        {
          subtitle: 'Market Volatility',
          text: 'Cryptocurrency markets are highly volatile and unpredictable. Market conditions can change rapidly, and the AI algorithms may not always respond optimally to sudden market movements. You accept full responsibility for your trading decisions.'
        },
        {
          subtitle: 'No Guaranteed Returns',
          text: 'We make no guarantees, representations, or warranties regarding potential profits or returns. Any performance metrics, success rates, or returns displayed on the platform are estimates based on historical data and do not guarantee future performance.'
        }
      ]
    },
    {
      icon: Scale,
      title: 'Fees and Payments',
      content: [
        {
          subtitle: 'Service Fees',
          text: 'Use of QuantTrade AI is subject to fees as described on our pricing page. We reserve the right to modify our fee structure with 30 days notice to users. Continued use of the platform after fee changes constitutes acceptance of the new fees.'
        },
        {
          subtitle: 'Transaction Fees',
          text: 'In addition to service fees, you are responsible for all blockchain transaction fees (gas fees), exchange fees, and any other third-party fees associated with your trading activities.'
        },
        {
          subtitle: 'Payment Terms',
          text: 'Fees are non-refundable except as required by law. You authorize us to charge fees to your connected wallet or payment method. Failure to pay fees may result in suspension or termination of your account.'
        }
      ]
    },
    {
      icon: Ban,
      title: 'Intellectual Property',
      content: [
        {
          subtitle: 'Platform Ownership',
          text: 'QuantTrade AI and all related technology, software, algorithms, trademarks, and content are the exclusive property of QuantTrade AI and its licensors. These Terms do not grant you any ownership rights in the platform or our intellectual property.'
        },
        {
          subtitle: 'User Content',
          text: 'You retain ownership of any content you submit to the platform. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with operating the platform.'
        },
        {
          subtitle: 'Restrictions',
          text: 'You may not copy, modify, reverse engineer, decompile, or create derivative works based on the QuantTrade AI platform or its underlying technology without our express written permission.'
        }
      ]
    },
    {
      icon: Gavel,
      title: 'Limitation of Liability',
      content: [
        {
          subtitle: 'Disclaimer of Warranties',
          text: 'THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.'
        },
        {
          subtitle: 'Limitation of Damages',
          text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUANTTRADE AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR TRADING LOSSES, ARISING FROM YOUR USE OF THE PLATFORM.'
        },
        {
          subtitle: 'Maximum Liability',
          text: 'Our total liability to you for all claims arising from or relating to these Terms or the platform shall not exceed the amount of fees you paid to us in the twelve months preceding the claim.'
        },
        {
          subtitle: 'Force Majeure',
          text: 'We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including acts of God, natural disasters, war, terrorism, labor disputes, or technical failures.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: October 7, 2025
          </p>
        </div>

        {/* Warning Alert */}
        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-600 dark:text-amber-400">
            <strong>Important Notice:</strong> Trading involves substantial risk of loss. Please read these Terms carefully before using our platform. By continuing to use QuantTrade AI, you acknowledge that you understand and accept these risks.
          </AlertDescription>
        </Alert>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              These Terms of Service ("Terms") govern your access to and use of QuantTrade AI, an AI-powered cryptocurrency trading platform. These Terms constitute a legally binding agreement between you and QuantTrade AI.
            </p>
            <p className="text-muted-foreground">
              Please read these Terms carefully. By creating an account, connecting your wallet, or using any part of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must immediately discontinue use of the platform.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="inline-flex p-2 rounded-lg bg-blue-600/10">
                    <section.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    {itemIdx > 0 && <Separator className="my-4" />}
                    <h3 className="font-semibold mb-2">{item.subtitle}</h3>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Important Sections */}
        <div className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Termination by You</h3>
                <p className="text-muted-foreground">
                  You may terminate your account at any time by withdrawing all funds and contacting our support team. You remain responsible for all activities that occurred under your account prior to termination.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Termination by Us</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account at any time for: (a) violation of these Terms; (b) suspected fraudulent or illegal activity; (c) extended periods of inactivity; (d) risk to platform security or integrity; or (e) as required by law. Upon termination, you must immediately withdraw all funds and cease using the platform.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Effects of Termination</h3>
                <p className="text-muted-foreground">
                  Upon termination, your license to use the platform immediately ends. Sections of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection, use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the platform, you consent to our data practices as described in the Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless QuantTrade AI and its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from: (a) your use of the platform; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) your trading activities conducted through the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Arbitration Agreement</h3>
                <p className="text-muted-foreground">
                  Any dispute arising from these Terms or your use of the platform shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. Arbitration shall take place in New York, NY. You waive your right to a jury trial and to participate in class actions.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Exceptions to Arbitration</h3>
                <p className="text-muted-foreground">
                  Either party may seek injunctive or other equitable relief in court to prevent infringement of intellectual property rights or to protect confidential information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>Posting the updated Terms on the platform</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending email notifications for significant changes</li>
                <li>Displaying a notice on the platform</li>
              </ul>
              <p className="text-muted-foreground">
                Your continued use of the platform after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the platform and terminate your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Miscellaneous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Entire Agreement</h3>
                <p className="text-muted-foreground">
                  These Terms, together with our Privacy Policy and any other legal notices published on the platform, constitute the entire agreement between you and QuantTrade AI.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Severability</h3>
                <p className="text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Waiver</h3>
                <p className="text-muted-foreground">
                  Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Assignment</h3>
                <p className="text-muted-foreground">
                  You may not assign or transfer these Terms or your account without our prior written consent. We may assign our rights and obligations without restriction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@quanttradeai.com</p>
                <p><strong>Address:</strong> QuantTrade AI Legal Department<br />
                123 Trading Plaza, Suite 500<br />
                New York, NY 10001, USA</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            By using QuantTrade AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            These Terms are effective as of the date stated above.
          </p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
