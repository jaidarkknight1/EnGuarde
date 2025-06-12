// src/ai/flows/improve-code.ts
'use server';

/**
 * @fileOverview AI agent to improve code based on AWS Well-Architecture Framework.
 *
 * - improveCodeAwsFramework - A function that enhances code following AWS Well-Architecture guidelines.
 * - ImproveCodeAwsFrameworkInput - The input type for the improveCodeAwsFramework function.
 * - ImproveCodeAwsFrameworkOutput - The return type for the improveCodeAwsFramework function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveCodeAwsFrameworkInputSchema = z.object({
  code: z.string().describe('The code to be improved.'),
});
export type ImproveCodeAwsFrameworkInput = z.infer<typeof ImproveCodeAwsFrameworkInputSchema>;

const ImproveCodeAwsFrameworkOutputSchema = z.object({
  improvedCode: z.string().describe('The improved code based on AWS Well-Architecture Framework.'),
  explanation: z.string().describe('Explanation of the changes made.'),
});
export type ImproveCodeAwsFrameworkOutput = z.infer<typeof ImproveCodeAwsFrameworkOutputSchema>;

export async function improveCodeAwsFramework(input: ImproveCodeAwsFrameworkInput): Promise<ImproveCodeAwsFrameworkOutput> {
  return improveCodeAwsFrameworkFlow(input);
}

const improveCodeAwsFrameworkPrompt = ai.definePrompt({
  name: 'improveCodeAwsFrameworkPrompt',
  input: {schema: ImproveCodeAwsFrameworkInputSchema},
  output: {schema: ImproveCodeAwsFrameworkOutputSchema},
  prompt: `You are an AI assistant specialized in improving code based on the AWS Well-Architected Framework.

  Review the provided code and suggest improvements based on the AWS Well-Architected Framework. Provide the improved code and an explanation of the changes made.

  Code:
  {{code}}`,
});

const improveCodeAwsFrameworkFlow = ai.defineFlow(
  {
    name: 'improveCodeAwsFrameworkFlow',
    inputSchema: ImproveCodeAwsFrameworkInputSchema,
    outputSchema: ImproveCodeAwsFrameworkOutputSchema,
  },
  async input => {
    const {output} = await improveCodeAwsFrameworkPrompt(input);
    return output!;
  }
);
