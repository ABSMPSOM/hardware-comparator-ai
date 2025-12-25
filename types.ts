export interface GamingBenchmark {
  gameName: string; // e.g. "Cyberpunk 2077"
  resolution: string; // "1080p", "1440p", "4K"
  gpu1Fps: number;
  gpu2Fps: number;
}

export interface ProductivityBenchmark {
  workload: string; // e.g., "Blender Render", "Premiere Export"
  gpu1Score: number;
  gpu2Score: number;
  unit: string; // "Seconds" or "Points"
  lowerIsBetter: boolean;
}

export interface ComparisonData {
  gpu1Name: string;
  gpu2Name?: string; // Optional for single mode
  gamingBenchmarks: GamingBenchmark[];
  productivityBenchmarks: ProductivityBenchmark[];
  gamingAnalysis: string;
  productivityAnalysis: string;
  cpuBottleneckAnalysis?: string;
  verdict: string;
  specs: {
    gpu1: { 
      vram: string; 
      tdp: string; // e.g., "285W"
      releaseYear: string; 
      price: string; // e.g., "$799"
    };
    gpu2?: { 
      vram: string; 
      tdp: string; 
      releaseYear: string; 
      price: string; 
    };
    cpu?: {
      model: string;
      price: string;
      tdp: string;
    };
  };
  efficiency: {
    gpu1FpsPerWatt: number;
    gpu2FpsPerWatt: number;
    analysis: string;
  };
}

export interface CpuConfig {
  model: string;
  ramAmount: string; // e.g., "16GB"
  ramSpeed: string; // e.g., "3200MHz"
  ramBrand?: string; // Optional
}

export interface FormState {
  gpu1: string;
  gpu2: string;
  isSingleMode: boolean; // New toggle
  cpuModel: string;
  ramAmount: string;
  ramSpeed: string;
  ramBrand: string; // New optional field
  targetGames: string[]; // Changed to array
  editingSoftware: string[]; // Changed to array
  targetResolution: string;
  qualityPreset: string; // 'Low', 'Medium', 'High', 'Ultra'
  exportPreset: string; // '1080p H.264', '4K H.265', '4K ProRes', '8K RAW'
}