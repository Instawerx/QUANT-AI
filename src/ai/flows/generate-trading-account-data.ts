// 'use server' // Disabled for static export;

/**
 * @fileOverview Generates realistic trading account data for the QuantTrade AI app.
 *
 * This file defines a Genkit flow to create simulated trading account data,
 * including initial balances, transaction histories, and performance metrics.
 *
 * @interface GenerateTradingAccountDataInput - The input type for the generateTradingAccountData function.
 * @interface GenerateTradingAccountDataOutput - The output type for the generateTradingAccountData function.
 * @function generateTradingAccountData - The function to generate the trading account data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingAccountDataInputSchema = z.object({
  accountNumber: z.string().describe('The account number to generate data for.'),
  initialBalance: z.number().describe('The initial balance of the account.'),
  numberOfTransactions: z
    .number()
    .describe('The number of transactions to generate.'),
});
export type GenerateTradingAccountDataInput = z.infer<
  typeof GenerateTradingAccountDataInputSchema
>;

const GenerateTradingAccountDataOutputSchema = z.object({
  accountData: z.object({
    accountNumber: z.string().describe('The account number.'),
    initialBalance: z.number().describe('The initial balance.'),
    transactionHistory: z.array(
      z.object({
        transactionId: z.string().describe('The transaction ID.'),
        timestamp: z.string().describe('The timestamp of the transaction.'),
        type: z.string().describe('The type of transaction (buy/sell).'),
        asset: z.string().describe('The asset traded.'),
        quantity: z.number().describe('The quantity traded.'),
        price: z.number().describe('The price at which the asset was traded.'),
      })
    ),
    performanceMetrics: z.object({
      totalProfit: z.number().describe('The total profit of the account.'),
      totalLoss: z.number().describe('The total loss of the account.'),
      netProfit: z.number().describe('The net profit of the account.'),
    }),
  }),
});
export type GenerateTradingAccountDataOutput = z.infer<
  typeof GenerateTradingAccountDataOutputSchema
>;

export async function generateTradingAccountData(
  input: GenerateTradingAccountDataInput
): Promise<GenerateTradingAccountDataOutput> {
  return generateTradingAccountDataFlow(input);
}

const generateTradingAccountDataPrompt = ai.definePrompt({
  name: 'generateTradingAccountDataPrompt',
  input: {schema: GenerateTradingAccountDataInputSchema},
  output: {schema: GenerateTradingAccountDataOutputSchema},
  prompt: `You are an expert financial data generator. Your job is to create realistic looking trading account data.

  Generate a trading account with the following specifications:
  Account Number: {{{accountNumber}}}
  Initial Balance: {{{initialBalance}}}
  Number of Transactions: {{{numberOfTransactions}}}

  The transaction history should include a variety of buy and sell transactions for different crypto assets.  Make sure the timestamps are realistic and in chronological order.
  Calculate performance metrics such as total profit, total loss and net profit based on the generated transaction history.  Return all the data in JSON format.
  `,
});

const generateTradingAccountDataFlow = ai.defineFlow(
  {
    name: 'generateTradingAccountDataFlow',
    inputSchema: GenerateTradingAccountDataInputSchema,
    outputSchema: GenerateTradingAccountDataOutputSchema,
  },
  async input => {
    const {output} = await generateTradingAccountDataPrompt(input);
    return output!;
  }
);
