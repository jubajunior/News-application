
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAISummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following news article into 3 key bullet points for quick reading:\n\n${content}`,
      config: {
        temperature: 0.5,
      }
    });
    // Fix: Access .text property directly
    return response.text;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return "Summary unavailable at the moment.";
  }
};

export const getTrendingTopics = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "List 5 trending keywords for news in Bangladesh today based on typical current events in South Asia. Format as a comma-separated list.",
    });
    // Fix: Access .text property directly
    return response.text?.split(',') || [];
  } catch (error) {
    return ['Economy', 'Cricket', 'Politics', 'Weather', 'Education'];
  }
};
