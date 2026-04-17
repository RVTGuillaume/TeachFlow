export declare class AiService {
    private responseCache;
    private readonly CACHE_TTL;
    private readonly providers;
    private conversationMemory;
    ask(prompt: string, context?: string, sessionId?: string): Promise<{
        response: string;
        provider: string;
    }>;
    clearMemory(sessionId: string): void;
    clearCache(): void;
    private getCachedResponse;
    private setCachedResponse;
    private generateCacheKey;
    private analyzePrompt;
    private buildEnrichedPrompt;
    private normalizeResponse;
    private generateSmartSuggestion;
    private saveToMemory;
    private withTimeout;
    private callGroq;
    private callOpenRouter;
}
