import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roundHistory = [
    { round: 12344, result: "UP", price: 590.12 },
    { round: 12343, result: "DOWN", price: 588.54 },
    { round: 12342, result: "DOWN", price: 591.23 },
    { round: 12341, result: "UP", price: 589.99 },
    { round: 12340, result: "UP", price: 587.45 },
];

export function PredictionHistory() {
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
                                            <Badge className={cn(item.result === "UP" ? "bg-green-500" : "bg-red-500", "text-white")}>{item.result}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
