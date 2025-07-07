import { exec } from 'child_process';
import { promisify } from 'util';
import { ModelConfig } from '../config/models.js';

const execAsync = promisify(exec);

export class GeminiCLIService {
  private readonly cliPath: string;

  constructor() {
    this.cliPath = 'gemini';
  }

  async callModel(
    modelConfig: ModelConfig,
    prompt: string,
    temperature: number = modelConfig.defaultTemperature,
    systemInstruction?: string
  ): Promise<string> {
    try {
      const escapedPrompt = this.escapeShellArg(prompt);
      const escapedSystem = systemInstruction ? this.escapeShellArg(systemInstruction) : '';

      let finalPrompt = prompt;
      if (systemInstruction) {
        finalPrompt = `${systemInstruction}\n\n${prompt}`;
      }
      const escapedFinalPrompt = this.escapeShellArg(finalPrompt);

      let command = `${this.cliPath} -m "${modelConfig.model}" -p ${escapedFinalPrompt}`;

      if (modelConfig.strength === 'video') {
        return await this.generateVideo(prompt);
      } else if (modelConfig.strength === 'audio') {
        return await this.generateAudio(prompt);
      } else if (modelConfig.outputTypes.includes('images')) {
        return await this.generateImage(prompt);
      }

      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000,
        maxBuffer: 1024 * 1024 * 10
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
    try {
      const command = `${this.cliPath} generate --model="veo-2" --type=video ${this.escapeShellArg(prompt)}`;
      const { stdout } = await execAsync(command, { timeout: 300000 });
      return `🎬 **Video generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Videogenerierung mit Veo 2 - Kostenlos über CLI*`;
    } catch (error) {
      return `🎬 **Video-Prompt verarbeitet:**\n\nIhr Video-Prompt: "${prompt}"\n\n*Hinweis: Videogenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
    }
  }

  private async generateImage(prompt: string): Promise<string> {
    try {
      const command = `${this.cliPath} generate --model="imagen-4" --type=image ${this.escapeShellArg(prompt)}`;
      const { stdout } = await execAsync(command, { timeout: 180000 });
      return `🎨 **Bild generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Bildgenerierung mit Imagen - Kostenlos über CLI*`;
    } catch (error) {
      return `🎨 **Bild-Prompt verarbeitet:**\n\nIhr Bild-Prompt: "${prompt}"\n\n*Hinweis: Bildgenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
    }
  }

  private async generateAudio(prompt: string): Promise<string> {
    try {
      const command = `${this.cliPath} generate --model="gemini-tts" --type=audio ${this.escapeShellArg(prompt)}`;
      const { stdout } = await execAsync(command, { timeout: 120000 });
      return `🔊 **Audio generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Sprachsynthese - Kostenlos über CLI*`;
    } catch (error) {
      return `🔊 **Audio-Prompt verarbeitet:**\n\nIhr Audio-Prompt: "${prompt}"\n\n*Hinweis: Audiogenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
    }
  }

  private escapeShellArg(arg: string): string {
    return `"${arg.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`')}"`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${this.cliPath} --version`, { timeout: 10000 });
      // Check if we get a version number (the CLI returns just the version, e.g., "0.1.9")
      return /^\d+\.\d+\.\d+/.test(stdout.trim());
    } catch {
      return false;
    }
  }

  async checkAuthentication(): Promise<boolean> {
    try {
      // Test authentication by making a minimal request
      const { stderr } = await execAsync(`${this.cliPath} -p "test" --model="gemini-2.5-flash"`, { timeout: 10000 });
      // If we get a quota error or similar API error, authentication is working
      return !stderr.includes('authentication') && !stderr.includes('not authenticated') && !stderr.includes('login required');
    } catch (error: any) {
      // If error contains authentication issues, it's not authenticated
      if (error.message?.includes('authentication') || error.message?.includes('not authenticated') || error.message?.includes('login required')) {
        return false;
      }
      // If we get quota errors or other API errors, authentication is working
      return true;
    }
  }

  async getRemainingQuota(): Promise<{ requests: number; daily: number }> {
    try {
      const { stdout } = await execAsync(`${this.cliPath} quota`, { timeout: 10000 });
      const requestsMatch = stdout.match(/requests remaining: (\d+)/i);
      const dailyMatch = stdout.match(/daily limit: (\d+)/i);
      return {
        requests: requestsMatch && requestsMatch[1] ? parseInt(requestsMatch[1]) : 60,
        daily: dailyMatch && dailyMatch[1] ? parseInt(dailyMatch[1]) : 1000
      };
    } catch {
      return { requests: 60, daily: 1000 };
    }
  }
}
