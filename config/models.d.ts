export interface ModelConfig {
    model: string;
    description: string;
    capabilities: string[];
    strength: 'text' | 'multimodal' | 'video' | 'audio' | 'reasoning' | 'coding' | 'embedding';
    maxTokens: number;
    defaultTemperature: number;
    inputTypes: string[];
    outputTypes: string[];
    costTier: 'low' | 'medium' | 'high' | 'premium';
}
export declare const GOOGLE_MODELS: Record<string, ModelConfig>;
export declare const TASK_TYPES: {
    readonly text: "Textgenerierung und -verarbeitung";
    readonly coding: "Software-Entwicklung und Programmierung";
    readonly creative: "Kreative Inhalte und Bildgenerierung";
    readonly video: "Videogenerierung und -bearbeitung";
    readonly audio: "Audiogenerierung und Sprachsynthese";
    readonly reasoning: "Komplexe Analysen und Problemlösung";
    readonly multimodal: "Multimodale Aufgaben mit verschiedenen Medientypen";
    readonly embedding: "Text-Embeddings und Ähnlichkeitssuche";
};
export type TaskType = keyof typeof TASK_TYPES;
//# sourceMappingURL=models.d.ts.map