"use client";

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateRecentGains, RecentGain } from '@/ai/flows/generate-recent-gains';

export function LiveGainsTicker() {
  const [gains, setGains] = useState<RecentGain[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch initial data
  useEffect(() => {
    generateRecentGains({ count: 5 }).then(response => {
      setGains(response.gains);
      // Stagger the first appearance
      setTimeout(() => setIsVisible(true), 2000);
    }).catch(error => {
      console.error("Error generating recent gains:", error);
    });
  }, []);

  // Rotate through the gains
  useEffect(() => {
    if (gains.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % gains.length);
        setIsVisible(true);
      }, 500); // Time for fade out
    }, 5000); // Show each gain for 5 seconds

    return () => clearInterval(interval);
  }, [gains.length]);
  
  // Periodically fetch new data to keep it fresh
  useEffect(() => {
    const dataRefreshInterval = setInterval(() => {
       generateRecentGains({ count: 5 }).then(response => {
        setGains(response.gains);
       }).catch(error => {
        console.error("Error generating recent gains:", error);
       });
    }, 60000); // Refresh data every minute

    return () => clearInterval(dataRefreshInterval);
  }, []);

  if (gains.length === 0) {
    return null;
  }

  const currentGain = gains[currentIndex];
  const formattedAddress = `${currentGain.account.substring(0, 6)}...${currentGain.account.substring(currentGain.account.length - 4)}`;
  const formattedProfit = `+${currentGain.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;

  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-50 transition-all duration-500 w-full max-w-xs sm:max-w-sm",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
    )}>
      <Card className="p-3 bg-card border-border shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 text-green-500 p-2 rounded-full">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate" title={currentGain.account}>{formattedAddress}</p>
                <p className="text-sm font-bold text-green-500 whitespace-nowrap">{formattedProfit}</p>
            </div>
            <p className="text-xs text-muted-foreground">Just closed a profitable trade!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
