import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserPlus, Bot, Rocket, BarChart } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="h-10 w-10 text-primary" />,
    title: "Step 1: Sign Up & Connect",
    description: "Create your account in seconds and securely connect your crypto wallet. Start your 30-day free trial with no commitments.",
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "Step 2: Choose Your Strategy",
    description: "Select from our range of products: run our secure Desktop Software, deploy bots on our Cloud, or join Community Campaigns.",
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: "Step 3: Deploy The AI",
    description: "Activate your chosen trading bots with a single click. Our Multi-LLM Neural Network immediately gets to work analyzing markets.",
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Step 4: Monitor & Profit",
    description: "Track your portfolio's performance in real-time through your personal dashboard and watch as the AI executes trades on your behalf.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">How QuantTrade AI Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            From sign-up to profit, our platform is designed for simplicity and power.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col text-center items-center p-6 border-transparent hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 text-base text-muted-foreground">
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
