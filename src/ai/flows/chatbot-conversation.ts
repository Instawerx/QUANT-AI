'use server';

/**
 * @fileOverview A conversational AI flow for a user-facing chatbot on the QuantTrade AI platform.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      history: input.history,
      prompt: `You are a friendly and helpful AI assistant for QuantTrade AI, a cutting-edge automated cryptocurrency trading platform. Your goal is to welcome users, answer their questions about the platform, and encourage them to sign up for a free 30-day trial.

      Key features of QuantTrade AI to highlight:
      - Multi-LLM Neural Network for deep market analysis.
      - Automated Algo-Trading bots that work 24/7.
      - Resilient Cloud Infrastructure for high availability.
      - Real-Time Monitoring of portfolio and AI performance.

      Keep your responses concise, engaging, and conversational. If the user seems interested or asks how to start, guide them to the "Start Your Free Trial" button. Be very realistic and human in your conversation style. Start the conversation with a friendly welcome message.`,
    });
    return {response: output.text};
  }
);
