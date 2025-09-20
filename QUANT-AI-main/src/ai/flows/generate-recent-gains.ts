'use server';

/**
 * @fileOverview A flow to generate a list of recent, realistic-looking user gains.
 *
 * - generateRecentGains - A function that generates a list of recent gains.
 * - GenerateRecentGainsInput - The input type for the generateRecentGains function.
 * - GenerateRecentGainsOutput - The return type for the generateRecentGains function.
 * - RecentGain - The type for a single recent gain object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecentGainsInputSchema = z.object({
    count: z.number().min(1).max(10).describe("The number of recent gains to generate.")
});
export type GenerateRecentGainsInput = z.infer<typeof GenerateRecentGainsInputSchema>;

const RecentGainSchema = z.object({
  account: z.string().describe("A realistic but fake user account number or wallet address, e.g., '0x...1234'. Must be unique for each entry."),
  profit: z.number().describe("The profit amount in USD, a realistic positive number between 50 and 5000."),
  timestamp: z.string().describe("The ISO 8601 timestamp of when the gain occurred, within the last hour."),
});
export type RecentGain = z.infer<typeof RecentGainSchema>;


const GenerateRecentGainsOutputSchema = z.object({
  gains: z.array(RecentGainSchema).describe('An array of recently generated user gains.'),
});
export type GenerateRecentGainsOutput = z.infer<typeof GenerateRecentGainsOutputSchema>;

export async function generateRecentGains(
  input: GenerateRecentGainsInput
): Promise<GenerateRecentGainsOutput> {
  return generateRecentGainsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecentGainsPrompt',
  input: {schema: GenerateRecentGainsInputSchema},
  output: {schema: GenerateRecentGainsOutputSchema},
  prompt: `You are a financial data simulation expert for a crypto trading platform. Your task is to generate a list of {{{count}}} recent, realistic-looking profitable trades for a live ticker display.

  Each entry must have:
  - A unique, randomly generated, and authentic-looking wallet address (e.g., "0x" followed by a mix of letters and numbers).
  - A realistic profit amount between $50 and $5,000.
  - A timestamp from within the last hour.

  The data must be diverse and look like it's from different users.
`,
});

const generateRecentGainsFlow = ai.defineFlow(
  {
    name: 'generateRecentGainsFlow',
    inputSchema: GenerateRecentGainsInputSchema,
    outputSchema: GenerateRecentGainsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure the output has the correct length, sometimes the model might not respect it.
    if(output!.gains.length > input.count) {
        output!.gains = output!.gains.slice(0, input.count);
    }
    return output!;
  }
);
