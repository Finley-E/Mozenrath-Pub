
export enum RenderStatus {
  IDLE = 'IDLE',
  QUEUED = 'QUEUED',
  RENDERING = 'RENDERING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum PublishStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  LIVE = 'LIVE',
  FAILED = 'FAILED'
}

export interface PlatformStatus {
  id: string;
  name: string;
  status: PublishStatus;
  progress: number;
  url?: string;
}

export interface RenderJob {
  id: string;
  name: string;
  prompt: string;
  status: RenderStatus;
  progress: number;
  thumbnail?: string;
  videoUrl?: string;
  timestamp: number;
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
  publishedPlatforms?: PlatformStatus[];
}

export interface UserPreferences {
  apiKeySelected: boolean;
  defaultResolution: '720p' | '1080p';
}
