
import { GoogleGenAI, Type } from "@google/genai";

// Note: process.env.API_KEY is handled externally as per instructions.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface GeneratedInsight {
  signal: string;
  reflections: string[];
  narrative: string;
  sources: { uri: string; title: string }[];
}

export interface GeneratedNewsletter {
  title: string;
  content: string;
  sources: { uri: string; title: string }[];
}

export const generateAutomatedInsight = async (pillarName: string, sourceName: string, questions: string[]): Promise<GeneratedInsight> => {
  const ai = getAI();
  const prompt = `
    Search for the most recent and relevant crypto market intelligence for the pillar: "${pillarName}".
    Focus specifically on information likely found on or related to: "${sourceName}".
    
    Return a detailed analysis in the following format (do not use JSON, just plain text with these headers):
    
    SIGNAL: [A concise 1-2 sentence summary of the primary market signal found]
    
    REFLECTIONS:
    ${questions.map((q, i) => `Q${i+1}: [Detailed answer to: ${q}]`).join('\n')}
    
    NARRATIVE: [A deep-dive editorial interpretation of this data, focusing on market psychology and structural implications]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri || "",
        title: chunk.web?.title || "Source Link"
      }))
      .filter((s: any) => s.uri !== "") || [];

    const signalMatch = text.match(/SIGNAL:\s*([\s\S]*?)(?=REFLECTIONS:|$)/i);
    const reflectionsMatch = text.match(/REFLECTIONS:\s*([\s\S]*?)(?=NARRATIVE:|$)/i);
    const narrativeMatch = text.match(/NARRATIVE:\s*([\s\S]*?)$/i);

    const signal = signalMatch ? signalMatch[1].trim() : "No signal found.";
    const narrative = narrativeMatch ? narrativeMatch[1].trim() : "No narrative generated.";
    
    const reflectionsText = reflectionsMatch ? reflectionsMatch[1].trim() : "";
    const reflections = questions.map((_, i) => {
      const qMatch = reflectionsText.match(new RegExp(`Q${i+1}:\\s*([\\s\\S]*?)(?=Q${i+2}:|$)`, 'i'));
      return qMatch ? qMatch[1].trim() : "No data fetched for this reflection.";
    });

    return { signal, reflections, narrative, sources };
  } catch (error) {
    console.error("Gemini Automation Error:", error);
    throw error;
  }
};

export const generateAutomatedNewsletter = async (type: string, sourceName: string): Promise<GeneratedNewsletter> => {
  const ai = getAI();
  const prompt = `
    Perform a deep search for the latest crypto news and on-chain trends suitable for a "${type}" newsletter.
    Focus on data and insights from or related to: "${sourceName}".
    
    Write a complete newsletter edition.
    
    Format your response exactly as follows:
    SUBJECT: [A high-impact, clickable subject line]
    BODY: [A 300-500 word professional editorial. Include an introduction, 3-4 key data-driven points, and a closing 'Analyst Outlook' section.]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri || "",
        title: chunk.web?.title || "Source Link"
      }))
      .filter((s: any) => s.uri !== "") || [];

    const subjectMatch = text.match(/SUBJECT:\s*([\s\S]*?)(?=BODY:|$)/i);
    const bodyMatch = text.match(/BODY:\s*([\s\S]*?)$/i);

    return {
      title: subjectMatch ? subjectMatch[1].trim() : "Market Intelligence Update",
      content: bodyMatch ? bodyMatch[1].trim() : "No content generated.",
      sources
    };
  } catch (error) {
    console.error("Newsletter Automation Error:", error);
    throw error;
  }
};

export const synthesizeNarrative = async (signal: string, answers: string[]) => {
  const ai = getAI();
  const prompt = `
    You are a professional Crypto Market Analyst.
    Input Signal: ${signal}
    Contextual Reflections: ${answers.join(' | ')}
    
    Task: Based on the raw signal and my reflections, synthesize a professional, deep-dive narrative interpretation.
    Focus on market psychology, liquidity movements, and structural implications. Avoid hype.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate narrative.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI synthesis. Please try again.";
  }
};

export const draftNewsletter = async (insights: any[]) => {
  const ai = getAI();
  const contentSummary = insights.map(i => `- [${i.pillarId}] Signal: ${i.signal}\n  Narrative: ${i.narrative}`).join('\n\n');
  const prompt = `
    You are an elite crypto newsletter writer. 
    Draft a cohesive, editorial-style newsletter based on these insights:
    
    ${contentSummary}
    
    Guidelines:
    - Use a serious, research-focused tone.
    - Start with a compelling hook.
    - Group insights logically.
    - Focus on 'why' it matters, not just 'what' happened.
    - Max 500 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate newsletter draft.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating newsletter draft.";
  }
};
