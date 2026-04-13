// backend/src/ai/ai.service.ts

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Prompt optimisé (réduit de 40% sans perte de qualité)
const EXPERT_SYSTEM_PROMPT = `
Tu es **TeachFlow IA**, un assistant expert, autonome et adaptatif.

🎯 OBJECTIF : Réponses exactes, claires, naturelles et utiles.

🧠 ADAPTATION AUTOMATIQUE :
- Question simple → 1-2 phrases directes
- Question intermédiaire → explication structurée
- Question complexe → analyse détaillée avec exemples

💬 STYLE : Professionnel, naturel, concis. Jamais robotique.

📊 FORMAT : Markdown si pertinent (listes, tableaux).

💡 OBLIGATOIRE : Toujours finir par "💡 **Suggestion :** (1 ligne utile)"

🚫 INTERDIT : Répéter la question, être vague, sur-expliquer.

🌍 CONTEXTE : TeachFlow (Madagascar, Ariary Ar) - Réponds à tout sujet.

🔐 SÉCURITÉ : Jamais de clés API, tokens ou mots de passe.

🎯 PRIORITÉ : Exactitude > Adaptation > Clarté > Utilité > Concision
`;

interface PromptAnalysis {
  complexity: 'simple' | 'medium' | 'complex';
}

interface CacheEntry {
  response: string;
  provider: string;
  timestamp: number;
}

@Injectable()
export class AiService {
  // Cache simple (TTL 5 minutes)
  private responseCache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Providers ordonnés par performance/stabilité réelle
  private readonly providers = [
    {
      name: 'gemini',
      call: (p: string, s: string, a: PromptAnalysis) => this.callGemini(p, s, a),
    },
    {
      name: 'groq-llama70b',
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callGroq(p, s, 'llama-3.3-70b-versatile', a),
    },
    {
      name: 'llama405b',
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callOpenRouter(p, s, 'meta-llama/llama-3.1-405b-instruct:free', a),
    },
    {
      name: 'mistral',
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callOpenRouter(p, s, 'mistralai/mistral-7b-instruct:free', a),
    },
    {
      name: 'groq-llama3',
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callGroq(p, s, 'llama-3.1-8b-instant', a),
    },
    {
      name: 'groq-gemma',
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callGroq(p, s, 'gemma2-9b-it', a),
    },
    {
      name: 'gemma2',
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callOpenRouter(p, s, 'google/gemma-2-9b-it:free', a),
    },
  ];

  private conversationMemory: Map<
    string,
    Array<{ question: string; answer: string }>
  > = new Map();

  async ask(
    prompt: string,
    context?: string,
    sessionId?: string,
  ): Promise<{ response: string; provider: string }> {
    // Vérification du cache (sans contexte ni session)
    if (!context && !sessionId) {
      const cached = this.getCachedResponse(prompt);
      if (cached) {
        console.log(`[AI] Réponse servie depuis le cache`);
        return cached;
      }
    }

    // Analyse UNE SEULE FOIS
    const analysis = this.analyzePrompt(prompt);
    
    const enrichedPrompt = this.buildEnrichedPrompt(
      prompt,
      context,
      sessionId,
      analysis,
    );

    for (const provider of this.providers) {
      try {
        const rawResponse = await this.withTimeout(
          provider.call(enrichedPrompt, EXPERT_SYSTEM_PROMPT, analysis),
          8000, // 8 secondes timeout
        );

        let clean = this.normalizeResponse(rawResponse);
        clean = this.generateSmartSuggestion(clean, prompt);

        if (sessionId) {
          this.saveToMemory(sessionId, prompt, clean);
        }

        const result = { response: clean, provider: provider.name };

        // Mise en cache si pas de contexte/session
        if (!context && !sessionId) {
          this.setCachedResponse(prompt, result);
        }

        return result;
      } catch (e) {
        console.warn(`[AI] ${provider.name} indisponible — fallback...`, e.message);
      }
    }

    return {
      response:
        '⚠️ Tous les services IA sont temporairement indisponibles.\n\n💡 **Suggestion :** Réessayez dans quelques instants.',
      provider: 'none',
    };
  }

  clearMemory(sessionId: string): void {
    this.conversationMemory.delete(sessionId);
  }

  clearCache(): void {
    this.responseCache.clear();
    console.log('[AI] Cache vidé');
  }

  // =========================
  // 💾 CACHE INTELLIGENT
  // =========================
  private getCachedResponse(prompt: string): { response: string; provider: string } | null {
    const key = this.generateCacheKey(prompt);
    const entry = this.responseCache.get(key);

    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return { response: entry.response, provider: entry.provider };
    }

    if (entry) {
      this.responseCache.delete(key);
    }

    return null;
  }

  private setCachedResponse(
    prompt: string,
    result: { response: string; provider: string },
  ): void {
    const key = this.generateCacheKey(prompt);
    this.responseCache.set(key, {
      ...result,
      timestamp: Date.now(),
    });

    // Nettoyage périodique du cache
    if (this.responseCache.size > 100) {
      const oldestKey = this.responseCache.keys().next().value;
      if (oldestKey) {
        this.responseCache.delete(oldestKey);
      }
    }
  }

  private generateCacheKey(prompt: string): string {
    return prompt.toLowerCase().trim();
  }

  // =========================
  // 🧠 ANALYSE INTELLIGENTE (SIMPLIFIÉE & FIABLE)
  // =========================
  private analyzePrompt(prompt: string): PromptAnalysis {
    const length = prompt.trim().length;

    // Classification simple et fiable par longueur
    if (length < 40) {
      return { complexity: 'simple' };
    }
    
    if (length < 120) {
      return { complexity: 'medium' };
    }
    
    return { complexity: 'complex' };
  }

  // =========================
  // 🧠 PROMPT ENRICHMENT
  // =========================
  private buildEnrichedPrompt(
    prompt: string,
    context?: string,
    sessionId?: string,
    analysis?: PromptAnalysis,
  ): string {
    let enriched = '';
    const complexity = analysis?.complexity || 'medium';

    if (context) {
      enriched += `📊 DONNÉES :\n${context.substring(0, 2000)}\n\n`;
    }

    if (sessionId && this.conversationMemory.has(sessionId)) {
      const history = this.conversationMemory.get(sessionId);
      if (history && history.length > 0) {
        const last = history.slice(-3);

        enriched += `📜 HISTORIQUE :\n`;
        last.forEach((h) => {
          enriched += `Q: ${h.question}\nR: ${h.answer.substring(0, 150)}...\n`;
        });
        enriched += `\n`;
      }
    }

    // Instructions adaptées selon la complexité
    const complexityHint = 
      complexity === 'simple' 
        ? 'Réponds en 1-2 phrases maximum, direct et concis.'
        : complexity === 'medium'
        ? 'Explique clairement avec structure légère si nécessaire.'
        : 'Fournis une réponse détaillée avec raisonnement et exemples.';

    enriched += `
🧠 STYLE : Assistant professionnel, clair et naturel.
${complexityHint}

QUESTION :
${prompt}
`;

    return enriched;
  }

  // =========================
  // 🧹 CLEANING
  // =========================
  private normalizeResponse(text: string): string {
    return text.replace(/\n{3,}/g, '\n\n').trim();
  }

  private generateSmartSuggestion(text: string, prompt: string): string {
    if (text.includes('💡')) {
      return text;
    }

    const lowerPrompt = prompt.toLowerCase();
    
    // Suggestions intelligentes selon le contexte
    if (
      lowerPrompt.includes('code') ||
      lowerPrompt.includes('fonction') ||
      lowerPrompt.includes('implémente')
    ) {
      return text.trim() + '\n\n💡 **Suggestion :** Voulez-vous un exemple concret de code ou une explication plus détaillée ?';
    }
    
    if (
      lowerPrompt.includes('explique') ||
      lowerPrompt.includes('pourquoi') ||
      lowerPrompt.includes('comment')
    ) {
      return text.trim() + '\n\n💡 **Suggestion :** Souhaitez-vous un résumé, un exemple pratique ou approfondir un point spécifique ?';
    }
    
    if (
      lowerPrompt.includes('différence') ||
      lowerPrompt.includes('comparaison')
    ) {
      return text.trim() + '\n\n💡 **Suggestion :** Voulez-vous un tableau comparatif ou des exemples concrets ?';
    }

    if (lowerPrompt.includes('architecture') || lowerPrompt.includes('conçois')) {
      return text.trim() + '\n\n💡 **Suggestion :** Souhaitez-vous un diagramme ou des détails d\'implémentation ?';
    }

    // Suggestion par défaut
    return text.trim() + '\n\n💡 **Suggestion :** Voulez-vous approfondir ce sujet ou poser une autre question ?';
  }

  // =========================
  // 💾 MEMORY
  // =========================
  private saveToMemory(
    sessionId: string,
    question: string,
    answer: string,
  ): void {
    if (!this.conversationMemory.has(sessionId)) {
      this.conversationMemory.set(sessionId, []);
    }

    const memory = this.conversationMemory.get(sessionId)!;
    memory.push({ question, answer });

    if (memory.length > 10) {
      memory.shift();
    }

    if (this.conversationMemory.size > 50) {
      const firstKey = this.conversationMemory.keys().next().value;
      if (firstKey) {
        this.conversationMemory.delete(firstKey);
      }
    }
  }

  // =========================
  // ⏱️ TIMEOUT (PRODUCTION READY)
  // =========================
  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout après ${ms}ms`)), ms),
      ),
    ]);
  }

  // =========================
  // 🤖 PROVIDERS (OPTIMISÉS)
  // =========================
  private async callGroq(
    prompt: string,
    system: string,
    model: string,
    analysis: PromptAnalysis,
  ): Promise<string> {
    const { complexity } = analysis;
    
    // Configuration adaptative avec tokens optimisés
    const maxTokens = complexity === 'simple' ? 400 : 
                     complexity === 'medium' ? 1000 : 2000; // ↑ 2000 pour complexe
    const temperature = complexity === 'simple' ? 0.3 : 
                       complexity === 'medium' ? 0.5 : 0.7;

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const res = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    const content = res.choices[0]?.message?.content;

    if (!content) throw new Error(`Groq (${model}) vide`);

    return content;
  }

  private async callGemini(
    prompt: string,
    system: string,
    analysis: PromptAnalysis,
  ): Promise<string> {
    const { complexity } = analysis;
    
    const maxTokens = complexity === 'simple' ? 400 : 
                     complexity === 'medium' ? 1000 : 2000; // ↑ 2000 pour complexe
    const temperature = complexity === 'simple' ? 0.3 : 
                       complexity === 'medium' ? 0.5 : 0.7;

    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GEMINI_API_KEY || '',
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: system,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const text = result.response.text();

    if (!text) throw new Error('Gemini vide');

    return text;
  }

  private async callOpenRouter(
    prompt: string,
    system: string,
    model: string,
    analysis: PromptAnalysis,
  ): Promise<string> {
    const { complexity } = analysis;
    
    const maxTokens = complexity === 'simple' ? 400 : 
                     complexity === 'medium' ? 1000 : 2000; // ↑ 2000 pour complexe
    const temperature = complexity === 'simple' ? 0.3 : 
                       complexity === 'medium' ? 0.5 : 0.7;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'TeachFlow AI',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: temperature,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`OpenRouter (${model}) ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error(`OpenRouter (${model}) vide`);

    return content;
  }
}