import React, { useState, useRef } from 'react';
import { Cpu, MonitorPlay, Zap, ArrowRightLeft, Database, ChevronDown, ChevronUp, Plus, Gamepad2, Trash2, Search, FileText, UploadCloud, Loader2, Clapperboard, X, ToggleLeft, ToggleRight, MemoryStick, Film } from 'lucide-react';
import { FormState } from '../types';
import { ALL_GPUS, ALL_CPUS } from './hardwareData';
import { extractSpecsFromPdf } from '../services/geminiService';

interface InputSectionProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const POPULAR_GAMES = [
  "Cyberpunk 2077", "Alan Wake 2", "Starfield", "Call of Duty: MW3", 
  "Avatar: Frontiers", "Hogwarts Legacy", "Elden Ring", "The Witcher 3",
  "Red Dead Redemption 2", "Fortnite", "F1 23", "Baldur's Gate 3",
  "Counter-Strike 2", "Valorant", "Apex Legends", "Overwatch 2"
];

const POPULAR_SOFTWARE = [
  "Adobe Premiere Pro", "DaVinci Resolve", "Blender", "After Effects",
  "Cinema 4D", "V-Ray", "Unreal Engine 5", "Handbrake", "Photoshop", "Unity"
];

const EXPORT_PRESETS = [
  "1080p H.264", "4K H.265", "4K ProRes", "8K RAW"
];

const InputSection: React.FC<InputSectionProps> = ({ formState, setFormState, onSubmit, isLoading }) => {
  const [showGpuList, setShowGpuList] = useState(false);
  const [showCpuList, setShowCpuList] = useState(false);
  const [showGameList, setShowGameList] = useState(false);
  const [showSoftwareList, setShowSoftwareList] = useState(false);
  
  const [gpuSearch, setGpuSearch] = useState("");
  const [cpuSearch, setCpuSearch] = useState("");
  const [gameInput, setGameInput] = useState("");
  const [softwareInput, setSoftwareInput] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const toggleSingleMode = () => {
    setFormState(prev => ({ 
      ...prev, 
      isSingleMode: !prev.isSingleMode,
      gpu2: !prev.isSingleMode ? "" : prev.gpu2 
    }));
  };

  const handleResolutionChange = (res: string) => {
    setFormState(prev => ({ ...prev, targetResolution: res }));
  };
  
  const handleQualityChange = (quality: string) => {
    setFormState(prev => ({ ...prev, qualityPreset: quality }));
  };

  const handleExportChange = (preset: string) => {
    setFormState(prev => ({ ...prev, exportPreset: preset }));
  };

  const handleClear = () => {
    setFormState({
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
    setGpuSearch("");
    setCpuSearch("");
    setGameInput("");
    setSoftwareInput("");
  };

  const handleGpuSelect = (gpuName: string) => {
    setFormState(prev => {
      if (!prev.gpu1) return { ...prev, gpu1: gpuName };
      if (!prev.isSingleMode && !prev.gpu2) return { ...prev, gpu2: gpuName };
      if (prev.isSingleMode) return { ...prev, gpu1: gpuName };
      return { ...prev, gpu2: gpuName };
    });
  };

  const handleCpuSelect = (cpuName: string) => {
    setFormState(prev => ({ ...prev, cpuModel: cpuName }));
  };

  const addGame = (game: string) => {
    if (game && !formState.targetGames.includes(game)) {
      setFormState(prev => ({ ...prev, targetGames: [...prev.targetGames, game] }));
    }
    setGameInput("");
  };

  const removeGame = (game: string) => {
    setFormState(prev => ({ ...prev, targetGames: prev.targetGames.filter(g => g !== game) }));
  };

  const addSoftware = (sw: string) => {
    if (sw && !formState.editingSoftware.includes(sw)) {
      setFormState(prev => ({ ...prev, editingSoftware: [...prev.editingSoftware, sw] }));
    }
    setSoftwareInput("");
  };

  const removeSoftware = (sw: string) => {
    setFormState(prev => ({ ...prev, editingSoftware: prev.editingSoftware.filter(s => s !== sw) }));
  };

  const filterItems = (items: string[], query: string) => {
    return items.filter(i => i.toLowerCase().includes(query.toLowerCase()));
  };
  
  const renderCpuItem = (cpuString: string) => {
    const match = cpuString.match(/^(.*?)\s*(\(.*\))$/);
    if (match) {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="font-mono font-bold text-gray-200">{match[1]}</span>
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">{match[2].replace(/[()]/g, '')}</span>
        </div>
      );
    }
    return <span className="font-mono text-gray-200">{cpuString}</span>;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const extractedSpecs = await extractSpecsFromPdf(base64String);
          setFormState(prev => ({
            ...prev,
            gpu1: extractedSpecs.gpu1 || prev.gpu1,
            cpuModel: extractedSpecs.cpuModel || prev.cpuModel,
            ramAmount: extractedSpecs.ramAmount || prev.ramAmount,
            ramSpeed: extractedSpecs.ramSpeed || prev.ramSpeed,
            ramBrand: extractedSpecs.ramBrand || prev.ramBrand,
          }));
        } catch (error) {
          console.error("Parsing failed", error);
          alert("Could not extract specs from this PDF.");
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 animate-fade-in-up space-y-8">
      
      {/* Header Actions */}
      <div className="flex justify-between items-end">
         <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-white/5">
           <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full"></div>
           CONFIGURE HARDWARE & PARAMETERS
         </div>
         <button 
           onClick={handleClear}
           className="text-gray-500 hover:text-red-400 text-xs font-mono flex items-center gap-2 transition-colors uppercase px-3 py-1 hover:bg-red-950/20 rounded-sm"
         >
           <Trash2 className="w-3 h-3" /> Reset
         </button>
      </div>

      {/* Auto-Fill Section */}
      <div className="glass-panel p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-bold tracking-wide">Have a Spec Sheet?</h3>
            <p className="text-gray-400 text-xs font-mono mt-1">Upload a PDF invoice or spec sheet to auto-fill.</p>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="application/pdf"
          onChange={handleFileUpload}
        />
        <button 
          onClick={triggerFileUpload}
          disabled={isUploading}
          className="relative z-10 flex items-center gap-2 px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider transition-all rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><UploadCloud className="w-4 h-4" /> Upload PDF</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* GPU Section */}
        <div className="glass-panel p-6 rounded-lg border border-white/5 relative group hover:border-cyber-cyan/30 transition-colors">
          <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="text-white font-bold text-lg tracking-tight">GPU Selection</h3>
               <p className="text-xs text-gray-500 font-mono mt-1">Select Graphics Processing Units</p>
             </div>
             <button 
                onClick={toggleSingleMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase border transition-all ${formState.isSingleMode ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan' : 'bg-white/5 border-white/10 text-gray-400'}`}
              >
                <span>{formState.isSingleMode ? "Single Mode" : "Comparison"}</span>
                {formState.isSingleMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-cyber-cyan text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Primary GPU</label>
              <div className="relative group/input">
                <MonitorPlay className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within/input:text-cyber-cyan transition-colors" />
                <input
                  type="text"
                  name="gpu1"
                  value={formState.gpu1}
                  onChange={handleChange}
                  placeholder="e.g. RTX 4070"
                  className="w-full glass-input text-white text-sm p-3 pl-10 rounded-md focus:outline-none font-mono placeholder-gray-600"
                />
              </div>
            </div>
            
            {!formState.isSingleMode && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#15161e] px-2 text-[10px] text-gray-600 font-mono uppercase">VS</span>
                </div>
              </div>
            )}

            {!formState.isSingleMode && (
              <div>
                <label className="block text-cyber-pink text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Challenger GPU</label>
                <div className="relative group/input">
                  <ArrowRightLeft className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within/input:text-cyber-pink transition-colors" />
                  <input
                    type="text"
                    name="gpu2"
                    value={formState.gpu2}
                    onChange={handleChange}
                    placeholder="e.g. RX 7800 XT"
                    className="w-full glass-input text-white text-sm p-3 pl-10 rounded-md focus:outline-none focus:border-cyber-pink/50 focus:shadow-[0_0_15px_rgba(255,0,60,0.1)] font-mono placeholder-gray-600"
                  />
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setShowGpuList(!showGpuList)}
              className="w-full py-2.5 text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-all rounded-md"
            >
              <Database className="w-3 h-3" />
              {showGpuList ? "Hide Database" : "Browse Database"}
              {showGpuList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* GPU Selection List */}
            {showGpuList && (
              <div className="mt-2 p-2 bg-black/60 border border-white/10 rounded-md max-h-[300px] overflow-y-auto backdrop-blur-xl">
                <div className="sticky top-0 bg-[#0f1016]/90 p-2 border-b border-white/10 mb-2 z-10 backdrop-blur-md">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 w-3 h-3 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Search GPU..." 
                      value={gpuSearch}
                      onChange={(e) => setGpuSearch(e.target.value)}
                      className="w-full bg-white/5 text-white text-xs p-2 pl-8 border border-white/10 rounded-sm focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 p-1">
                  {['nvidia', 'amd', 'intel'].map((brand) => {
                     const items = filterItems(ALL_GPUS[brand as keyof typeof ALL_GPUS], gpuSearch);
                     if (items.length === 0) return null;
                     const color = brand === 'nvidia' ? 'text-green-500' : brand === 'amd' ? 'text-red-500' : 'text-blue-500';
                     const borderHover = brand === 'nvidia' ? 'hover:border-green-500/50' : brand === 'amd' ? 'hover:border-red-500/50' : 'hover:border-blue-500/50';
                     
                     return (
                        <div key={brand}>
                          <h4 className={`${color} font-mono text-[10px] uppercase mb-1 font-bold pl-1`}>{brand}</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {items.map(gpu => (
                              <button key={gpu} onClick={() => handleGpuSelect(gpu)} className={`px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono border border-transparent ${borderHover} transition-all rounded-sm text-left truncate`}>{gpu}</button>
                            ))}
                          </div>
                        </div>
                     )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CPU Section */}
        <div className="glass-panel p-6 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
          <div className="mb-6">
             <h3 className="text-white font-bold text-lg tracking-tight">System Context</h3>
             <p className="text-xs text-gray-500 font-mono mt-1">CPU & Memory Configuration</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Processor</label>
              <div className="relative group/input">
                <Cpu className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within/input:text-white transition-colors" />
                <input
                  type="text"
                  name="cpuModel"
                  value={formState.cpuModel}
                  onChange={handleChange}
                  placeholder="e.g. Ryzen 7 7800X3D"
                  className="w-full glass-input text-white text-sm p-3 pl-10 rounded-md focus:outline-none font-mono placeholder-gray-600"
                />
              </div>
               
              <button 
                onClick={() => setShowCpuList(!showCpuList)}
                className="w-full mt-2 py-1.5 text-[10px] font-mono bg-transparent text-gray-500 hover:text-white flex items-center justify-end gap-1 transition-colors"
              >
                {showCpuList ? "Close List" : "Select CPU"}
                {showCpuList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* CPU Selection List */}
              {showCpuList && (
                <div className="mt-2 p-2 bg-black/60 border border-white/10 rounded-md max-h-[300px] overflow-y-auto backdrop-blur-xl absolute z-20 w-[90%] md:w-[40%] shadow-2xl">
                   <div className="sticky top-0 bg-[#0f1016]/90 p-2 border-b border-white/10 mb-2 z-10 backdrop-blur-md">
                    <input 
                      type="text" 
                      placeholder="Search CPU..." 
                      value={cpuSearch}
                      onChange={(e) => setCpuSearch(e.target.value)}
                      className="w-full bg-white/5 text-white text-xs p-2 border border-white/10 rounded-sm focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-4 p-1">
                    {['amd', 'intel'].map((brand) => {
                       const items = filterItems(ALL_CPUS[brand as keyof typeof ALL_CPUS], cpuSearch);
                       if (items.length === 0) return null;
                       const color = brand === 'amd' ? 'text-red-500' : 'text-blue-500';
                       
                       return (
                          <div key={brand}>
                            <h4 className={`${color} font-mono text-[10px] uppercase mb-1 font-bold pl-1`}>{brand}</h4>
                            <div className="grid grid-cols-1 gap-1">
                              {items.map(cpu => (
                                <button key={cpu} onClick={() => {handleCpuSelect(cpu); setShowCpuList(false);}} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all rounded-sm text-left text-[10px]">
                                  {renderCpuItem(cpu)}
                                </button>
                              ))}
                            </div>
                          </div>
                       )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">RAM Size</label>
                <input
                  type="text"
                  name="ramAmount"
                  value={formState.ramAmount}
                  onChange={handleChange}
                  placeholder="32GB"
                  className="w-full glass-input text-gray-300 text-sm p-3 rounded-md focus:outline-none font-mono placeholder-gray-600"
                />
              </div>
               <div>
                <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Frequency</label>
                <input
                  type="text"
                  name="ramSpeed"
                  value={formState.ramSpeed}
                  onChange={handleChange}
                  placeholder="6000MHz"
                  className="w-full glass-input text-gray-300 text-sm p-3 rounded-md focus:outline-none font-mono placeholder-gray-600"
                />
              </div>
            </div>
            
            {/* RAM Brand (Optional) */}
            <div>
               <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Brand (Optional)</label>
               <div className="relative group/input">
                 <MemoryStick className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 group-focus-within/input:text-white transition-colors" />
                 <input
                   type="text"
                   name="ramBrand"
                   value={formState.ramBrand || ''}
                   onChange={handleChange}
                   placeholder="e.g. Corsair Dominator"
                   className="w-full glass-input text-gray-300 text-sm p-3 pl-10 rounded-md focus:outline-none font-mono placeholder-gray-600"
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benchmark Parameters Section */}
      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <div className="mb-6 border-b border-white/5 pb-4">
          <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Performance Targets
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Gaming Column */}
           <div className="space-y-6">
              <h4 className="text-cyber-cyan font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                 <Gamepad2 className="w-4 h-4" /> Gaming Parameters
              </h4>
              
              {/* GAMES MULTI-SELECT */}
              <div>
                <div className="relative flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={gameInput}
                      onChange={(e) => setGameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addGame(gameInput)}
                      placeholder="Add specific game..."
                      className="w-full glass-input text-gray-300 text-sm p-2.5 rounded-md focus:outline-none font-mono placeholder-gray-600"
                    />
                  </div>
                  <button onClick={() => addGame(gameInput)} className="px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-md font-mono font-bold transition-all">+</button>
                </div>
                
                {/* Selected Game Tags */}
                <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                  {formState.targetGames.map(game => (
                    <span key={game} className="flex items-center gap-1 text-[10px] font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 px-2 py-1 rounded-sm animate-fade-in">
                      {game}
                      <button onClick={() => removeGame(game)} className="hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {formState.targetGames.length === 0 && <span className="text-[10px] text-gray-600 font-mono italic">No specific games added (Using generic AAA suite)</span>}
                </div>

                <div className="mt-3">
                   <div className="text-[10px] text-gray-500 font-mono mb-2">Quick Add Popular Titles:</div>
                   <div className="flex flex-wrap gap-1.5">
                      {POPULAR_GAMES.slice(0, 8).map(game => (
                        <button key={game} onClick={() => addGame(game)} className="px-2 py-1 bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-mono border border-white/5 hover:border-white/20 transition-all rounded-sm">{game}</button>
                      ))}
                    </div>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Resolution</label>
                   <div className="flex flex-col gap-1.5">
                     {['1080p', '1440p', '4K'].map((res) => (
                       <button
                         key={res}
                         onClick={() => handleResolutionChange(res)}
                         className={`w-full py-1.5 px-3 text-[10px] font-mono border transition-all rounded-sm uppercase tracking-widest text-left flex justify-between items-center group ${
                           formState.targetResolution === res 
                            ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan' 
                            : 'bg-black/20 border-white/5 text-gray-500 hover:text-gray-300'
                         }`}
                       >
                         {res}
                         {formState.targetResolution === res && <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full shadow-[0_0_5px_cyan]"></div>}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Preset</label>
                   <div className="flex flex-col gap-1.5">
                     {['Medium', 'High', 'Ultra'].map((q) => (
                       <button
                         key={q}
                         onClick={() => handleQualityChange(q)}
                         className={`w-full py-1.5 px-3 text-[10px] font-mono border transition-all rounded-sm uppercase tracking-widest text-left flex justify-between items-center ${
                           formState.qualityPreset === q 
                            ? 'bg-purple-500/10 border-purple-500 text-purple-400' 
                            : 'bg-black/20 border-white/5 text-gray-500 hover:text-gray-300'
                         }`}
                       >
                         {q}
                         {formState.qualityPreset === q && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_5px_purple]"></div>}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
           </div>
           
           {/* Workstation Column */}
           <div className="space-y-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block -ml-4"></div>
              
              <h4 className="text-cyber-pink font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                 <Clapperboard className="w-4 h-4" /> Creator Workflow
              </h4>
              
              {/* SOFTWARE MULTI-SELECT */}
              <div>
                 <div className="relative flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={softwareInput}
                      onChange={(e) => setSoftwareInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSoftware(softwareInput)}
                      placeholder="Add software (e.g. Premiere)..."
                      className="w-full glass-input text-gray-300 text-sm p-2.5 rounded-md focus:outline-none font-mono placeholder-gray-600"
                    />
                  </div>
                  <button onClick={() => addSoftware(softwareInput)} className="px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-md font-mono font-bold transition-all">+</button>
                </div>

                {/* Selected Software Tags */}
                <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                  {formState.editingSoftware.map(sw => (
                    <span key={sw} className="flex items-center gap-1 text-[10px] font-mono bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/30 px-2 py-1 rounded-sm animate-fade-in">
                      {sw}
                      <button onClick={() => removeSoftware(sw)} className="hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {formState.editingSoftware.length === 0 && <span className="text-[10px] text-gray-600 font-mono italic">No specific software added</span>}
                </div>
                
                 <div className="mt-3">
                   <div className="text-[10px] text-gray-500 font-mono mb-2">Quick Add:</div>
                   <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SOFTWARE.slice(0, 6).map(sw => (
                        <button key={sw} onClick={() => addSoftware(sw)} className="px-2 py-1 bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-mono border border-white/5 hover:border-white/20 transition-all rounded-sm">{sw}</button>
                      ))}
                    </div>
                </div>
              </div>

              {/* Render Target Toggles */}
              <div>
                 <label className="block text-gray-500 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Render Export Target</label>
                 <div className="grid grid-cols-2 gap-2">
                   {EXPORT_PRESETS.map((preset) => (
                     <button
                       key={preset}
                       onClick={() => handleExportChange(preset)}
                       className={`py-2 px-3 text-[10px] font-mono border transition-all rounded-sm uppercase tracking-wide text-center hover:bg-white/5 ${
                         formState.exportPreset === preset
                          ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                          : 'bg-black/20 border-white/5 text-gray-500'
                       }`}
                     >
                       {preset}
                     </button>
                   ))}
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading || !formState.gpu1 || (!formState.isSingleMode && !formState.gpu2)}
          className={`
            relative px-12 py-5 bg-cyber-black border text-white font-mono font-bold tracking-[0.2em] uppercase text-sm
            transition-all duration-300 group overflow-hidden rounded-sm
            ${isLoading ? 'opacity-50 cursor-not-allowed border-gray-700' : 'hover:bg-cyber-cyan/5 border-cyber-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          {isLoading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-cyber-cyan" /> 
              <span>PROCESSING NEURAL NET...</span>
            </span>
          ) : (
             <span className="flex items-center gap-3 text-cyber-cyan group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" /> 
              {formState.isSingleMode ? "ANALYZE SPECS" : "INITIATE COMPARISON"}
            </span>
          )}
          
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan"></div>
        </button>
      </div>
    </div>
  );
};

export default InputSection;