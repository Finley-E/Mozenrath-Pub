export class GeminiService {
  static async generateVideo(params: {
    prompt: string;
    resolution: '720p' | '1080p';
    aspectRatio: '16:9' | '9:16';
    image?: string;
    onProgress: (status: string) => void;
  }): Promise<string | undefined> {
    try {
      params.onProgress("Initializing video generation server-side...");

      // 1. Request starting operation
      const response = await fetch('/api/gemini/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: params.prompt,
          resolution: params.resolution,
          aspectRatio: params.aspectRatio,
          image: params.image
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const { operationName } = await response.json();
      if (!operationName) {
        throw new Error("No operation created by the server.");
      }

      params.onProgress("Asset rendering started...");

      // 2. Poll status
      let done = false;
      let attempt = 0;
      while (!done) {
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        params.onProgress(`Rendering frames (pass ${attempt})...`);

        const statusResponse = await fetch('/api/gemini/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName })
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to poll status: HTTP ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        if (statusData.error) {
          throw new Error(statusData.error.message || "Operation failed with rendering error");
        }
        done = !!statusData.done;
      }

      // 3. Download
      params.onProgress("Downloading final asset stream...");
      const downloadResponse = await fetch('/api/gemini/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName })
      });

      if (!downloadResponse.ok) {
        throw new Error(`Failed to stream download: HTTP ${downloadResponse.status}`);
      }

      const blob = await downloadResponse.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      throw error;
    }
  }

  static async generateSocialMetadata(prompt: string, platform: string): Promise<{caption: string, tags: string[]}> {
    try {
      const response = await fetch('/api/gemini/social-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Metadata Generation Error:", error);
      return { caption: `New asset generated for ${platform}! #AI #Creative`, tags: ["AI", "NovaRender"] };
    }
  }

  static async refinePrompt(rawPrompt: string): Promise<string> {
    try {
      const response = await fetch('/api/gemini/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: rawPrompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data.refined || rawPrompt;
    } catch (error) {
      console.error("Prompt Refinement Error:", error);
      return rawPrompt;
    }
  }
}
