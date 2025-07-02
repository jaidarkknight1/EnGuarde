'use server';

/**
 * @fileOverview Code analysis flow for analyzing code snippets for security vulnerabilities and suggesting improvements.
 *
 * - codeAnalysisFromPaste - A function that handles the code analysis process from pasted code.
 * - CodeAnalysisInput - The input type for the codeAnalysisFromPaste function.
 * - CodeAnalysisOutput - The return type for the codeAnalysisFromPaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeAnalysisInputSchema = z.object({
  code: z.string().describe('The code snippet to be analyzed.'),
});
export type CodeAnalysisInput = z.infer<typeof CodeAnalysisInputSchema>;

const CodeAnalysisOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The security and improvement recommendations for the given code.'),
});
export type CodeAnalysisOutput = z.infer<typeof CodeAnalysisOutputSchema>;

export async function codeAnalysisFromPaste(input: CodeAnalysisInput): Promise<CodeAnalysisOutput> {
  return codeAnalysisFromPasteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeAnalysisPrompt',
  input: {schema: CodeAnalysisInputSchema},
  output: {schema: CodeAnalysisOutputSchema},
  prompt: `You are a security expert reviewing code for vulnerabilities and improvements.

Analyze the following code snippet and provide specific recommendations to improve its security, 
compliance, and adherence to best practices. Also, provide educational context for each recommendation.

Code: {{{code}}}

Ensure your response is well-structured and easy to understand.
`,
});

const codeAnalysisFromPasteFlow = ai.defineFlow(
  {
    name: 'codeAnalysisFromPasteFlow',
    inputSchema: CodeAnalysisInputSchema,
    outputSchema: CodeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
