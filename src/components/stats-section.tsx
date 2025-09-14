"use client";

import { useState, useEffect } from 'react';
import { Award, TrendingUp, Users } from 'lucide-react';

const StatCard = ({ icon, value, label, unit }: { icon: React.ReactNode, value: string | number, label: string, unit?: string }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold font-headline">
        {value}{unit && <span className="text-xl text-muted-foreground">{unit}</span>}
      </p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  </div>
);

export function StatsSection() {
  const [userCount, setUserCount] = useState(1236);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Daily growth rate of 28%
    const dailyGrowthRate = 0.28;
    const growthPerSecond = Math.log(1 + dailyGrowthRate) / (24 * 60 * 60);

    const initialCount = 1236;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
      
      // Calculate the base growth
      const baseCount = initialCount * Math.exp(growthPerSecond * elapsedTimeInSeconds);

      // Add fluctuation
      const fluctuation = (Math.random() - 0.5) * 4; // Fluctuates by +/- 2
      
      setUserCount(Math.floor(baseCount + fluctuation));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <section className="bg-card py-12 sm:py-16 border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StatCard
            icon={<Users className="h-8 w-8" />}
            value={isClient ? userCount.toLocaleString() : '1,236'}
            label="Active Traders"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8" />}
            value="92.8"
            unit="%"
            label="Avg. Success Rate"
          />
          <StatCard
            icon={<Award className="h-8 w-8" />}
            value="10,000"
            label="Free Trials Available"
          />
        </div>
      </div>
    </section>
  );
}
