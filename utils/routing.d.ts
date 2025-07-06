import { TaskType } from '../config/models.js';
export interface RoutingResult {
    selectedModel: string;
    taskType: TaskType;
    reasoning: string;
    confidence: number;
}
export declare class SmartRouter {
    static analyzeAndRoute(query: string, forceModel?: string): RoutingResult;
    private static extractKeywords;
    private static generateReasoning;
}
//# sourceMappingURL=routing.d.ts.map