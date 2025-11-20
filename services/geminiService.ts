import { GoogleGenAI, Chat, GenerateContentResponse, Tool, Type } from "@google/genai";
import { MapResult, MapGroundingChunk, Plant } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Chatbot Service using Gemini 3 Pro Preview
 * Contextualized for Chimborazo community (Traditional + Modern Medicine)
 */
let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Eres "Yachak", un asistente de salud virtual diseñado para la comunidad de Chimborazo, Ecuador, como parte del proyecto Kawsay Salud.
      
      Tus objetivos principales son:
      1. Proveer información sobre salud integrando la medicina moderna (occidental) con la medicina tradicional andina (remedios naturales, plantas, saberes ancestrales).
      2. Hablar con un tono empático, respetuoso y claro, usando español accesible. Puedes usar palabras en Kichwa como "Alli Puncha" (Buenos días) o "Yupaychani" (Gracias).
      3. Si el usuario menciona síntomas graves (dolor torácico fuerte, dificultad para respirar, sangrado profuso, etc.), SIEMPRE recomienda acudir inmediatamente a un centro de salud u hospital.
      4. Cuando sugieras remedios naturales (ej. manzanilla, matico, eucalipto), explica para qué sirven y cómo prepararlos de forma segura.
      5. Conoces el contexto local: altura, frío, alimentación de la sierra ecuatoriana.
      
      NO des diagnósticos médicos definitivos. Eres una guía informativa y de apoyo.`,
    },
  });
};

export const sendMessageStream = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!chatSession) {
    initializeChat();
  }
  if (!chatSession) throw new Error("Failed to initialize chat session");

  try {
    return await chatSession.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    // Re-initialize on error in case session expired
    initializeChat();
    if (chatSession) {
         return await chatSession.sendMessageStream({ message });
    }
    throw error;
  }
};

/**
 * Maps Grounding Service using Gemini 2.5 Flash
 * Finds nearby hospitals and clinics.
 */
export const findNearbyPlaces = async (
  query: string, 
  latitude?: number, 
  longitude?: number
): Promise<MapResult> => {
  
  const tools: Tool[] = [{ googleMaps: {} }];
  
  // Construct tool config only if coords are present
  const toolConfig = (latitude && longitude) ? {
    retrievalConfig: {
      latLng: {
        latitude,
        longitude
      }
    }
  } : undefined;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Busca en Google Maps: ${query}. Enfócate en centros de salud, hospitales o farmacias cerca de la ubicación provista si existe.`,
      config: {
        tools,
        toolConfig,
      },
    });

    const text = response.text || "No se encontró información específica en el mapa.";
    const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as unknown as MapGroundingChunk[];

    return { text, chunks };

  } catch (error) {
    console.error("Error in Maps Grounding:", error);
    return { text: "Hubo un error al buscar lugares cercanos. Por favor intenta más tarde.", chunks: [] };
  }
};

/**
 * Traditional Medicine Advisor
 * Uses standard generation to give specific comparisons or advice.
 */
export const getTraditionalAdvice = async (symptom: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `El usuario consulta por: "${symptom}".
      
      Genera una respuesta breve y estructurada en formato Markdown con dos secciones:
      1. **Visión Ancestral/Natural**: Sugiere 1 o 2 remedios naturales comunes en la sierra ecuatoriana (Chimborazo) para esto. Menciona plantas como Matico, Manzanilla, Eucalipto, etc.
      2. **Visión Médica General**: Sugiere cuidados básicos o medicación de venta libre común, y cuándo ver a un doctor.
      
      Mantén un tono educativo y seguro.`,
    });
    return response.text || "No pude generar un consejo en este momento.";
  } catch (error) {
    console.error("Error getting traditional advice:", error);
    return "Error al consultar la sabiduría ancestral.";
  }
};

/**
 * Generates a structured plant recipe using Gemini JSON mode.
 */
export const getPlantDetails = async (plantName: string): Promise<Plant> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provee información detallada sobre la planta medicinal: "${plantName}" en el contexto de la medicina tradicional de los Andes (Ecuador).
        Necesito nombre en Kichwa (si existe, o inventalo basado en descripción visual si no es común), nombre español, usos, una imagen generada (sigue las instrucciones de schema), ingredientes para un remedio y pasos de preparación.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                nameSpanish: { type: Type.STRING },
                nameKichwa: { type: Type.STRING },
                description: { type: Type.STRING },
                uses: { type: Type.STRING },
                imageUrl: { type: Type.STRING, description: "Construct a URL for an AI image using this format: https://image.pollinations.ai/prompt/medicinal%20plant%20{EnglishNameOfPlant}%20natural%20photography?width=800&height=600&nologo=true" },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                preparation: { type: Type.STRING, description: "Numbered steps for preparation." },
                contraindications: { type: Type.STRING }
            },
            required: ["nameSpanish", "nameKichwa", "description", "uses", "ingredients", "preparation", "contraindications", "imageUrl"]
          }
        }
      });

      if (response.text) {
          const data = JSON.parse(response.text);
          return {
              id: Date.now(), // Temporary ID
              ...data,
              isAiGenerated: true
          } as Plant;
      }
      throw new Error("Empty response");

    } catch (error) {
        console.error("Error fetching plant details", error);
        throw error;
    }
}