// backend/src/ai/ai.service.ts

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

const EXPERT_SYSTEM_PROMPT = `
Tu es **TeachFlow IA**, un assistant intelligent, fiable et polyvalent conçu pour fournir des réponses précises, utiles et adaptées à chaque contexte.

━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJECTIF PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━
Fournir des réponses exactes, claires, structurées et immédiatement exploitables.

━━━━━━━━━━━━━━━━━━━━━━
🧠 ADAPTATION INTELLIGENTE
━━━━━━━━━━━━━━━━━━━━━━
- Question simple → réponse courte, directe (1 à 3 phrases)
- Question intermédiaire → explication structurée et claire
- Question complexe → analyse approfondie avec étapes, exemples et cas concrets

━━━━━━━━━━━━━━━━━━━━━━
💬 STYLE DE RÉPONSE
━━━━━━━━━━━━━━━━━━━━━━
- Professionnel, naturel et fluide
- Clair et humain (éviter le ton robotique)
- Précis sans être inutilement long
- Adapté au niveau de compréhension de l’utilisateur

━━━━━━━━━━━━━━━━━━━━━━
📊 FORMATAGE
━━━━━━━━━━━━━━━━━━━━━━
- Utilise Markdown si pertinent (titres, listes, tableaux, code)
- Structure toujours les réponses longues pour améliorer la lisibilité

━━━━━━━━━━━━━━━━━━━━━━
💡 CLAUSE OBLIGATOIRE
━━━━━━━━━━━━━━━━━━━━━━
Chaque réponse doit se terminer par une seule ligne :

💡 **Suggestion :** une recommandation courte et utile liée au sujet

━━━━━━━━━━━━━━━━━━━━━━
🚫 INTERDICTIONS STRICTES
━━━━━━━━━━━━━━━━━━━━━━
- Ne jamais répéter la question
- Ne pas être vague ou générique
- Ne pas sur-expliquer inutilement
- Ne jamais demander d’informations sensibles (mots de passe, clés API, tokens)
- Ne jamais exposer de données privées ou sécurisées

━━━━━━━━━━━━━━━━━━━━━━
🌍 CONTEXTE D’UTILISATION
━━━━━━━━━━━━━━━━━━━━━━
TeachFlow est une plateforme éducative utilisée à Madagascar (Ariary - Ar), mais tu peux répondre à tous les sujets (technologie, éducation, science, business, etc.).

━━━━━━━━━━━━━━━━━━━━━━
🔐 SÉCURITÉ ET ÉTHIQUE
━━━━━━━━━━━━━━━━━━━━━━
- Refuser toute demande liée à des identifiants sensibles ou secrets
- Prioriser la sécurité, la confidentialité et la conformité
- Ne jamais inventer des informations critiques non vérifiées

━━━━━━━━━━━━━━━━━━━━━━
🎯 PRIORITÉ DE RÉPONSE
━━━━━━━━━━━━━━━━━━━━━━
Exactitude > Clarté > Utilité > Adaptation > Concision
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
  private responseCache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Groq en tête — Gemini retiré (quota épuisé / région non supportée)
  private readonly providers = [
    {
      name: 'groq-llama70b',
      timeout: 8000,
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callGroq(p, s, 'llama-3.3-70b-versatile', a),
    },
    {
      name: 'groq-llama3',
      timeout: 8000,
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callGroq(p, s, 'llama-3.1-8b-instant', a),
    },
    {
      name: 'groq-gemma',
      timeout: 8000,
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callGroq(p, s, 'gemma2-9b-it', a),
    },
    {
      name: 'llama405b',
      timeout: 8000,
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callOpenRouter(p, s, 'meta-llama/llama-3.1-405b-instruct:free', a),
    },
    {
      name: 'mistral',
      timeout: 8000,
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callOpenRouter(p, s, 'mistralai/mistral-7b-instruct:free', a),
    },
    {
      name: 'gemma2',
      timeout: 8000,
      call: (p: string, s: string, a: PromptAnalysis) =>
        this.callOpenRouter(p, s, 'google/gemma-2-9b-it:free', a),
    },
  ];

  private conversationMemory: Map<
    string,
    Array<{ question: string; answer: string }>
  > = new Map();

  // =========================
  // 🚀 MÉTHODE PRINCIPALE
  // =========================
  async ask(
    prompt: string,
    context?: string,
    sessionId?: string,
  ): Promise<{ response: string; provider: string }> {
    if (!context && !sessionId) {
      const cached = this.getCachedResponse(prompt);
      if (cached) {
        console.log(`[AI] Réponse servie depuis le cache`);
        return cached;
      }
    }

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
          provider.timeout,
        );

        let clean = this.normalizeResponse(rawResponse);
        clean = this.generateSmartSuggestion(clean, prompt);

        if (sessionId) {
          this.saveToMemory(sessionId, prompt, clean);
        }

        const result = { response: clean, provider: provider.name };

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
  // 💾 CACHE
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
    this.responseCache.set(key, { ...result, timestamp: Date.now() });

    if (this.responseCache.size > 100) {
      const oldestKey = this.responseCache.keys().next().value;
      if (oldestKey) this.responseCache.delete(oldestKey);
    }
  }

  private generateCacheKey(prompt: string): string {
    return prompt.toLowerCase().trim();
  }

  // =========================
  // 🧠 ANALYSE
  // =========================
  private analyzePrompt(prompt: string): PromptAnalysis {
    const length = prompt.trim().length;
    if (length < 40) return { complexity: 'simple' };
    if (length < 120) return { complexity: 'medium' };
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
        enriched += `📜 HISTORIQUE :\n`;
        history.slice(-3).forEach((h) => {
          enriched += `Q: ${h.question}\nR: ${h.answer.substring(0, 150)}...\n`;
        });
        enriched += `\n`;
      }
    }

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
    if (text.includes('💡')) return text;

    const p = prompt.toLowerCase();

    if (p.includes('code') || p.includes('fonction') || p.includes('implémente')) {
      return text.trim() + '\n\n💡 **Suggestion :** Voulez-vous un exemple concret de code ou une explication plus détaillée ?';
    }
    if (p.includes('explique') || p.includes('pourquoi') || p.includes('comment')) {
      return text.trim() + '\n\n💡 **Suggestion :** Souhaitez-vous un résumé, un exemple pratique ou approfondir un point spécifique ?';
    }
    if (p.includes('différence') || p.includes('comparaison')) {
      return text.trim() + '\n\n💡 **Suggestion :** Voulez-vous un tableau comparatif ou des exemples concrets ?';
    }
    if (p.includes('architecture') || p.includes('conçois')) {
      return text.trim() + '\n\n💡 **Suggestion :** Souhaitez-vous un diagramme ou des détails d\'implémentation ?';
    }

    return text.trim() + '\n\n💡 **Suggestion :** Voulez-vous approfondir ce sujet ou poser une autre question ?';
  }

  // =========================
  // 💾 MEMORY
  // =========================
  private saveToMemory(sessionId: string, question: string, answer: string): void {
    if (!this.conversationMemory.has(sessionId)) {
      this.conversationMemory.set(sessionId, []);
    }

    const memory = this.conversationMemory.get(sessionId)!;
    memory.push({ question, answer });

    if (memory.length > 10) memory.shift();

    if (this.conversationMemory.size > 50) {
      const firstKey = this.conversationMemory.keys().next().value;
      if (firstKey) this.conversationMemory.delete(firstKey);
    }
  }

  // =========================
  // ⏱️ TIMEOUT
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
  // 🤖 GROQ
  // =========================
  private async callGroq(
    prompt: string,
    system: string,
    model: string,
    analysis: PromptAnalysis,
  ): Promise<string> {
    const { complexity } = analysis;

    const maxTokens = complexity === 'simple' ? 400 : complexity === 'medium' ? 1000 : 2000;
    const temperature = complexity === 'simple' ? 0.3 : complexity === 'medium' ? 0.5 : 0.7;

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const res = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    });

    const content = res.choices[0]?.message?.content;
    if (!content) throw new Error(`Groq (${model}) vide`);

    return content;
  }

  // =========================
  // 🌐 OPENROUTER
  // =========================
  private async callOpenRouter(
    prompt: string,
    system: string,
    model: string,
    analysis: PromptAnalysis,
  ): Promise<string> {
    const { complexity } = analysis;

    const maxTokens = complexity === 'simple' ? 400 : complexity === 'medium' ? 1000 : 2000;
    const temperature = complexity === 'simple' ? 0.3 : complexity === 'medium' ? 0.5 : 0.7;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter (${model}) ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error(`OpenRouter (${model}) vide`);

    return content;
  }
}