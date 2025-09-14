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

  useEffect(() => {
    const usersPerHour = 6;
    const intervalInMs = 3600 * 1000 / usersPerHour;

    const interval = setInterval(() => {
      setUserCount(prev => prev + 1);
    }, intervalInMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-card py-12 sm:py-16 border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StatCard
            icon={<Users className="h-8 w-8" />}
            value={userCount.toLocaleString()}
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
