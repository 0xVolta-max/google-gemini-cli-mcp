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

export const GOOGLE_MODELS: Record<string, ModelConfig> = {
  "gemini-2.5-pro": {
    model: "gemini-2.5-pro",
    description: "Gemini 2.5 Pro – Fortgeschrittenes Reasoning für komplexe Probleme",
    capabilities: ["reasoning", "multimodal", "long-context", "thinking"],
    strength: "reasoning",
    maxTokens: 1048576,
    defaultTemperature: 0.1,
    inputTypes: ["text", "images", "video", "audio", "pdf"],
    outputTypes: ["text"],
    costTier: "premium"
  },
  "gemini-2.5-flash": {
    model: "gemini-2.5-flash",
    description: "Gemini 2.5 Flash – Optimales Preis-Leistungs-Verhältnis mit Thinking",
    capabilities: ["thinking", "multimodal", "fast", "cost-effective"],
    strength: "multimodal",
    maxTokens: 1048576,
    defaultTemperature: 0.2,
    inputTypes: ["text", "images", "video", "audio"],
    outputTypes: ["text"],
    costTier: "medium"
  },
  "gemini-2.0-flash": {
    model: "gemini-2.0-flash",
    description: "Gemini 2.0 Flash – Next-Gen Features mit Tool-Use",
    capabilities: ["tool-use", "multimodal", "fast", "streaming"],
    strength: "multimodal",
    maxTokens: 1048576,
    defaultTemperature: 0.2,
    inputTypes: ["text", "images", "video", "audio"],
    outputTypes: ["text"],
    costTier: "medium"
  },
  "gemini-1.5-pro": {
    model: "gemini-1.5-pro",
    description: "Gemini 1.5 Pro – Komplexe Reasoning-Aufgaben",
    capabilities: ["reasoning", "multimodal", "long-context"],
    strength: "reasoning",
    maxTokens: 2097152,
    defaultTemperature: 0.1,
    inputTypes: ["text", "images", "video", "audio"],
    outputTypes: ["text"],
    costTier: "high"
  },
  "veo-2": {
    model: "veo-2.0-generate-001",
    description: "Veo 2 – Hochqualitative Videogenerierung aus Text/Bild",
    capabilities: ["video-generation", "creative", "physics-simulation"],
    strength: "video",
    maxTokens: 8192,
    defaultTemperature: 0.7,
    inputTypes: ["text", "images"],
    outputTypes: ["video"],
    costTier: "premium"
  },
  "imagen-4": {
    model: "imagen-4.0-generate-preview-06-06",
    description: "Imagen 4 – Modernste Bildgenerierung",
    capabilities: ["image-generation", "creative", "high-quality"],
    strength: "multimodal",
    maxTokens: 4096,
    defaultTemperature: 0.7,
    inputTypes: ["text"],
    outputTypes: ["images"],
    costTier: "high"
  }
};

export const TASK_TYPES = {
  text: "Textgenerierung und -verarbeitung",
  coding: "Software-Entwicklung und Programmierung",
  creative: "Kreative Inhalte und Bildgenerierung",
  video: "Videogenerierung und -bearbeitung",
  audio: "Audiogenerierung und Sprachsynthese",
  reasoning: "Komplexe Analysen und Problemlösung",
  multimodal: "Multimodale Aufgaben mit verschiedenen Medientypen",
  embedding: "Text-Embeddings und Ähnlichkeitssuche"
} as const;

export type TaskType = keyof typeof TASK_TYPES;
