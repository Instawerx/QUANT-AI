"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWallet } from '@/context/wallet-context';

type RoundHistory = {
    round: number;
    result: "UP" | "DOWN";
}

type MyHistory = {
    round: number;
    direction: "UP" | "DOWN";
    amount: number;
    result: "Win" | "Loss";
}

// Generate initial synthetic data
const generateInitialHistory = (count: number): RoundHistory[] => {
    const history: RoundHistory[] = [];
    for (let i = 0; i < count; i++) {
        history.push({
            round: 12344 - i,
            result: Math.random() > 0.5 ? "UP" : "DOWN",
        });
    }
    return history;
};

const generateMyHistory = (count: number): MyHistory[] => {
    const history: MyHistory[] = [];
     for (let i = 0; i < count; i++) {
        const direction = Math.random() > 0.5 ? "UP" : "DOWN";
        const result = Math.random() > 0.3 ? "Win" : "Loss";
        history.push({
            round: 12344 - i,
            direction,
            amount: Math.random() * 5 + 0.1,
            result,
        });
    }
    return history;
}

export function PredictionHistory() {
    const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);
    const { account } = useWallet();
    
    useEffect(() => {
        setRoundHistory(generateInitialHistory(10));
    }, []);

    // Simulate new rounds being added to history
    useEffect(() => {
        if (roundHistory.length === 0) return;

        const interval = setInterval(() => {
            setRoundHistory(prevHistory => {
                const newRound: RoundHistory = {
                    round: prevHistory[0].round + 1,
                    result: Math.random() > 0.5 ? "UP" : "DOWN",
                };
                // Keep history to a max of 20 entries
                return [newRound, ...prevHistory].slice(0, 20);
            });
        }, 305000); // every 5 minutes and 5 seconds, to follow the card

        return () => clearInterval(interval);
    }, [roundHistory.length]);

    const myHistoryData = generateMyHistory(5);

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="rounds">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="rounds">Rounds</TabsTrigger>
                        <TabsTrigger value="my-history">My History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rounds">
                        <ScrollArea className="h-[400px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Round</TableHead>
                                        <TableHead className="text-right">Result</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roundHistory.map((item) => (
                                        <TableRow key={item.round}>
                                            <TableCell>#{item.round}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={cn(
                                                    "text-white",
                                                    item.result === "UP" ? "bg-green-500 hover:bg-green-500/90" : "bg-red-500 hover:bg-red-500/90"
                                                )}>{item.result}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="my-history">
                        {account ? (
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Round</TableHead>
                                            <TableHead>Direction</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="text-right">Result</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myHistoryData.map(item => (
                                            <TableRow key={item.round}>
                                                <TableCell>#{item.round}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn(item.direction === 'UP' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500')}>
                                                        {item.direction}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{item.amount.toFixed(2)} BNB</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={cn(item.result === 'Win' ? 'text-green-500' : 'text-red-500')}>
                                                        {item.result}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Connect your wallet to see your history.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
