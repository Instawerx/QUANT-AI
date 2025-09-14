"use client";

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateRecentGains, RecentGain } from '@/ai/flows/generate-recent-gains';

// Helper to get a random city
const cities = [
  "New York", "London", "Tokyo", "Paris", "Singapore", "Hong Kong", "Dubai", "Sydney", "Toronto", "Berlin"
];
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Name generation can be a simple client-side function
function generateRandomName() {
    const syllables1 = ["Alex", "Jor", "Tay", "Mor", "Ca"];
    const syllables2 = ["dan", "lor", "gan", "sey", "ley"];
    return getRandomElement(syllables1) + getRandomElement(syllables2);
}


export function SignUpToast() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({ name: '', city: '' });
  
  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const scheduleShow = () => {
      const randomInterval = Math.random() * 8000 + 4000; // between 4-12 seconds
      showTimeout = setTimeout(() => {
        // We can still randomize the name/city on the client to give it variety
        // without needing an API call for every single toast.
        setContent({
          name: generateRandomName(),
          city: getRandomElement(cities),
        });
        setVisible(true);

        // Schedule hide
        hideTimeout = setTimeout(() => {
          setVisible(false);
          // And schedule the next show
          scheduleShow(); 
        }, 4000); // Toast visible for 4 seconds

      }, randomInterval);
    };

    // Start the cycle
    scheduleShow();

    // Cleanup on component unmount
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);


  return (
    <div className={cn(
      "fixed bottom-20 left-4 z-50 transition-all duration-500 w-full max-w-xs sm:max-w-sm",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
    )}>
      <Card className="p-3 bg-card border-border shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{content.name} from {content.city}</p>
            <p className="text-xs text-muted-foreground">Just started their free trial!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
