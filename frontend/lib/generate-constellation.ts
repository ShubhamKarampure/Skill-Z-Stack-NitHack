"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC8cGdOWaaWeA58E7FwqkJ0R3X0V5Uw_ho");

export async function generateSkillConstellation(
  userSkills: string[]
): Promise<any> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); // Fast and capable

  const prompt = `
    I have a user with the following verified technical skills: ${JSON.stringify(
      userSkills
    )}.

    I need you to generate a "Skill Constellation" JSON object for a 3D visualization.
    
    Requirements:
    1. Map the user's current skills as "OWNED" nodes.
    2. Suggest 3-5 specific NEW skills the user should learn next based on their current stack. Mark these as "GHOST" nodes.
    3. Define relationships (edges) between these skills (e.g., React is related to TypeScript).
    4. Categorize them into: "Frontend", "Backend", "Design", "DevOps", or "Core".
    5. Provide a short, punchy 1-sentence description for each node.
    
    Output strictly valid JSON with this structure:
    [
      {
        "id": "slug-string",
        "name": "Display Name",
        "type": "DEGREE" | "CERTIFICATE" | "BADGE", (Degree for major frameworks, Certificate for libs, Badge for tools)
        "status": "OWNED" | "GHOST",
        "category": "Frontend" | "Backend" | "Design" | "DevOps" | "Core",
        "relatedIds": ["id-of-related-node"],
        "description": "Short description.",
        "logoSlug": "slug for simpleicons.org (e.g. react, typescript, amazonaws)"
      }
    ]
    
    Do not wrap in markdown code blocks. Just the JSON string.
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
    return []; // Return empty on fail to prevent crash
  }
}
