
export interface NestDetectionResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

export interface NestDetectionResult {
  found: boolean;
  position?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  description?: string;
}

export interface UploadedImage {
  preview: string;
  file: File;
}

export interface ImageHostingResponse {
  data: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}
