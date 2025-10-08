'use client';

import React, { useState } from 'react';
import { useWallet } from '@/lib/web3/hooks/useWallet';
import { useQuantMissionContract, AGREEMENT_HASH } from '@/hooks/useQuantMissionContract';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Rocket,
  Wallet,
  CheckCircle,
  Shield,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { parseEther, keccak256, encodePacked } from 'viem';
import { toast } from '@/components/ui/use-toast';

interface MissionContributionFlowProps {
  onComplete?: () => void;
  buttonText?: string;
  buttonClassName?: string;
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  showIcon?: boolean;
}

export function MissionContributionFlow({
  onComplete,
  buttonText = 'Start Free Trial - 30 Days',
  buttonClassName = '',
  buttonSize = 'lg',
  buttonVariant = 'default',
  showIcon = true,
}: MissionContributionFlowProps) {
  const { isConnected, connect, address } = useWallet();
  const { writeContract } = useQuantMissionContract();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'connect' | 'mission' | 'agreement' | 'processing' | 'success'>('connect');
  const [selectedMission, setSelectedMission] = useState('AI Development');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Available mission types (from contract)
  const missions = [
    { id: 'AI Development', label: 'AI Development', description: 'Support AI model training and development', icon: Zap },
    { id: 'Research & Innovation', label: 'Research & Innovation', description: 'Fund cutting-edge trading research', icon: Rocket },
    { id: 'Platform Operations', label: 'Platform Operations', description: 'Maintain platform infrastructure', icon: Shield },
  ];

  const handleButtonClick = async () => {
    if (!isConnected) {
      // Connect wallet first
      setIsOpen(true);
      setStep('connect');
    } else {
      // Already connected, go straight to mission selection
      setIsOpen(true);
      setStep('mission');
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
      setStep('mission');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMissionSelect = () => {
    setStep('agreement');
  };

  const handleAgree = async () => {
    if (!agreedToTerms) {
      toast({
        title: 'Agreement Required',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setStep('processing');
    setIsProcessing(true);

    try {
      if (!writeContract) {
        throw new Error('Contract not available');
      }

      // Use the registered agreement hash from your deployment
      // This hash was registered when the contract was deployed on Polygon and BSC
      // Hash: 0x18de0bfdb189cd36e2ee6e9f5085a9bdcf18ca64b8c8e3a749b6ec8ac60ecb1d
      const agreementHashToUse = AGREEMENT_HASH;

      // Minimum contribution: 0.01 ETH (from contract)
      const contributionAmount = parseEther('0.01');

      const tx = await writeContract.write.confirmMissionAndContribute(
        [selectedMission, agreementHashToUse],
        { value: contributionAmount }
      );

      toast({
        title: 'Transaction Submitted',
        description: 'Waiting for confirmation...',
      });

      // Wait for transaction to be mined
      // In production, use wagmi's waitForTransaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStep('success');

      toast({
        title: 'Success!',
        description: 'Welcome to QuantTrade AI! Your 30-day trial has started.',
      });

      setTimeout(() => {
        setIsOpen(false);
        onComplete?.();
      }, 3000);

    } catch (error: any) {
      console.error('Mission contribution failed:', error);

      let errorMessage = 'Transaction failed. Please try again.';

      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected. Please try again.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds. You need at least 0.01 ETH.';
      }

      toast({
        title: 'Transaction Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setStep('agreement');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'connect':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Wallet className="h-16 w-16 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Connect your Web3 wallet to start your free 30-day trial with QuantTrade AI
              </p>
            </div>
            <div className="space-y-3 text-sm text-left bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Full access to all AI trading features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Cancel anytime, no commitment</span>
              </div>
            </div>
            <Button onClick={handleConnect} size="lg" className="w-full">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          </div>
        );

      case 'mission':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Choose Your Mission</h3>
              <p className="text-muted-foreground">
                Select which area of QuantTrade AI you'd like to support
              </p>
            </div>
            <RadioGroup value={selectedMission} onValueChange={setSelectedMission}>
              <div className="space-y-3">
                {missions.map((mission) => (
                  <Label
                    key={mission.id}
                    htmlFor={mission.id}
                    className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={mission.id} id={mission.id} />
                    <mission.icon className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-semibold">{mission.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {mission.description}
                      </div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
            <Button onClick={handleMissionSelect} size="lg" className="w-full">
              Continue
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );

      case 'agreement':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Mission Agreement</h3>
              <Badge className="bg-purple-600 mb-4">
                {selectedMission}
              </Badge>
              <p className="text-muted-foreground">
                Review and accept the mission terms
              </p>
            </div>

            <div className="space-y-4 text-sm bg-muted/50 p-4 rounded-lg max-h-64 overflow-y-auto">
              <div>
                <h4 className="font-semibold mb-2">Mission Terms</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• One-time contribution of 0.01 ETH to support {selectedMission}</li>
                  <li>• Grants immediate access to 30-day free trial</li>
                  <li>• Funds allocated directly to mission treasury</li>
                  <li>• Small gas buffer retained for platform operations</li>
                  <li>• Full access to all AI trading features during trial</li>
                  <li>• Cancel anytime with no additional charges</li>
                </ul>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Important</span>
                </div>
                <p className="text-muted-foreground mt-1">
                  This is a mission contribution, not a payment. Funds are immediately
                  transferred to the treasury for {selectedMission} purposes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I understand and agree to contribute 0.01 ETH to support{' '}
                <strong>{selectedMission}</strong> and accept the{' '}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </Label>
            </div>

            <Button
              onClick={handleAgree}
              disabled={!agreedToTerms || isProcessing}
              size="lg"
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Approve & Start Trial'}
              <Shield className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center py-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Processing Your Contribution</h3>
              <p className="text-muted-foreground">
                Please confirm the transaction in your wallet...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center py-8">
            <div className="flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Welcome to QuantTrade AI!</h3>
              <p className="text-muted-foreground">
                Your 30-day free trial has started. Let's start trading!
              </p>
            </div>
            <Badge className="bg-green-600 text-lg px-6 py-2">
              Trial Active
            </Badge>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        size={buttonSize}
        variant={buttonVariant}
        className={buttonClassName}
      >
        {buttonText}
        {showIcon && <Zap className="ml-2 h-5 w-5" />}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start Your Free Trial</DialogTitle>
            <DialogDescription>
              Step {step === 'connect' ? '1' : step === 'mission' ? '2' : step === 'agreement' ? '3' : '4'} of 3
            </DialogDescription>
          </DialogHeader>
          {renderStepContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
