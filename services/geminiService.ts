
import { GoogleGenAI } from "@google/genai";
import { CalculationResult, UserPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getPlanAnalysis(
  deviceInfo: string,
  planInfo: string,
  result: CalculationResult,
  persona: UserPersona
) {
  const prompt = `
    You are a professional telecom expert in Taiwan. 
    Analyze the following iPhone purchase plan:
    - Device: ${deviceInfo}
    - Plan: ${planInfo}
    - TCO (Total Cost of Ownership): NT$ ${result.totalCostOfOwnership.toLocaleString()}
    - Initial Outlay: NT$ ${result.initialOutlay.toLocaleString()}
    - Avg. Monthly Cost: NT$ ${result.avgMonthlyCost.toLocaleString()}
    - User Profile: ${persona.dataUsage} data usage, ${persona.budget} budget priority.

    Please provide a concise analysis in Traditional Chinese (zh-TW) covering:
    1. Is this plan worth it for this specific user profile?
    2. Comparison between buying the phone retail vs. this contract.
    3. A concluding "Value Score" from 1-10.
    
    Keep it professional, helpful, and formatted with Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "無法取得 AI 分析建議。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 服務暫時不可用。";
  }
}
