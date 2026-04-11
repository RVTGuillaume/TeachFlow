import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly providers = [
    { name: 'openai', call: (p: string) => this.callOpenAI(p) },
    { name: 'gemini', call: (p: string) => this.callGemini(p) },
    { name: 'claude', call: (p: string) => this.callClaude(p) },
  ];

  async ask(prompt: string): Promise<{ response: string; provider: string }> {
    for (const provider of this.providers) {
      try {
        const response = await provider.call(prompt);
        return { response, provider: provider.name };
      } catch {
        console.warn(`[AI] ${provider.name} indisponible, bascule...`);
      }
    }
    return {
      response: 'Tous les services IA sont temporairement indisponibles.',
      provider: 'none',
    };
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });
    return res.choices[0].message.content || '';
  }

  private async callGemini(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GEMINI_API_KEY || '',
    );
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  private async callClaude(prompt: string): Promise<string> {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
    return (msg.content[0] as { text: string }).text;
  }
}