
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private static async getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateVideo(params: {
    prompt: string;
    resolution: '720p' | '1080p';
    aspectRatio: '16:9' | '9:16';
    image?: string;
    onProgress: (status: string) => void;
  }): Promise<string | undefined> {
    const ai = await this.getClient();
    
    try {
      params.onProgress("Initializing session...");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: params.prompt,
        image: params.image ? {
          imageBytes: params.image.split(',')[1] || params.image,
          mimeType: 'image/png'
        } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: params.resolution,
          aspectRatio: params.aspectRatio
        }
      });

      params.onProgress("Processing render nodes...");

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        params.onProgress("Rendering high-quality frames...");
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("No video generated");

      params.onProgress("Finalizing asset...");
      const finalResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await finalResponse.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_EXPIRED");
      }
      throw error;
    }
  }

  static async generateSocialMetadata(prompt: string, platform: string): Promise<{caption: string, tags: string[]}> {
    const ai = await this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a viral caption and 5 relevant hashtags for ${platform} based on this video content: "${prompt}". Format as JSON with "caption" and "tags" keys.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["caption", "tags"]
        }
      }
    });
    try {
      return JSON.parse(response.text);
    } catch {
      return { caption: `New asset generated for ${platform}! #AI #Creative`, tags: ["AI", "NovaRender"] };
    }
  }

  static async refinePrompt(rawPrompt: string): Promise<string> {
    const ai = await this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Enhance this video production prompt for high-quality cinematic output: "${rawPrompt}". Output only the refined prompt text.`,
      config: {
          thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || rawPrompt;
  }
}
