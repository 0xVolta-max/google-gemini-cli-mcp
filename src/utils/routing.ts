import { GOOGLE_MODELS, TaskType } from '../config/models.js';

export interface RoutingResult {
  selectedModel: string;
  taskType: TaskType;
  reasoning: string;
  confidence: number;
}

interface KeywordCounts {
  text: number;
  coding: number;
  creative: number;
  video: number;
  audio: number;
  reasoning: number;
  multimodal: number;
  embedding: number;
}

export class SmartRouter {
  static analyzeAndRoute(query: string, forceModel?: string): RoutingResult {
    const queryLower = query.toLowerCase();
    const keywords = this.extractKeywords(queryLower);

    if (forceModel && GOOGLE_MODELS[forceModel]) {
      return {
        selectedModel: forceModel,
        taskType: GOOGLE_MODELS[forceModel].strength as TaskType,
        reasoning: `Modell wurde explizit angefordert: ${forceModel}`,
        confidence: 1.0
      };
    }

    const scores: Record<string, number> = {};
    Object.keys(GOOGLE_MODELS).forEach(model => {
      scores[model] = 0;
    });

    let primaryTaskType: TaskType = "text";
    let maxScore = 0;

    if (keywords.video > 0) {
      scores["veo-2"] = (scores["veo-2"] || 0) + keywords.video * 10;
      primaryTaskType = "video";
    }
    if (keywords.audio > 0) {
      scores["gemini-2.5-flash"] = (scores["gemini-2.5-flash"] || 0) + keywords.audio * 8;
      primaryTaskType = "audio";
    }
    if (keywords.creative > 0) {
      scores["imagen-4"] = (scores["imagen-4"] || 0) + keywords.creative * 7;
      primaryTaskType = "creative";
    }
    if (keywords.coding > 0) {
      scores["gemini-2.5-pro"] = (scores["gemini-2.5-pro"] || 0) + keywords.coding * 6;
      primaryTaskType = "coding";
    }
    if (keywords.reasoning > 0) {
      scores["gemini-2.5-pro"] = (scores["gemini-2.5-pro"] || 0) + keywords.reasoning * 8;
      primaryTaskType = "reasoning";
    }
    if (keywords.multimodal > 0) {
      scores["gemini-2.5-flash"] = (scores["gemini-2.5-flash"] || 0) + keywords.multimodal * 5;
      primaryTaskType = "multimodal";
    }
    if (keywords.embedding > 0) {
      scores["gemini-2.5-pro"] = (scores["gemini-2.5-pro"] || 0) + keywords.embedding * 10;
      primaryTaskType = "embedding";
    }
    if (keywords.text > 0 || maxScore === 0) {
      scores["gemini-2.5-flash"] = (scores["gemini-2.5-flash"] || 0) + 3;
    }

    let selectedModel = "gemini-2.5-flash";
    for (const [model, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        selectedModel = model;
      }
    }

    const confidence = Math.min(0.95, Math.max(0.6, maxScore / 15));
    const reasoning = this.generateReasoning(selectedModel, keywords, maxScore);

    return {
      selectedModel,
      taskType: primaryTaskType,
      reasoning,
      confidence
    };
  }

  private static extractKeywords(query: string): KeywordCounts {
    const keywordPatterns = {
      text: [
        'text', 'schreib', 'erkläre', 'beschreib', 'zusammenfass', 'artikel',
        'brief', 'email', 'dokument', 'inhalt'
      ],
      coding: [
        'code', 'programmier', 'software', 'debug', 'implementier', 'refactor',
        'algorithm', 'function', 'class', 'method', 'api', 'framework',
        'javascript', 'python', 'typescript', 'react', 'node', 'sql'
      ],
      creative: [
        'bild', 'foto', 'grafik', 'design', 'logo', 'illustration', 'kunst',
        'kreativ', 'visual', 'picture', 'image', 'draw', 'paint', 'sketch'
      ],
      video: [
        'video', 'film', 'animation', 'movie', 'clip', 'cinematic', 'scene',
        'footage', 'recording', 'visual story', 'bewegtbild', 'veo'
      ],
      audio: [
        'audio', 'sprach', 'voice', 'sound', 'musik', 'ton', 'sprechen',
        'vorlesen', 'tts', 'speech', 'podcast', 'narration'
      ],
      reasoning: [
        'analysiere', 'löse', 'komplex', 'strategie', 'problem', 'durchdenke',
        'begründe', 'logic', 'schlussfolger', 'bewerte', 'entscheide'
      ],
      multimodal: [
        'multimodal', 'kombinier', 'verschiedene', 'medien', 'mixed',
        'text und bild', 'audio und video', 'mehrere formate'
      ],
      embedding: [
        'ähnlich', 'vergleich', 'suche', 'embedding', 'vektor', 'cluster',
        'semantic', 'similarity', 'search', 'recommendation'
      ]
    };

    const counts: KeywordCounts = {
      text: 0,
      coding: 0,
      creative: 0,
      video: 0,
      audio: 0,
      reasoning: 0,
      multimodal: 0,
      embedding: 0
    };

    for (const [category, patterns] of Object.entries(keywordPatterns)) {
      counts[category as keyof KeywordCounts] = patterns.reduce((count, pattern) => {
        const regex = new RegExp(pattern, 'gi');
        const matches = query.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);
    }

    return counts;
  }

  private static generateReasoning(model: string, keywords: KeywordCounts, score: number): string {
    const modelConfig = GOOGLE_MODELS[model];
    const strength = modelConfig?.strength || 'text';

    const reasons = [];
    if (keywords.video > 0 && strength === 'video') {
      reasons.push(`Videogenerierung erkannt (${keywords.video} Indikatoren) - Veo 2 optimal`);
    }
    if (keywords.audio > 0 && strength === 'audio') {
      reasons.push(`Audiogenerierung erkannt (${keywords.audio} Indikatoren) - TTS-Modell gewählt`);
    }
    if (keywords.creative > 0 && modelConfig?.outputTypes.includes('images')) {
      reasons.push(`Bildgenerierung erkannt (${keywords.creative} Indikatoren) - Imagen optimal`);
    }
    if (keywords.coding > 0 && (strength === 'reasoning' || strength === 'multimodal')) {
      reasons.push(`Coding-Aufgabe erkannt (${keywords.coding} Indikatoren) - Gemini Pro/Flash optimal`);
    }
    if (keywords.reasoning > 0 && strength === 'reasoning') {
      reasons.push(`Komplexe Analyse erforderlich (${keywords.reasoning} Reasoning-Indikatoren)`);
    }
    if (keywords.embedding > 0 && strength === 'embedding') {
      reasons.push(`Embedding-Aufgabe erkannt (${keywords.embedding} Indikatoren)`);
    }
    if (reasons.length === 0) {
      reasons.push(`${modelConfig?.description || 'Vielseitiger Standard'} - Score: ${score.toFixed(1)}`);
    }
    return reasons.join(', ');
  }
}
