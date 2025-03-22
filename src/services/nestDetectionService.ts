
import axios from "axios";
import { NestDetectionResponse, NestDetectionResult } from "../types";
import { toast } from "@/components/ui/sonner";

// API Key - In a production app, this would ideally be stored securely
const API_KEY = "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";

export const detectNest = async (imageFile: File): Promise<NestDetectionResult> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const options = {
      method: 'POST',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: {
        model: 'google/gemma-3-27b-it:free',
        messages: [
          {
            role: 'system',
            content: 'You are a bird nest detection system. Only respond in valid JSON format. If you detect a bird nest in the image, respond with {"found": true, "position": {"x1": int, "y1": int, "x2": int, "y2": int}} where the position represents the approximate bounding box coordinates of the nest in pixels (top-left x,y to bottom-right x,y). If no bird nest is detected, respond with {"found": false, "description": "detailed description of what is actually in the image"}. Do not include any explanations or additional text outside of the JSON response.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Is there a bird nest in this image? If yes, provide its pixel coordinates. If no, describe what is in the image.'
              },
              {
                type: 'image_url',
                image_url: {url: base64Image}
              }
            ]
          }
        ]
      }
    };

    const response = await axios.request<NestDetectionResponse>(options);
    
    // Parse the JSON response from the AI
    const content = response.data.choices[0]?.message?.content || '';
    const result = JSON.parse(content) as NestDetectionResult;
    
    return result;
  } catch (error) {
    console.error('Error detecting bird nest:', error);
    toast.error('Failed to analyze image. Please try again.');
    
    // Return a default response
    return {
      found: false,
      description: 'Unable to analyze the image. Please try again.'
    };
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};
