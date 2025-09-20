"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, Cloud, Server, Users } from "lucide-react";
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const SoldTicker = ({ start, ratePerSecond, label }: { start: number, ratePerSecond: number, label: string }) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
        const initialValue = start;
        setCount(initialValue);
    
        const interval = setInterval(() => {
            setCount(prev => prev + (ratePerSecond / 10)); // Update more frequently for smoother visual
        }, 100);

        return () => clearInterval(interval);
    }, [start, ratePerSecond]);
    
    return (
        <div className="mt-4 text-sm font-semibold text-accent">
            {Math.floor(count).toLocaleString()} {label}
        </div>
    )
}

export function ProductsSection() {
  return (
    <section id="products" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Products</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Choose the right solution to power your trading strategy, from desktop software to cloud-based bots.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Desktop Software */}
            <Card className="flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Server className="h-10 w-10 text-primary"/>
                        <CardTitle className="text-2xl font-headline">Desktop Trading Software</CardTitle>
                    </div>
                    <CardDescription>A fully encrypted and highly secure trading platform for your machine.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div className='text-center my-4'>
                        <p className="text-4xl font-bold">$9,999</p>
                        <p className="text-muted-foreground line-through">$14,999</p>
                        <Badge variant="destructive" className="mt-2">Limited Time</Badge>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Perpetual license, one-time fee.</span></li>
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Runs on your local hardware.</span></li>
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>End-to-end encryption.</span></li>
                    </ul>
                </CardContent>
                <CardFooter className="flex-col">
                    <Button size="lg" className="w-full">Purchase Now</Button>
                    <SoldTicker start={7} ratePerSecond={13 / (24 * 60 * 60)} label="Licenses Sold" />
                </CardFooter>
            </Card>

            {/* Cloud Hosted */}
            <Card className="flex flex-col shadow-lg border-primary/50 ring-2 ring-primary/50 hover:shadow-primary/30 transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Cloud className="h-10 w-10 text-primary"/>
                        <CardTitle className="text-2xl font-headline">Cloud Hosted Trading</CardTitle>
                    </div>
                    <CardDescription>Deploy and manage your trading bots on our resilient cloud infrastructure.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div className="space-y-3">
                        <div className="p-3 border rounded-lg text-center">
                            <p className="font-bold">Up to 3 Robots</p>
                            <p className="text-2xl font-bold">$100<span className="text-sm text-muted-foreground">/mo</span></p>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                            <p className="font-bold">Up to 10 Robots</p>
                            <p className="text-2xl font-bold">$200<span className="text-sm text-muted-foreground">/mo</span></p>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                            <p className="font-bold">Unlimited Robots</p>
                            <p className="text-2xl font-bold">$1,000<span className="text-sm text-muted-foreground">/mo</span></p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col">
                    <Button size="lg" className="w-full">Choose Plan</Button>
                    <SoldTicker start={1478} ratePerSecond={30 / 60} label="Subscriptions Active" />
                </CardFooter>
            </Card>

            {/* Community Campaigns */}
            <Card className="flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Users className="h-10 w-10 text-primary"/>
                        <CardTitle className="text-2xl font-headline">Community Campaigns</CardTitle>
                    </div>
                    <CardDescription>Join collective trading campaigns and share in the profits.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                     <div className='text-center my-4'>
                        <p className="text-4xl font-bold">Free</p>
                        <p className="text-muted-foreground">5% of profits on successful campaigns</p>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Contribute any amount over $5.</span></li>
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Profits shared based on your pool share.</span></li>
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Bots deploy in 8-hour shifts every 15 minutes.</span></li>
                        <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Free trial includes 3 campaign uses.</span></li>
                    </ul>
                </CardContent>
                <CardFooter className="flex-col">
                    <Button size="lg" className="w-full">Start Free Trial</Button>
                     <div className="mt-4 text-sm font-semibold text-muted-foreground">
                        Included in your 30-day trial!
                    </div>
                </CardFooter>
            </Card>
        </div>
      </div>
    </section>
  );
}
