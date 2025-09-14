'use server';

/**
 * @fileOverview A flow to generate simulated user testimonials for the QuantTrade AI platform.
 *
 * - simulateUserTestimonials - A function that generates a testimonial string.
 * - SimulateUserTestimonialsInput - The input type for the simulateUserTestimonials function (empty object).
 * - SimulateUserTestimonialsOutput - The return type for the simulateUserTestimonials function (string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateUserTestimonialsInputSchema = z.object({});
export type SimulateUserTestimonialsInput = z.infer<typeof SimulateUserTestimonialsInputSchema>;

const SimulateUserTestimonialsOutputSchema = z.object({
  testimonial: z.string().describe('A user testimonial for the QuantTrade AI platform.'),
});
export type SimulateUserTestimonialsOutput = z.infer<typeof SimulateUserTestimonialsOutputSchema>;

export async function simulateUserTestimonials(
  input: SimulateUserTestimonialsInput
): Promise<SimulateUserTestimonialsOutput> {
  return simulateUserTestimonialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateUserTestimonialsPrompt',
  input: {schema: SimulateUserTestimonialsInputSchema},
  output: {schema: SimulateUserTestimonialsOutputSchema},
  prompt: `You are tasked with creating a user testimonial for QuantTrade AI, a cutting-edge cryptocurrency trading platform. The testimonials should be diverse, engaging, and reflect different user profiles, trading experiences, and levels of satisfaction. The goal is to provide up-to-date social proof and encourage user engagement with the platform.

Consider these aspects when crafting the testimonial:

*   User Profile: (e.g., beginner, experienced trader, tech-savvy investor)
*   Trading Experience: (e.g., successful trades, learning curve, specific features used)
*   Satisfaction Level: (e.g., highly satisfied, satisfied, somewhat satisfied, with constructive feedback)

Example Testimonials:

*   "As a beginner, QuantTrade AI made crypto trading accessible and profitable. The AI tools are easy to use, and I've already seen significant gains!"
*   "I've been trading crypto for years, and QuantTrade AI is a game-changer. The advanced analytics and automated trading bots have boosted my portfolio like never before."
*   "QuantTrade AI's cloud infrastructure and real-time monitoring give me peace of mind. I highly recommend it to any serious trader."

Create a unique and compelling user testimonial that captures the essence of QuantTrade AI's value proposition. The testimonial should be only one sentence.

Testimonial:`,
});

const simulateUserTestimonialsFlow = ai.defineFlow(
  {
    name: 'simulateUserTestimonialsFlow',
    inputSchema: SimulateUserTestimonialsInputSchema,
    outputSchema: SimulateUserTestimonialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
