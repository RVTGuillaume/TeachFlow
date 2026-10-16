import { AiService } from './ai.service';
declare class AskDto {
    prompt: string;
    context?: string;
}
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    ask(body: AskDto, sessionId?: string): Promise<{
        response: string;
        provider: string;
    }>;
    clearMemory(sessionId?: string): {
        message: string;
    };
}
export {};
