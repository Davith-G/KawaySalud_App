export enum ViewName {
  HOME = 'HOME',
  NATURAL = 'NATURAL',
  CHAT = 'CHAT',
  MAP = 'MAP',
  AUXILIO = 'AUXILIO'
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Plant {
  id: number | string; // Allow string IDs for AI generated plants
  nameKichwa: string;
  nameSpanish: string;
  description: string;
  uses: string;
  imageUrl: string;
  // New fields for recipes
  ingredients?: string[];
  preparation?: string;
  contraindications?: string;
  isAiGenerated?: boolean;
}

export interface EmergencyContact {
  name: string;
  number: string;
  type: 'general' | 'police' | 'health';
}

// Gemini Types
export interface MapGroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface MapResult {
  text: string;
  chunks: MapGroundingChunk[];
}