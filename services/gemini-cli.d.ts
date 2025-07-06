import { ModelConfig } from '../config/models.js';
export declare class GeminiCLIService {
    private readonly cliPath;
    constructor();
    callModel(modelConfig: ModelConfig, prompt: string, temperature?: number, systemInstruction?: string): Promise<string>;
    private generateVideo;
    private generateImage;
    private generateAudio;
    private escapeShellArg;
    testConnection(): Promise<boolean>;
    checkAuthentication(): Promise<boolean>;
    getRemainingQuota(): Promise<{
        requests: number;
        daily: number;
    }>;
}
//# sourceMappingURL=gemini-cli.d.ts.map