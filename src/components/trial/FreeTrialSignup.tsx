'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Gift,
  Clock,
  Star,
  Shield,
  Zap,
  Users,
  AlertCircle,
  CheckCircle,
  Copy,
  Share2
} from 'lucide-react';
import { useWallet } from '@/lib/web3/hooks/useWallet';
import { toast } from '@/components/ui/use-toast';
import { trialManager } from '@/lib/trial/trialManager';

interface FreeTrialSignupProps {
  className?: string;
  onSuccess?: (trialData: any) => void;
}

export function FreeTrialSignup({
  className = '',
  onSuccess
}: FreeTrialSignupProps) {
  const { isConnected, address, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trialData, setTrialData] = useState<any>(null);

  const remainingSlots = 10000 - 8543; // Mock data - would be fetched from backend

  const handleStartTrial = async () => {
    if (!isConnected || !address) {
      connect();
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await trialManager.startFreeTrial(
        address,
        email || undefined,
        referralCode || undefined
      );

      if (result.success && result.trialUser) {
        setTrialData(result.trialUser);
        setShowSuccess(true);
        onSuccess?.(result.trialUser);

        toast({
          title: 'Free Trial Started!',
          description: 'Welcome to QuantTrade AI. Your 30-day trial is now active.',
        });
      } else {
        toast({
          title: 'Trial Signup Failed',
          description: result.error || 'Failed to start trial. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Trial signup error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (trialData?.referralCode) {
      await navigator.clipboard.writeText(trialData.referralCode);
      toast({
        title: 'Referral Code Copied',
        description: 'Share this code to earn bonus trial days!',
      });
    }
  };

  const shareReferralLink = async () => {
    const url = `${window.location.origin}?ref=${trialData?.referralCode}`;
    if (navigator.share) {
      await navigator.share({
        title: 'Join QuantTrade AI',
        text: 'Try the most advanced AI trading platform with my referral code!',
        url
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Referral Link Copied',
        description: 'Share this link to invite friends!',
      });
    }
  };

  return (
    <>
      <Card className={`max-w-2xl mx-auto ${className}`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="h-8 w-8 text-purple-600" />
            <CardTitle className="text-2xl">Start Your Free Trial</CardTitle>
          </div>
          <div className="space-y-2">
            <Badge className="bg-lime-400 text-black font-semibold">
              30 Days Completely Free
            </Badge>
            <p className="text-muted-foreground">
              Join {(10000 - remainingSlots).toLocaleString()} traders already using QuantTrade AI
            </p>
            {remainingSlots <= 1000 && (
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Only {remainingSlots.toLocaleString()} spots remaining!
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-medium">AI-Powered Trading</div>
                <div className="text-sm text-muted-foreground">Advanced algorithms</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Risk Management</div>
                <div className="text-sm text-muted-foreground">Built-in protections</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">24/7 Monitoring</div>
                <div className="text-sm text-muted-foreground">Never miss opportunities</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium">94.7% Success Rate</div>
                <div className="text-sm text-muted-foreground">Proven results</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {!isConnected ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Connect your wallet to start your free trial
                </p>
                <Button onClick={() => connect()} size="lg" className="w-full">
                  Connect Wallet to Continue
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get important updates about your trading performance
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral">Referral Code (Optional)</Label>
                  <Input
                    id="referral"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get an extra 7 days with a valid referral code!
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button
                  onClick={handleStartTrial}
                  disabled={isLoading || !acceptTerms}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    'Starting Trial...'
                  ) : (
                    <>
                      Start Free 30-Day Trial
                      <Gift className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-green-600">No Credit Card</div>
                <div className="text-muted-foreground">Required</div>
              </div>
              <div>
                <div className="font-semibold text-blue-600">Cancel Anytime</div>
                <div className="text-muted-foreground">No Commitment</div>
              </div>
              <div>
                <div className="font-semibold text-purple-600">2 Min Setup</div>
                <div className="text-muted-foreground">Quick Start</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Welcome to QuantTrade AI!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your 30-day free trial has started successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-600">30 Days</div>
                <div className="text-sm text-muted-foreground">
                  Full access to all premium features
                </div>
              </div>
            </div>

            {trialData?.referralCode && (
              <div className="space-y-3">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Your Referral Code</h4>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded text-center font-mono">
                      {trialData.referralCode}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyReferralCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this code to earn 7 extra trial days for each friend who joins!
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareReferralLink}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReferralCode}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={() => setShowSuccess(false)} className="w-full">
              Start Trading Now!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}