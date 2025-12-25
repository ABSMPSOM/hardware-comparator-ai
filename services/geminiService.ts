import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparisonData, CpuConfig, FormState } from "../types";

// Define the response schema strictly to ensure consistent JSON output
const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    gpu1Name: { type: Type.STRING, description: "Normalized name of the first GPU" },
    gpu2Name: { type: Type.STRING, description: "Normalized name of the second GPU (or empty string if single mode)", nullable: true },
    gamingBenchmarks: {
      type: Type.ARRAY,
      description: "Estimated FPS for 10 distinct AAA games. Include a diverse mix of engines (Unreal 5, proprietary) and genres (FPS, RPG, Racing).",
      items: {
        type: Type.OBJECT,
        properties: {
          gameName: { type: Type.STRING, description: "Name of the game (e.g., 'Cyberpunk 2077')" },
          resolution: { type: Type.STRING, description: "Resolution used for this specific benchmark (e.g., '1440p')" },
          gpu1Fps: { type: Type.NUMBER },
          gpu2Fps: { type: Type.NUMBER, description: "Set to 0 if single mode" },
        },
        required: ["gameName", "resolution", "gpu1Fps", "gpu2Fps"],
      },
    },
    productivityBenchmarks: {
      type: Type.ARRAY,
      description: "Productivity scores or times. Use 3-4 representative workloads (e.g., Blender, Video Export). If a specific software is requested, include it.",
      items: {
        type: Type.OBJECT,
        properties: {
          workload: { type: Type.STRING, description: "Name of the task, e.g. 'Premiere Pro 4K Export' or 'Blender Classroom'" },
          gpu1Score: { type: Type.NUMBER },
          gpu2Score: { type: Type.NUMBER, description: "Set to 0 if single mode" },
          unit: { type: Type.STRING, enum: ["Points", "Seconds"] },
          lowerIsBetter: { type: Type.BOOLEAN },
        },
        required: ["workload", "gpu1Score", "gpu2Score", "unit", "lowerIsBetter"],
      },
    },
    specs: {
      type: Type.OBJECT,
      properties: {
        gpu1: {
          type: Type.OBJECT,
          properties: {
            vram: { type: Type.STRING },
            tdp: { type: Type.STRING, description: "Typical Board Power (TBP/TDP) in Watts, e.g., '285W'" },
            releaseYear: { type: Type.STRING },
            price: { type: Type.STRING, description: "Current estimated market price in USD, e.g. '$799'" },
          },
        },
        gpu2: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            vram: { type: Type.STRING },
            tdp: { type: Type.STRING, description: "Typical Board Power (TBP/TDP) in Watts, e.g., '245W'" },
            releaseYear: { type: Type.STRING },
            price: { type: Type.STRING, description: "Current estimated market price in USD, e.g. '$549'" },
          },
        },
        cpu: {
          type: Type.OBJECT,
          properties: {
            model: { type: Type.STRING },
            price: { type: Type.STRING, description: "Current estimated market price in USD" },
            tdp: { type: Type.STRING },
          },
          nullable: true,
        },
      },
    },
    efficiency: {
      type: Type.OBJECT,
      description: "Performance per Watt analysis",
      properties: {
        gpu1FpsPerWatt: { type: Type.NUMBER, description: "Calculated average FPS divided by typical power draw" },
        gpu2FpsPerWatt: { type: Type.NUMBER, description: "Calculated average FPS divided by typical power draw (0 if single mode)" },
        analysis: { type: Type.STRING, description: "Brief comment on power efficiency and electricity costs." }
      },
      required: ["gpu1FpsPerWatt", "gpu2FpsPerWatt", "analysis"]
    },
    gamingAnalysis: { type: Type.STRING, description: "Concise technical analysis for gamers. No fluff." },
    productivityAnalysis: { type: Type.STRING, description: "Concise technical analysis for creators. No fluff." },
    cpuBottleneckAnalysis: { type: Type.STRING, description: "Analysis of CPU pairing fit." },
    verdict: { type: Type.STRING, description: "Final concise recommendation." },
  },
  required: ["gpu1Name", "gamingBenchmarks", "productivityBenchmarks", "specs", "efficiency", "gamingAnalysis", "productivityAnalysis", "verdict"],
};

export const fetchComparison = async (
  gpu1: string,
  gpu2: string,
  cpuConfig?: CpuConfig,
  preferences?: { 
    targetGames?: string[]; 
    targetResolution?: string; 
    qualityPreset?: string; 
    editingSoftware?: string[]; 
    exportPreset?: string;
    isSingleMode?: boolean 
  }
): Promise<ComparisonData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const resolution = preferences?.targetResolution || "1440p";
  const quality = preferences?.qualityPreset || "High";
  const exportSettings = preferences?.exportPreset || "4K H.265";
  const isSingle = preferences?.isSingleMode || false;

  const gameList = preferences?.targetGames && preferences.targetGames.length > 0
    ? preferences.targetGames.join(", ")
    : "popular AAA titles";
  
  const gameFocus = preferences?.targetGames && preferences.targetGames.length > 0
    ? `CRITICAL: You MUST include specific estimated benchmarks for the following games: ${gameList}.` 
    : "";
  
  const softwareList = preferences?.editingSoftware && preferences.editingSoftware.length > 0
    ? preferences.editingSoftware.join(", ")
    : "";
    
  const softwareFocus = softwareList
    ? `CRITICAL: You MUST include specific render speed (export time in Seconds) benchmarks for these software: ${softwareList}. Use the export setting: ${exportSettings}. The unit must be 'Seconds' and lowerIsBetter must be true.`
    : `Include a render benchmark using settings close to: ${exportSettings}.`;

  let prompt = "";
  if (isSingle) {
    prompt = `Analyze the performance of the GPU: ${gpu1}.
    
    1. Provide estimated average FPS for 10 distinct games (including ${gameList}) at ${resolution} with ${quality} settings.
    2. Provide productivity metrics for tasks like 3D Rendering and Video Editing. ${softwareFocus}
    3. Provide CURRENT ESTIMATED MARKET PRICE (USD) and TYPICAL POWER CONSUMPTION (TDP) for the GPU.
    4. Calculate Performance per Watt (FPS/Watts).
    
    IMPORTANT: For all 'gpu2' related fields in the schema (gpu2Name, gpu2Fps, gpu2Score, specs.gpu2, etc.), return null or 0.
    `;
  } else {
    prompt = `Compare the following two GPUs based on publicly available performance data: ${gpu1} vs ${gpu2}.
    
    1. Provide estimated average FPS for 10 distinct games (including ${gameList}) at ${resolution} with ${quality} settings.
    2. Provide productivity metrics for tasks like 3D Rendering and Video Editing. ${softwareFocus}
    3. Provide CURRENT ESTIMATED MARKET PRICES (USD) and TDP for both GPUs.
    4. Calculate Performance per Watt for both.
    `;
  }

  prompt += `\nEnsure data is realistic and based on general hardware consensus. Style: Technical, concise, objective. No marketing fluff.`;

  if (cpuConfig && cpuConfig.model) {
    const ramInfo = `${cpuConfig.ramAmount || "unknown RAM"} ${cpuConfig.ramBrand ? `(${cpuConfig.ramBrand})` : ""} at ${cpuConfig.ramSpeed || "unknown speed"}`;
    prompt += `\nAlso analyze if the CPU (${cpuConfig.model}) with ${ramInfo} will bottleneck the GPU(s). Include CPU price and TDP in the specs section.`;
  } else {
    prompt += `\n(No CPU bottleneck analysis needed, set that field to 'N/A' or generic advice. Leave specs.cpu null).`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: comparisonSchema,
        systemInstruction: "You are a hardware performance expert. You provide accurate, data-driven comparisons. Never hallucinate wild numbers; use averages from reputable tech reviews mentally. Provide realistic market pricing.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const data = JSON.parse(jsonText) as ComparisonData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate comparison. Please check input names or try again.");
  }
};

export const extractSpecsFromPdf = async (fileBase64: string): Promise<Partial<FormState>> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this document and extract the PC hardware specifications.
    Identify the main dedicated Graphics Card (GPU), the Processor (CPU), RAM Amount, RAM Speed, and RAM Brand.
    
    Return a JSON object with keys: 
    - gpu1 (The dedicated GPU model found)
    - cpuModel (The specific CPU model)
    - ramAmount (Total RAM size, e.g. 16GB)
    - ramSpeed (RAM Frequency, e.g. 3200MHz)
    - ramBrand (The manufacturer of the RAM, e.g. Corsair, G.Skill, Kingston. If unknown, leave empty)
    
    If a specific detail is not found, leave the string empty.
    Do not guess.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
             { text: prompt },
             { inlineData: { mimeType: "application/pdf", data: fileBase64 } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gpu1: { type: Type.STRING },
            cpuModel: { type: Type.STRING },
            ramAmount: { type: Type.STRING },
            ramSpeed: { type: Type.STRING },
            ramBrand: { type: Type.STRING },
          },
          required: ["gpu1", "cpuModel", "ramAmount", "ramSpeed", "ramBrand"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return {};
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to extract specifications from the PDF.");
  }
};