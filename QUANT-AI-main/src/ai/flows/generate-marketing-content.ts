// src/ai/flows/generate-marketing-content.ts
'use server';

/**
 * @fileOverview Generates marketing content for the QuantTrade AI platform, emphasizing its unique features and advantages.
 *
 * - generateMarketingContent - A function that generates marketing content.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  uniqueFeatures: z.array(z.string()).describe('A list of unique features of the product.'),
  advantages: z.array(z.string()).describe('A list of advantages of the product.'),
});
export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const GenerateMarketingContentOutputSchema = z.object({
  marketingContent: z.string().describe('The generated marketing content, starting with a slogan on its own line, like Slogan: "The Slogan"'),
});
export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;

export async function generateMarketingContent(input: GenerateMarketingContentInput): Promise<GenerateMarketingContentOutput> {
  return generateMarketingContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingContentPrompt',
  input: {schema: GenerateMarketingContentInputSchema},
  output: {schema: GenerateMarketingContentOutputSchema},
  prompt: `You are a marketing expert tasked with creating compelling marketing content for a new platform called "{{{productName}}}".

  The platform has the following unique features:
  {{#each uniqueFeatures}}
  - {{{this}}}
  {{/each}}

  And it offers these advantages:
  {{#each advantages}}
  - {{{this}}}
  {{/each}}

  Create marketing content that highlights these features and advantages to attract potential users and emphasize the platform's value proposition. 
  
  Start with a catchy slogan on a single line, formatted exactly like this: Slogan: "Your Catchy Slogan Here". The slogan should be modern and emphasize that the platform is superior to older trading bots. Then, on a new line, write the rest of the marketing copy.
  `,
});

const generateMarketingContentFlow = ai.defineFlow(
  {
    name: 'generateMarketingContentFlow',
    inputSchema: GenerateMarketingContentInputSchema,
    outputSchema: GenerateMarketingContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
