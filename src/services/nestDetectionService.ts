import axios from "axios";
import { NestDetectionResponse, NestDetectionResult } from "../types";
import { toast } from "sonner";

// API Key - In a production app, this would ideally be stored securely
const API_KEY = "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";

// Image hosting service endpoint
const UPLOAD_API_URL = "https://api.imgbb.com/1/upload";
const IMGBB_API_KEY = "b9a79e2e83e4f47ca668462ad2a96396"; // Public API key for ImgBB

// Upload image to hosting service and get a URL
export const uploadImageToHosting = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("key", IMGBB_API_KEY);

    const response = await axios.post(UPLOAD_API_URL, formData);
    
    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload image. Please try again.");
    throw error;
  }
};

// Detect nest from an image file by first uploading it
export const detectNestFromFile = async (imageFile: File): Promise<NestDetectionResult> => {
  try {
    // Upload to image hosting first
    const imageUrl = await uploadImageToHosting(imageFile);
    
    // Now detect nest using the URL
    return await detectNestFromUrl(imageUrl);
  } catch (error) {
    console.error('Error detecting bird nest from file:', error);
    toast.error('Failed to analyze image. Please try again.');
    
    // Return a default response
    return {
      found: false,
      description: 'Unable to analyze the image. Please try again.'
    };
  }
};

// Detect nest directly from a URL
export const detectNestFromUrl = async (imageUrl: string): Promise<NestDetectionResult> => {
  try {
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
                image_url: {url: imageUrl}
              }
            ]
          }
        ]
      }
    };

    const response = await axios.request<NestDetectionResponse>(options);
    
    // Parse the JSON response from the AI
    const content = response.data.choices[0]?.message?.content || '';
    console.log("AI response:", content);
    const result = JSON.parse(content) as NestDetectionResult;
    
    return result;
  } catch (error) {
    console.error('Error detecting bird nest from URL:', error);
    toast.error('Failed to analyze image. Please try again.');
    
    // Return a default response
    return {
      found: false,
      description: 'Unable to analyze the image. Please try again.'
    };
  }
};

// Original function for backward compatibility
export const detectNest = detectNestFromFile;

// Helper function to convert File to base64 (keeping for reference)
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
