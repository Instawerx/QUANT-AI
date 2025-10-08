'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MessageSquare, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    }, 5000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email anytime',
      details: 'support@quanttradeai.com',
      color: 'text-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: '24/7 live chat support',
      details: 'Available on platform',
      color: 'text-green-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our team',
      details: '+1 (555) 123-4567',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      description: 'Visit our headquarters',
      details: '123 Trading Plaza, Suite 500, New York, NY 10001',
      color: 'text-orange-600'
    }
  ];

  const departments = [
    {
      title: 'General Support',
      email: 'support@quanttradeai.com',
      description: 'Account issues, platform questions, technical support'
    },
    {
      title: 'Sales Inquiries',
      email: 'sales@quanttradeai.com',
      description: 'Pricing, enterprise solutions, partnership opportunities'
    },
    {
      title: 'Legal & Compliance',
      email: 'legal@quanttradeai.com',
      description: 'Terms of service, privacy policy, regulatory matters'
    },
    {
      title: 'Media & Press',
      email: 'press@quanttradeai.com',
      description: 'Press inquiries, media kits, interviews'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions? We're here to help. Our support team is available 24/7 to assist you with any inquiries.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="p-6">
                <div className="inline-flex p-3 rounded-lg bg-muted mb-4">
                  <method.icon className={`h-6 w-6 ${method.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                <p className="text-sm font-medium">{method.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="sales">Sales & Partnerships</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Support Hours & Departments */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Live Chat</span>
                  <span className="text-muted-foreground">24/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Email Support</span>
                  <span className="text-muted-foreground">24/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Phone Support</span>
                  <span className="text-muted-foreground">Mon-Fri, 9AM-6PM EST</span>
                </div>
                <div className="mt-4 p-3 bg-blue-600/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-blue-600">Priority Support</strong> is available for Pro and Enterprise plan subscribers with guaranteed response times.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Contacts</CardTitle>
                <CardDescription>
                  Contact the right team for faster assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, idx) => (
                  <div key={idx}>
                    {idx > 0 && <div className="border-t my-3" />}
                    <div>
                      <h4 className="font-semibold mb-1">{dept.title}</h4>
                      <p className="text-sm text-blue-600 mb-1">{dept.email}</p>
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Need Quick Answers?</CardTitle>
            <CardDescription>
              Check out our help center for instant solutions to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-start gap-2">
                <span className="font-semibold">Getting Started Guide</span>
                <span className="text-sm text-muted-foreground text-left">
                  Learn how to set up your account and start trading
                </span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-start gap-2">
                <span className="font-semibold">FAQ</span>
                <span className="text-sm text-muted-foreground text-left">
                  Find answers to frequently asked questions
                </span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-start gap-2">
                <span className="font-semibold">Video Tutorials</span>
                <span className="text-sm text-muted-foreground text-left">
                  Watch step-by-step guides and demonstrations
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media & Community */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <p className="text-muted-foreground mb-6">
            Follow us on social media for updates, tips, and community discussions
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg">Twitter</Button>
            <Button variant="outline" size="lg">Discord</Button>
            <Button variant="outline" size="lg">Telegram</Button>
            <Button variant="outline" size="lg">LinkedIn</Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
