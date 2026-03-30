import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateJavaError(error: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a friendly Java mentor for absolute beginners. 
      Translate the following Java error message into plain, encouraging English. 
      Avoid jargon. Use analogies if helpful. 
      Keep it short and actionable.
      
      Error:
      ${error}`,
    });
    
    return response.text || "I couldn't quite figure out that error, but don't give up! Check your semicolons and brackets.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Something went wrong with the error translator, but keep trying! Most Java errors are just missing semicolons or mismatched brackets.";
  }
}
