"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, History } from "lucide-react";
import { BnbPrice } from './bnb-price';

export function PredictionCard() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    if (timeLeft <= 0) {
      setIsLive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isLive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-card/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <CardTitle className="text-xl font-headline">{isLive ? "Live" : "Expired"}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="h-4 w-4" />
            <span>#12345</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-gradient-to-b from-green-500/10 to-transparent border-r">
            <div className="flex items-center justify-between mb-4">
              <ArrowUp className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-green-500">UP</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
            <p className="text-2xl font-bold mb-4">12.345 BNB</p>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled={!isLive}>Enter UP</Button>
          </div>
          <div className="p-6 bg-gradient-to-b from-red-500/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <ArrowDown className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-red-500">DOWN</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
            <p className="text-2xl font-bold mb-4">10.987 BNB</p>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={!isLive}>Enter DOWN</Button>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Price</p>
              <BnbPrice />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground text-right">Locked Price</p>
                <p className="text-lg font-bold text-right">$590.00</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
