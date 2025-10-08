'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you create an account or use our services, we collect personal information including your name, email address, wallet address, and contact details. We also collect information you provide when communicating with our support team or participating in surveys.'
        },
        {
          subtitle: 'Financial Information',
          text: 'We collect transaction data, trading history, deposit and withdrawal records, and wallet addresses. This information is necessary to provide our trading services and comply with regulatory requirements.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our platform, including IP addresses, browser types, device information, pages visited, features used, and timestamps of activities.'
        },
        {
          subtitle: 'Blockchain Data',
          text: 'As a Web3 platform, we process publicly available blockchain data including transaction hashes, smart contract interactions, and wallet activities relevant to your use of our services.'
        }
      ]
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to operate and maintain the QuantTrade AI platform, execute trades on your behalf, process deposits and withdrawals, and provide customer support.'
        },
        {
          subtitle: 'Platform Improvement',
          text: 'Your usage data helps us analyze platform performance, develop new features, improve our AI trading algorithms, and enhance user experience.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send service updates, security alerts, trading notifications, and marketing communications (which you can opt out of at any time).'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We process your information to comply with applicable laws, regulations, and legal processes, including KYC/AML requirements, tax reporting obligations, and responding to lawful requests from authorities.'
        }
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures including end-to-end encryption, secure socket layer (SSL) technology, multi-factor authentication, and regular security audits. Your private keys never touch our servers.'
        },
        {
          subtitle: 'Data Storage',
          text: 'Your data is stored on secure servers with redundant backups, access controls, and monitoring systems. We use cold storage for cryptocurrency assets and employ defense-in-depth security strategies.'
        },
        {
          subtitle: 'Employee Access',
          text: 'Access to personal information is restricted to authorized personnel who need it to perform their job functions. All employees undergo security training and are bound by confidentiality agreements.'
        }
      ]
    },
    {
      icon: Eye,
      title: 'Data Sharing and Disclosure',
      content: [
        {
          subtitle: 'Third-Party Service Providers',
          text: 'We may share data with trusted service providers who assist in operating our platform, including cloud hosting providers, analytics services, and customer support tools. These providers are contractually obligated to protect your information.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, to enforce our terms of service, protect our rights and safety, prevent fraud, or respond to legal processes such as subpoenas or court orders.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections outlined in this policy.'
        },
        {
          subtitle: 'No Sale of Data',
          text: 'We do not sell, rent, or trade your personal information to third parties for their marketing purposes.'
        }
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights and Choices',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access your personal information and request corrections to inaccurate data. You can update most information directly through your account settings.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You may request deletion of your account and personal information, subject to legal retention requirements. Some information may be retained for fraud prevention and regulatory compliance.'
        },
        {
          subtitle: 'Marketing Opt-Out',
          text: 'You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in our emails or updating your communication preferences in account settings.'
        },
        {
          subtitle: 'Do Not Track',
          text: 'Some browsers support "Do Not Track" signals. Our platform currently does not respond to these signals, but we limit tracking to essential analytics and performance monitoring.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'International Data Transfers',
      content: [
        {
          subtitle: 'Cross-Border Transfers',
          text: 'As a global platform, your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.'
        },
        {
          subtitle: 'Data Protection Standards',
          text: 'We comply with applicable data protection laws including GDPR for European users, CCPA for California residents, and other regional privacy regulations.'
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/10 mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: October 7, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              At QuantTrade AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered trading platform. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
            <p className="text-muted-foreground">
              By accessing or using QuantTrade AI, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="inline-flex p-2 rounded-lg bg-purple-600/10">
                    <section.icon className="h-5 w-5 text-purple-600" />
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

        {/* Additional Sections */}
        <div className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to enhance your experience, analyze platform usage, and personalize content. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our platform.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Types of Cookies We Use:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics Cookies:</strong> Collect information about platform usage and performance</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                You can control cookie preferences through your browser settings, though disabling certain cookies may affect platform functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                QuantTrade AI is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete such information. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining retention periods, we consider:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>The nature and sensitivity of the information</li>
                <li>Legal and regulatory requirements</li>
                <li>The purposes for which we collected the information</li>
                <li>Whether we can achieve those purposes through other means</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last Updated" date. Your continued use of QuantTrade AI after such changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@quanttradeai.com</p>
                <p><strong>Address:</strong> QuantTrade AI Data Protection Officer<br />
                123 Trading Plaza, Suite 500<br />
                New York, NY 10001, USA</p>
                <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 30 days.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            This Privacy Policy is effective as of the date stated above and applies to all users of the QuantTrade AI platform.
            We are committed to protecting your privacy and maintaining the security of your personal information.
          </p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
