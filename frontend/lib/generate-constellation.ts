"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API || "");

export async function generateSkillConstellation(
  userSkills: string[]
): Promise<any> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
    You are a data visualizer. I have a user with these EXACT verified skills: 
    ${JSON.stringify(userSkills)}

    Generate a "Skill Constellation" JSON.

    CRITICAL RULES:
    1. For "OWNED" nodes, YOU MUST USE THE EXACT STRING from the input list. DO NOT rename "React" to "React.js". DO NOT rename "AWS" to "Amazon Web Services". Keep the name identical.
    2. Suggest 3-5 "GHOST" nodes (new skills to learn).
    3. Categorize nodes: "Frontend", "Backend", "Design", "DevOps", "Core".
    4. Provide a "reason" for GHOST nodes.

    Output JSON structure:
    [
      {
        "id": "slug",
        "name": "Exact Name From Input", 
        "type": "DEGREE" | "CERTIFICATE" | "BADGE", 
        "status": "OWNED" | "GHOST",
        "category": "Frontend" | "Backend" | "Design" | "DevOps" | "Core",
        "relatedIds": ["related-slug"],
        "description": "Short description.",
        "reason": "Why learn this? (GHOST only)"
      }
    ]
    
    Return ONLY JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [];
  }
}
