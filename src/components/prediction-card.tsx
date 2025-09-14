"use client";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, History, TrendingUp, TrendingDown } from "lucide-react";
import { BnbPrice } from './bnb-price';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/hooks/use-toast';

type Round = {
  id: number;
  lockedPrice: number;
  closePrice: number;
  prizePoolUp: number;
  prizePoolDown: number;
  result: 'UP' | 'DOWN';
}

export function PredictionCard() {
  const ROUND_DURATION = 300; // 5 minutes
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [isLive, setIsLive] = useState(true);
  const [roundId, setRoundId] = useState(Math.floor(Math.random() * 1000) + 12000);
  const [lockedPrice, setLockedPrice] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [prizePoolUp, setPrizePoolUp] = useState(0);
  const [prizePoolDown, setPrizePoolDown] = useState(0);
  const [priceStatus, setPriceStatus] = useState<'up' | 'down' | 'initial'>('initial');
  const { account } = useWallet();
  const { toast } = useToast();

  const handleEnterPrediction = (direction: 'UP' | 'DOWN') => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to enter a prediction.",
        variant: "default",
      });
      return;
    }
    // Placeholder for actual prediction logic
    toast({
      title: `Prediction Entered: ${direction}`,
      description: "Your prediction has been recorded. Good luck!",
    });
  };

  const startNewRound = useCallback((price: number | null) => {
    setIsLive(true);
    setRoundId(id => id + 1);
    setLockedPrice(price);
    setTimeLeft(ROUND_DURATION);
    // Simulate new prize pools
    setPrizePoolUp(Math.random() * 10 + 5); // Random pool between 5 and 15
    setPrizePoolDown(Math.random() * 10 + 5); // Random pool between 5 and 15
  }, []);

  // Update current price from BnbPrice component
  const handlePriceUpdate = (price: number, status: 'up' | 'down' | 'stale' | 'initial') => {
    setCurrentPrice(price);
    if (status === 'up' || status === 'down') {
      setPriceStatus(status);
    }
  };
  
  useEffect(() => {
    if (currentPrice && !lockedPrice) {
      startNewRound(currentPrice);
    }
  }, [currentPrice, lockedPrice, startNewRound]);


  useEffect(() => {
    if (!isLive) return;

    if (timeLeft <= 0) {
      setIsLive(false);
      // Wait 5 seconds then start a new round
      const timer = setTimeout(() => startNewRound(currentPrice), 5000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isLive, startNewRound, currentPrice]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const priceDifference = currentPrice && lockedPrice ? currentPrice - lockedPrice : 0;
  const priceDifferencePercentage = lockedPrice ? (priceDifference / lockedPrice) * 100 : 0;

  const priceColor = priceDifference > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-card/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <CardTitle className="text-xl font-headline">{isLive ? "Live" : "Round Over"}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="h-4 w-4" />
            <span>#{roundId}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 border-b flex flex-col items-center justify-center min-h-[150px]">
            <BnbPrice onPriceUpdate={handlePriceUpdate} />
            <CardDescription className="mt-2">Current BNB Price</CardDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-gradient-to-b from-green-500/10 to-transparent border-r">
            <div className="flex items-center justify-between mb-4">
              <ArrowUp className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-green-500">UP</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
            <p className="text-2xl font-bold mb-4">{prizePoolUp.toFixed(3)} BNB</p>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled={!isLive} onClick={() => handleEnterPrediction('UP')}>Enter UP</Button>
          </div>
          <div className="p-6 bg-gradient-to-b from-red-500/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <ArrowDown className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-red-500">DOWN</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
            <p className="text-2xl font-bold mb-4">{prizePoolDown.toFixed(3)} BNB</p>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={!isLive} onClick={() => handleEnterPrediction('DOWN')}>Enter DOWN</Button>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Locked Price</p>
              <p className="text-lg font-bold">{lockedPrice ? `$${lockedPrice.toFixed(2)}` : 'Waiting...'}</p>
            </div>
             {lockedPrice && currentPrice && (
              <div className="text-center">
                 <p className="text-sm text-muted-foreground">Price Change</p>
                <div className={`flex items-center justify-center gap-1 text-lg font-bold ${priceColor}`}>
                    {priceDifference > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    <span>${Math.abs(priceDifference).toFixed(2)}</span>
                    <span>({priceDifferencePercentage.toFixed(2)}%)</span>
                </div>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
