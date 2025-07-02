import { config } from 'dotenv';
config();

import '@/ai/flows/code-analysis.ts';
import '@/ai/flows/code-recommendation-feedback.ts';
import '@/ai/flows/improve-code.ts';