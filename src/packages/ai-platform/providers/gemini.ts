/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { AIProvider, AIResponse } from '../types';
import { apiClient } from '@/packages/api-client';

export class GeminiProvider implements AIProvider {
  id = 'gemini';
  name = 'Google Gemini';

  /**
   * Generates completion text from Google Gemini API.
   */
  async generate(prompt: string, options?: any): Promise<AIResponse> {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      throw new Error('Gemini API Key is not configured on the server.');
    }

    const modelName = options?.model || 'gemini-2.5-flash';
    const responseMimeType = options?.jsonMode !== false ? 'application/json' : undefined;

    const result = await apiClient.post<any>(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
      }
    );

    if (!result.success) {
      throw new Error(`Gemini API call failed: ${result.error.message}`);
    }

    const text = result.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract metadata token counts from response if present
    const usage = result.data.usageMetadata;
    const tokenUsage = usage ? {
      promptTokens: usage.promptTokenCount || 0,
      completionTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0,
    } : undefined;

    return {
      text,
      tokenUsage,
      providerId: this.id,
    };
  }

  /**
   * Health check passes if the server-routed Gemini API key is present.
   */
  async healthCheck(): Promise<boolean> {
    return !!process.env.GEMINI_API_KEY;
  }
}
export default GeminiProvider;
