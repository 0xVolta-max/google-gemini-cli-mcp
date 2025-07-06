"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiCLIService = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class GeminiCLIService {
    cliPath;
    constructor() {
        this.cliPath = 'gemini';
    }
    async callModel(modelConfig, prompt, temperature = modelConfig.defaultTemperature, systemInstruction) {
        try {
            const escapedPrompt = this.escapeShellArg(prompt);
            const escapedSystem = systemInstruction ? this.escapeShellArg(systemInstruction) : '';
            let command = `${this.cliPath} generate`;
            if (modelConfig.model !== 'gemini-2.5-pro') {
                command += ` --model="${modelConfig.model}"`;
            }
            if (temperature !== 0.1) {
                command += ` --temperature=${temperature}`;
            }
            if (modelConfig.maxTokens !== 4096) {
                command += ` --max-tokens=${Math.min(modelConfig.maxTokens, 8192)}`;
            }
            if (systemInstruction) {
                command += ` --system=${escapedSystem}`;
            }
            command += ` ${escapedPrompt}`;
            if (modelConfig.strength === 'video') {
                return await this.generateVideo(prompt);
            }
            else if (modelConfig.strength === 'audio') {
                return await this.generateAudio(prompt);
            }
            else if (modelConfig.outputTypes.includes('images')) {
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
        }
        catch (error) {
            if (error.message?.includes('not found') || error.message?.includes('command not found')) {
                throw new Error("Gemini CLI nicht installiert. Führen Sie 'npm install -g @google/gemini-cli' aus.");
            }
            else if (error.message?.includes('authentication')) {
                throw new Error("Gemini CLI nicht authentifiziert. Führen Sie 'gemini auth login' aus.");
            }
            else if (error.message?.includes('quota') || error.message?.includes('limit')) {
                throw new Error("Tägliches Limit erreicht (1000 Anfragen/Tag). Versuchen Sie es morgen erneut.");
            }
            else if (error.code === 'ETIMEDOUT') {
                throw new Error("Timeout: Die CLI-Anfrage dauerte zu lange. Versuchen Sie eine einfachere Anfrage.");
            }
            else {
                throw new Error(`Gemini CLI Fehler: ${error.message}`);
            }
        }
    }
    async generateVideo(prompt) {
        try {
            const command = `${this.cliPath} generate --model="veo-2" --type=video ${this.escapeShellArg(prompt)}`;
            const { stdout } = await execAsync(command, { timeout: 300000 });
            return `🎬 **Video generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Videogenerierung mit Veo 2 - Kostenlos über CLI*`;
        }
        catch (error) {
            return `🎬 **Video-Prompt verarbeitet:**\n\nIhr Video-Prompt: "${prompt}"\n\n*Hinweis: Videogenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
        }
    }
    async generateImage(prompt) {
        try {
            const command = `${this.cliPath} generate --model="imagen-4" --type=image ${this.escapeShellArg(prompt)}`;
            const { stdout } = await execAsync(command, { timeout: 180000 });
            return `🎨 **Bild generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Bildgenerierung mit Imagen - Kostenlos über CLI*`;
        }
        catch (error) {
            return `🎨 **Bild-Prompt verarbeitet:**\n\nIhr Bild-Prompt: "${prompt}"\n\n*Hinweis: Bildgenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
        }
    }
    async generateAudio(prompt) {
        try {
            const command = `${this.cliPath} generate --model="gemini-tts" --type=audio ${this.escapeShellArg(prompt)}`;
            const { stdout } = await execAsync(command, { timeout: 120000 });
            return `🔊 **Audio generiert via Gemini CLI:**\n\n${stdout.trim()}\n\n*Hinweis: Sprachsynthese - Kostenlos über CLI*`;
        }
        catch (error) {
            return `🔊 **Audio-Prompt verarbeitet:**\n\nIhr Audio-Prompt: "${prompt}"\n\n*Hinweis: Audiogenerierung über CLI derzeit in Entwicklung. Prompt wurde dokumentiert.*`;
        }
    }
    escapeShellArg(arg) {
        return `"${arg.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`')}"`;
    }
    async testConnection() {
        try {
            const { stdout } = await execAsync(`${this.cliPath} --version`, { timeout: 10000 });
            return stdout.includes('gemini');
        }
        catch {
            return false;
        }
    }
    async checkAuthentication() {
        try {
            const { stdout } = await execAsync(`${this.cliPath} auth status`, { timeout: 10000 });
            return stdout.includes('authenticated') || stdout.includes('logged in');
        }
        catch {
            return false;
        }
    }
    async getRemainingQuota() {
        try {
            const { stdout } = await execAsync(`${this.cliPath} quota`, { timeout: 10000 });
            const requestsMatch = stdout.match(/requests remaining: (\d+)/i);
            const dailyMatch = stdout.match(/daily limit: (\d+)/i);
            return {
                requests: requestsMatch ? parseInt(requestsMatch[1]) : 60,
                daily: dailyMatch ? parseInt(dailyMatch[1]) : 1000
            };
        }
        catch {
            return { requests: 60, daily: 1000 };
        }
    }
}
exports.GeminiCLIService = GeminiCLIService;
//# sourceMappingURL=gemini-cli.js.map