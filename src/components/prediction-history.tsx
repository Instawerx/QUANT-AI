"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RoundHistory = {
    round: number;
    result: "UP" | "DOWN";
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

export function PredictionHistory() {
    const [roundHistory, setRoundHistory] = useState<RoundHistory[]>(() => generateInitialHistory(10));
    
    // Simulate new rounds being added to history
    useEffect(() => {
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
    }, []);

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
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Connect your wallet to see your history.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

// Mock ScrollArea for now
const ScrollArea = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("overflow-y-auto", className)}>
        {children}
    </div>
);
