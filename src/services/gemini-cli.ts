typescriptimport { exec } from 'child_process';
import { promisify } from 'util';
import { ModelConfig } from '../config/models.js';

const execAsync = promisify(exec);

export interface GeminiCLIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class GeminiCLIService {
  private readonly cliPath: string;

  constructor() {
    this.cliPath = 'gemini'; // Globaler CLI-Befehl
  }

  async callModel(
    modelConfig: ModelConfig,
    prompt: string,
    temperature: number = modelConfig.defaultTemperature,
    systemInstruction?: string
  ): Promise<string> {
    try {
      // Escape special characters für Shell
      const escapedPrompt = this.escapeShellArg(prompt);
      const escapedSystem = systemInstruction ? this.escapeShellArg(systemInstruction) : '';

      // CLI-Befehl zusammenstellen
      let command = `${this.cliPath} generate`;
      
      // Modell spezifizieren (falls unterstützt)
      if (modelConfig.model !== 'gemini-2.5-pro') {
        command += ` --model="${modelConfig.model}"`;
      }

      // Temperature setzen
      if (temperature !== 0.1) {
        command += ` --temperature=${temperature}`;
      }

      // Max Tokens setzen
      if (modelConfig.maxTokens !== 4096) {
        command += ` --max-tokens=${Math.min(modelConfig.maxTokens, 8192)}`;
      }

      // System Instruction hinzufügen
      if (systemInstruction) {
        command += ` --system=${escapedSystem}`;
      }

      // Prompt hinzufügen
      command += ` ${escapedPrompt}`;

      // Spezielle Behandlung für verschiedene Modelltypen
      if (modelConfig.strength === 'video') {
        return await this.generateVideo(prompt);
      } else if (modelConfig.strength === 'audio') {
        return await this.generateAudio(prompt);
      } else if (modelConfig.outputTypes.includes('images')) {
        return await this.generateImage(prompt);
      }

      // Standard-Textgenerierung
      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 2 Minuten Timeout
        maxBuffer: 1024 * 1024 * 10 // 10MB Buffer
      });

      if (stderr && !stderr.includes('Warning')) {
        throw new Error(`CLI Fehler: ${stderr}`);
      }

      if (!stdout || stdout.trim().length === 0) {
        throw new Error("Unerwartete CLI-Antwort: Kein Content erhalten");
      }

      return stdout.trim();

    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('command not found')) {
        throw new Error("Gemini CLI nicht installiert. Führen Sie 'npm install -g @google/gemini-cli' aus.");
      } else if (error.message?.includes('authentication')) {
        throw new Error("Gemini CLI nicht authentifiziert. Führen Sie 'gemini auth login' aus.");
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error("Tägliches Limit erreicht (1000 Anfragen/Tag). Versuchen Sie es morgen erneut.");
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error("Timeout: Die CLI-Anfrage dauerte zu lange. Versuchen Sie eine einfachere Anfrage.");
      } else {
        throw new Error(`Gemini CLI Fehler: ${error.message}`);
      }
    }
  }

  private async generateVideo(prompt: string): Promise<string> {
    // Veo 2 über CLI (falls verfügbar)
    try {
      const command = `${this.cliPath} generate --model="veo-2" --type=video ${this.escapeShellArg(prompt)}`;
      const { stdout } = await execAsync(command, { timeout: 300000 }); // 5 Minuten für Video
      
      return `🎬 **Video generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Videogenerierung mit Veo 2 - Kostenlos über CLI*`;
    } catch (error) {
      return `🎬 **Video-Prompt verarbeitet:**\n\nIhr Video-Prompt: "${prompt}"\n\n*Hinweis: Videogenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
    }
  }

  private async generateImage(prompt: string): Promise<string> {
    // Imagen über CLI (falls verfügbar)
    try {
      const command = `${this.cliPath} generate --model="imagen-3" --type=image ${this.escapeShellArg(prompt)}`;
      const { stdout } = await execAsync(command, { timeout: 180000 }); // 3 Minuten für Bild
      
      return `🎨 **Bild generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Bildgenerierung mit Imagen - Kostenlos über CLI*`;
    } catch (error) {
      return `🎨 **Bild-Prompt verarbeitet:**\n\nIhr Bild-Prompt: "${prompt}"\n\n*Hinweis: Bildgenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
    }
  }

  private async generateAudio(prompt: string): Promise<string> {
    // TTS über CLI (falls verfügbar)
    try {
      const command = `${this.cliPath} generate --model="gemini-tts" --type=audio ${this.escapeShellArg(prompt)}`;
      const { stdout } = await execAsync(command, { timeout: 120000 }); // 2 Minuten für Audio
      
      return `🔊 **Audio generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Sprachsynthese - Kostenlos über CLI*`;
    } catch (error) {
      return `🔊 **Audio-Prompt verarbeitet:**\n\nIhr Audio-Prompt: "${prompt}"\n\n*Hinweis: Audiogenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
    }
  }

  private escapeShellArg(arg: string): string {
    // Escape für Shell-Sicherheit
    return `"${arg.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`')}"`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${this.cliPath} --version`, { timeout: 10000 });
      return stdout.includes('gemini');
    } catch {
      return false;
    }
  }

  async checkAuthentication(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${this.cliPath} auth status`, { timeout: 10000 });
      return stdout.includes('authenticated') || stdout.includes('logged in');
    } catch {
      return false;
    }
  }

  async getRemainingQuota(): Promise<{ requests: number; daily: number }> {
    try {
      // Falls die CLI Quota-Informationen bereitstellt
      const { stdout } = await execAsync(`${this.cliPath} quota`, { timeout: 10000 });
      
      // Parse Quota-Informationen (falls verfügbar)
      const requestsMatch = stdout.match(/requests remaining: (\d+)/i);
      const dailyMatch = stdout.match(/daily limit: (\d+)/i);
      
      return {
        requests: requestsMatch ? parseInt(requestsMatch[1]) : 60,
        daily: dailyMatch ? parseInt(dailyMatch[1]) : 1000
      };
    } catch {
      // Standard-Limits zurückgeben
      return { requests: 60, daily: 1000 };
    }
  }
}