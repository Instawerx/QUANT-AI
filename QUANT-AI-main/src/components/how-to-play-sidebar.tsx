import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export function HowToPlaySidebar() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <HelpCircle className="h-5 w-5" />
        <CardTitle>How to Play</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
            Predict whether the price of BNB will be higher or lower than the "Locked Price" when the round ends.
        </p>
        <div>
            <h4 className="font-semibold text-foreground mb-2">To Play:</h4>
            <ol className="list-decimal list-inside space-y-2">
                <li>Connect your wallet.</li>
                <li>Choose if you think the price will go UP or DOWN.</li>
                <li>Enter the amount you want to predict with and confirm.</li>
            </ol>
        </div>
        <div>
            <h4 className="font-semibold text-foreground mb-2">Winning:</h4>
            <p>
                If your prediction is correct, you'll win a share of the prize pool! Your winnings are proportional to your entry amount.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
