'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MissionContributionFlow } from '@/components/mission/MissionContributionFlow';
import {
  Gift,
  Clock,
  Star,
  Shield,
  Zap,
} from 'lucide-react';

interface FreeTrialSignupProps {
  className?: string;
  onSuccess?: (trialData: any) => void;
}

export function FreeTrialSignup({
  className = '',
  onSuccess
}: FreeTrialSignupProps) {
  const remainingSlots = 10000 - 8543; // Mock data - would be fetched from backend

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

          {/* CTA Button */}
          <div className="space-y-4">
            <MissionContributionFlow
              buttonText="Start Free 30-Day Trial"
              buttonSize="lg"
              buttonClassName="w-full"
              showIcon={true}
              onComplete={onSuccess}
            />
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
    </>
  );
}