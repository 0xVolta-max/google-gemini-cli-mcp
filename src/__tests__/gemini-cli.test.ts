import { GeminiCLIService } from '../services/gemini-cli';
import { GOOGLE_MODELS, ModelConfig } from '../config/models';
import { exec } from 'child_process';

// Mock child_process.exec to return a Promise directly
jest.mock('child_process', () => ({
  exec: jest.fn(() => Promise.resolve({ stdout: '', stderr: '' })),
}));

const mockExec = exec as jest.MockedFunction<typeof exec>;

describe('GeminiCLIService', () => {
  let service: GeminiCLIService;

  beforeEach(() => {
    service = new GeminiCLIService();
    jest.clearAllMocks();
  });

  describe('testConnection', () => {
    it('should return true if gemini --version succeeds', async () => {
      mockExec.mockResolvedValue({ stdout: 'Gemini CLI version 1.0.0', stderr: '' });
      const result = await service.testConnection();
      expect(result).toBe(true);
      expect(mockExec).toHaveBeenCalledWith('gemini --version', { timeout: 10000 });
    });

    it('should return false if gemini --version fails', async () => {
      mockExec.mockRejectedValue(new Error('Command failed'));
      const result = await service.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('checkAuthentication', () => {
    it('should return true if gemini --version succeeds (indicating auth)', async () => {
      mockExec.mockResolvedValue({ stdout: 'Gemini CLI version 1.0.0', stderr: '' });
      const result = await service.checkAuthentication();
      expect(result).toBe(true);
      expect(mockExec).toHaveBeenCalledWith('gemini --version', { timeout: 10000 });
    });

    it('should return false if gemini --version fails (indicating no auth)', async () => {
      mockExec.mockRejectedValue(new Error('Command failed'));
      const result = await service.checkAuthentication();
      expect(result).toBe(false);
    });
  });

  describe('getRemainingQuota', () => {
    it('should parse stdout for requests and daily limits', async () => {
      mockExec.mockResolvedValue({ stdout: 'requests remaining: 50\ndaily limit: 900', stderr: '' });
      const quota = await service.getRemainingQuota();
      expect(quota).toEqual({ requests: 50, daily: 900 });
      expect(mockExec).toHaveBeenCalledWith('gemini quota', { timeout: 10000 });
    });

    it('should return default quota if parsing fails', async () => {
      mockExec.mockRejectedValue(new Error('Failed to get quota'));
      const quota = await service.getRemainingQuota();
      expect(quota).toEqual({ requests: 60, daily: 1000 });
    });
  });

  describe('callModel', () => {
    const mockModelConfig: ModelConfig = GOOGLE_MODELS['gemini-2.5-pro']!;

    it('should call the model with correct parameters for a text model', async () => {
      mockExec.mockResolvedValue({ stdout: 'Model response', stderr: '' });

      const prompt = 'Hello, world!';
      const temperature = 0.5;
      const systemInstruction = 'You are a helpful assistant.';

      const result = await service.callModel(
        mockModelConfig,
        prompt,
        temperature,
        systemInstruction
      );

      expect(result).toBe('Model response');
      expect(mockExec).toHaveBeenCalledWith(
        `gemini -m "gemini-2.5-pro" --temperature=0.5 --system="You are a helpful assistant." -p "Hello, world!"`,
        expect.any(Object)
      );
    });

    it('should handle CLI errors', async () => {
      mockExec.mockRejectedValue(new Error('CLI Error: Something went wrong'));

      const prompt = 'Test prompt';
      await expect(service.callModel(mockModelConfig, prompt)).rejects.toThrow(
        'Gemini CLI Fehler: CLI Error: Something went wrong'
      );
    });

    it('should throw error if gemini CLI is not installed', async () => {
      const error = new Error('command not found: gemini') as any;
      error.code = 127; // Common exit code for command not found
      mockExec.mockRejectedValue(error);

      const prompt = 'Test prompt';
      await expect(service.callModel(mockModelConfig, prompt)).rejects.toThrow(
        'Gemini CLI nicht installiert. Führen Sie \'npm install -g @google/gemini-cli\' aus.'
      );
    });

    it('should throw error if API key is not configured', async () => {
      mockExec.mockRejectedValue(new Error('API key not configured'));

      const prompt = 'Test prompt';
      await expect(service.callModel(mockModelConfig, prompt)).rejects.toThrow(
        'Gemini API Key nicht konfiguriert. Setzen Sie die Umgebungsvariable GEMINI_API_KEY.'
      );
    });

    it('should throw error if daily limit is reached', async () => {
      mockExec.mockRejectedValue(new Error('quota exceeded'));

      const prompt = 'Test prompt';
      await expect(service.callModel(mockModelConfig, prompt)).rejects.toThrow(
        'Tägliches Limit erreicht (1000 Anfragen/Tag). Versuchen Sie es morgen erneut.'
      );
    });

    it('should handle timeout errors', async () => {
      const error = new Error('Command timed out') as any;
      error.code = 'ETIMEDOUT';
      mockExec.mockRejectedValue(error);

      const prompt = 'Test prompt';
      await expect(service.callModel(mockModelConfig, prompt)).rejects.toThrow(
        'Timeout: Die CLI-Anfrage dauerte zu lange. Versuchen Sie eine einfachere Anfrage.'
      );
    });

    it('should handle empty stdout', async () => {
      mockExec.mockResolvedValue({ stdout: '', stderr: '' });

      const prompt = 'Test prompt';
      await expect(service.callModel(mockModelConfig, prompt)).rejects.toThrow(
        'Unerwartete CLI-Antwort: Kein Content erhalten. Stderr: '
      );
    });

    it('should handle video generation', async () => {
      const videoModelConfig: ModelConfig = GOOGLE_MODELS['veo-2']!;
      mockExec.mockResolvedValue({ stdout: 'video_url_here', stderr: '' });

      const prompt = 'Generate a video of a cat playing';
      const result = await service.callModel(videoModelConfig, prompt);
      expect(result).toContain('🎬 **Video generiert via Gemini CLI:**');
      expect(result).toContain('video_url_here');
      expect(mockExec).toHaveBeenCalledWith(
        `gemini -m "veo-2" --type=video -p "Generate a video of a cat playing"`,
        expect.any(Object)
      );
    });

    it('should handle image generation', async () => {
      const imageModelConfig: ModelConfig = GOOGLE_MODELS['imagen-4']!;
      mockExec.mockResolvedValue({ stdout: 'image_url_here', stderr: '' });

      const prompt = 'Generate an image of a dog';
      const result = await service.callModel(imageModelConfig, prompt);
      expect(result).toContain('🎨 **Bild generiert via Gemini CLI:**');
      expect(result).toContain('image_url_here');
      expect(mockExec).toHaveBeenCalledWith(
        `gemini -m "imagen-4" --type=image -p "Generate an image of a dog"`,
        expect.any(Object)
      );
    });

    it('should handle audio generation', async () => {
      const audioModelConfig: ModelConfig = {
        model: "gemini-tts",
        description: "Gemini TTS for audio generation",
        capabilities: ["audio-generation"],
        strength: "audio",
        maxTokens: 4096,
        defaultTemperature: 0.5,
        inputTypes: ["text"],
        outputTypes: ["audio"],
        costTier: "low"
      };

      mockExec.mockResolvedValue({ stdout: 'audio_url_here', stderr: '' });

      const prompt = 'Generate audio of a bird singing';
      const result = await service.callModel(audioModelConfig, prompt);
      expect(result).toContain('🔊 **Audio generiert via Gemini CLI:**');
      expect(result).toContain('audio_url_here');
      expect(mockExec).toHaveBeenCalledWith(
        `gemini -m "gemini-tts" --type=audio -p "Generate audio of a bird singing"`,
        expect.any(Object)
      );
    });
  });
});