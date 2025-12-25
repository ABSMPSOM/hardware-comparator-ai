import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { FormState, ComparisonData } from './types';
import { fetchComparison } from './services/geminiService';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    gpu1: '',
    gpu2: '',
    isSingleMode: false,
    cpuModel: '',
    ramAmount: '',
    ramSpeed: '',
    ramBrand: '',
    targetGames: [],
    editingSoftware: [],
    targetResolution: '1440p',
    qualityPreset: 'High',
    exportPreset: '4K H.265'
  });

  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validate: need GPU1 always. Need GPU2 only if not in single mode.
    if (!formState.gpu1) return;
    if (!formState.isSingleMode && !formState.gpu2) return;

    setIsLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const cpuConfig = formState.cpuModel ? {
        model: formState.cpuModel,
        ramAmount: formState.ramAmount,
        ramSpeed: formState.ramSpeed,
        ramBrand: formState.ramBrand
      } : undefined;

      const preferences = {
        targetGames: formState.targetGames,
        editingSoftware: formState.editingSoftware,
        targetResolution: formState.targetResolution,
        qualityPreset: formState.qualityPreset,
        exportPreset: formState.exportPreset,
        isSingleMode: formState.isSingleMode
      };

      const data = await fetchComparison(formState.gpu1, formState.gpu2, cpuConfig, preferences);
      setComparisonData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center selection:bg-cyber-cyan selection:text-black">
      {/* Navbar / Header */}
      <header className="w-full border-b border-white/5 bg-cyber-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="relative">
              <Activity className="text-cyber-cyan w-6 h-6 group-hover:animate-pulse" />
              <div className="absolute inset-0 bg-cyber-cyan blur-lg opacity-20"></div>
            </div>
            <span className="font-mono font-bold text-xl tracking-tighter">
              FRAMERATE<span className="text-cyber-cyan">.AI</span>
            </span>
          </div>
          <div className="text-[10px] font-mono text-gray-500 hidden md:flex items-center gap-2 border border-white/10 px-3 py-1 rounded-full bg-black/40">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM STATUS: ONLINE
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl px-4 md:px-6 py-12 flex-grow relative z-10">
        
        {/* Intro Text */}
        {!comparisonData && !isLoading && (
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="inline-block relative">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2 relative z-10">
                HARDWARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-blue-500 to-purple-600">SUPREMACY</span>
              </h1>
              <div className="absolute -inset-4 bg-cyber-cyan/5 blur-3xl -z-10 rounded-full"></div>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Data-driven performance analysis for competitive gaming and high-end production workflows. 
              <span className="text-cyber-cyan font-mono text-sm ml-2 opacity-80">// NEUTRAL. PRECISE. ZERO BIAS.</span>
            </p>
          </div>
        )}

        <InputSection 
          formState={formState} 
          setFormState={setFormState} 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-950/30 border border-red-500/30 text-red-200 font-mono text-sm rounded-lg flex items-center justify-center backdrop-blur-sm">
            ERROR: {error}
          </div>
        )}

        {comparisonData && (
          <ResultsSection data={comparisonData} />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-auto bg-cyber-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-gray-600 text-[10px] font-mono tracking-widest uppercase">
             FRAMERATE.AI // POWERED BY GEMINI 2.0 // BENCHMARK ESTIMATES ONLY
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;