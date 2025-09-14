"use client";
import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Circle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BnbPriceProps = {
    onPriceUpdate?: (price: number, status: 'up' | 'down' | 'stale' | 'initial') => void;
}

export function BnbPrice({ onPriceUpdate }: BnbPriceProps) {
    const [price, setPrice] = useState<number | null>(null);
    const [status, setStatus] = useState<'initial' | 'up' | 'down' | 'stale'>('initial');
    const prevPriceRef = useRef<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await fetch('/api/price');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.details || data.error || 'Failed to fetch price');
                }
                
                if (price !== null) {
                    prevPriceRef.current = price;
                }
                setPrice(data.price);
                setError(null);
            } catch (error: any) {
                console.error("Error fetching BNB price:", error.message);
                setError(error.message);
                setStatus('stale');
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, []); // Changed dependency to empty to avoid re-triggering on price change

    useEffect(() => {
        if (price === null) {
            setStatus('initial');
            if(onPriceUpdate) onPriceUpdate(0, 'initial');
            return;
        }

        let newStatus: 'up' | 'down' | 'stale' = 'stale';
        if (prevPriceRef.current !== null) {
            if (price > prevPriceRef.current) {
                newStatus = 'up';
            } else if (price < prevPriceRef.current) {
                newStatus = 'down';
            }
        }
        
        setStatus(newStatus);
        if(onPriceUpdate) onPriceUpdate(price, newStatus);
        
        const timer = setTimeout(() => {
            setStatus('stale');
             if(onPriceUpdate) onPriceUpdate(price, 'stale');
        }, 1000); // Visual indicator resets after 1s

        return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [price]);
    
    if (error) {
        return (
             <div className="flex flex-col items-center text-red-500 text-center">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <span className="text-sm font-semibold">Error loading price</span>
                <span className="text-xs max-w-xs">{error}</span>
            </div>
        )
    }


    const formattedPrice = price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...';

    const priceColor = {
        'up': 'text-green-500',
        'down': 'text-red-500',
        'stale': 'text-foreground',
        'initial': 'text-foreground',
    }[status];

    const Icon = {
        'up': <TrendingUp className="h-6 w-6" />,
        'down': <TrendingDown className="h-6 w-6" />,
        'stale': <Circle className="h-5 w-5 fill-current" />,
        'initial': <Circle className="h-5 w-5 animate-pulse" />
    }[status]

    return (
        <div className={cn("flex items-center gap-2 text-2xl font-bold font-mono transition-colors duration-300", priceColor)}>
            {Icon}
            <span>{formattedPrice}</span>
        </div>
    );
}
