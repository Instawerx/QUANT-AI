"use client";
import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BnbPrice() {
    const [price, setPrice] = useState<number | null>(null);
    const [status, setStatus] = useState<'initial' | 'up' | 'down' | 'stale'>('initial');
    const prevPriceRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await fetch('/api/price');
                if (!response.ok) {
                    throw new Error('Failed to fetch price');
                }
                const data = await response.json();
                
                if (price !== null) {
                    prevPriceRef.current = price;
                }
                setPrice(data.price);
            } catch (error) {
                console.error("Error fetching BNB price:", error);
                setStatus('stale');
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [price]);

    useEffect(() => {
        if (price === null || prevPriceRef.current === null) {
            setStatus('initial');
            return;
        }

        let newStatus: 'up' | 'down' = price > prevPriceRef.current ? 'up' : 'down';
        if (price === prevPriceRef.current) {
            newStatus = status as 'up' | 'down'; // keep last status
        }
        
        setStatus(newStatus);
        
        const timer = setTimeout(() => {
            if (status !== 'initial') {
                setStatus('stale');
            }
        }, 500); // Reset color after 500ms

        return () => clearTimeout(timer);

    }, [price, status]);


    const formattedPrice = price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...';

    const priceColor = {
        'up': 'text-green-500',
        'down': 'text-red-500',
        'stale': 'text-foreground',
        'initial': 'text-foreground',
    }[status];

    return (
        <div className={cn("flex items-center gap-2 text-2xl font-bold font-mono transition-colors duration-500", priceColor)}>
            {status === 'up' && <TrendingUp className="h-6 w-6" />}
            {status === 'down' && <TrendingDown className="h-6 w-6" />}
            <span>{formattedPrice}</span>
        </div>
    );
}
