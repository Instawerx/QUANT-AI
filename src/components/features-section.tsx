import { Bot, Cloud, Cpu, ShieldCheck } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const features = [
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    title: "Multi-LLM Neural Network",
    description: "Our core is a network of Large Language Models working in synergy to analyze market data with unprecedented depth and accuracy."
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "Automated Algo-Trading",
    description: "Connect via API to execute trades automatically based on AI-driven insights, 24/7. These are not your grandfather's trading bots."
  },
  {
    icon: <Cloud className="h-10 w-10 text-primary" />,
    title: "Resilient Cloud Infrastructure",
    description: "Built on a high-availability, scalable cloud backbone to ensure your trading operations never miss a beat."
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Real-Time Monitoring",
    description: "Gain peace of mind with a live dashboard monitoring your portfolio, AI performance, and market movements in real-time."
  },
];


export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">A Smarter Way to Trade</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            QuantTrade AI leverages a suite of cutting-edge technologies to give you a competitive edge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col text-center items-center p-6 border-transparent hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 text-base">
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
