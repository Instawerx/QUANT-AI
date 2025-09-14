import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is QuantTrade AI secure?",
    answer: "Yes, security is our top priority. Our platform uses end-to-end encryption, and our cloud infrastructure is built for resilience and protection. When you connect your wallet, we never have access to your private keys.",
  },
  {
    question: "How much money can I make?",
    answer: "While we cannot guarantee specific returns, our Multi-LLM Neural Network has an average historical success rate of 92.8%. Your profitability depends on market conditions, your chosen strategy, and the amount you invest.",
  },
  {
    question: "Do I need trading experience to use the platform?",
    answer: "Not at all. QuantTrade AI is designed for both beginners and experienced traders. Our user-friendly interface and automated bots make it easy for anyone to get started. For advanced users, our desktop software provides deep customization.",
  },
  {
    question: "What are the fees?",
    answer: "Our fees depend on the product you choose. The Desktop Software is a one-time purchase. Our Cloud Hosted Trading has monthly subscription tiers. The Community Campaigns are free to join, and we only take a 5% fee on profits from successful campaigns.",
  },
  {
    question: "What happens after my 30-day free trial ends?",
    answer: "After your trial, you can choose to upgrade to one of our paid plans to continue using the service. Your trial includes full access to our features, including three free entries into Community Campaigns. There is no obligation to purchase.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 sm:py-24 bg-card border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Frequently Asked Questions</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Have questions? We have answers. Here are some of the most common queries we receive.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
               <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
