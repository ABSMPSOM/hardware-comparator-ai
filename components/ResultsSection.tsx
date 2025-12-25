import React, { useMemo } from 'react';
import { ComparisonData } from '../types';
import { GamingChart, ProductivityChart } from './BenchmarkCharts';
import { Terminal, Crosshair, Film, Cpu, CheckCircle2, TrendingUp, Zap, DollarSign, BarChart3, Clock } from 'lucide-react';

interface ResultsSectionProps {
  data: ComparisonData;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ data }) => {
  
  // Calculate aggregate stats
  const stats = useMemo(() => {
    // If single mode, skip diff calculation
    if (!data.gpu2Name) {
      return { winner: data.gpu1Name, absAvg: 0, avgDiff: 0, isSingle: true };
    }

    let gpu1Wins = 0;
    let totalPercentDiff = 0;
    let count = 0;

    data.gamingBenchmarks.forEach(b => {
      if (b.gpu1Fps > 0 && b.gpu2Fps > 0) {
        const faster = Math.max(b.gpu1Fps, b.gpu2Fps);
        const slower = Math.min(b.gpu1Fps, b.gpu2Fps);
        const pct = ((faster - slower) / slower) * 100;
        
        if (b.gpu1Fps > b.gpu2Fps) {
          gpu1Wins++;
          totalPercentDiff += pct; // Add positive for GPU1
        } else {
          totalPercentDiff -= pct; // Subtract for GPU2 advantage
        }
        count++;
      }
    });

    const avgDiff = count > 0 ? totalPercentDiff / count : 0;
    const winner = avgDiff > 0 ? data.gpu1Name : data.gpu2Name;
    const absAvg = Math.abs(avgDiff).toFixed(1);

    return { winner, absAvg, avgDiff, isSingle: false };
  }, [data]);

  const maxEfficiency = Math.max(
    data.efficiency.gpu1FpsPerWatt, 
    data.efficiency.gpu2FpsPerWatt || 0
  );

  const formatRenderTime = (val: number, unit: string) => {
    if (unit === "Seconds" && val > 60) {
      const mins = Math.floor(val / 60);
      const secs = Math.round(val % 60);
      return `${mins}m ${secs}s`;
    }
    return `${val} ${unit}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Specs Header */}
      <div className={`grid grid-cols-1 ${data.specs.gpu2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
        {/* GPU 1 Spec Card */}
        <div className="glass-panel border-l-4 border-l-cyber-cyan p-8 relative overflow-hidden group rounded-r-lg">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <h1 className="text-8xl font-black text-white tracking-tighter">01</h1>
          </div>
          <h2 className="text-3xl font-bold text-white font-mono mb-2 tracking-tight">{data.gpu1Name}</h2>
          <div className="flex items-center gap-3 mb-6">
             <span className="px-2 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold rounded-sm">
               {data.specs.gpu1.price}
             </span>
             <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">EST. MARKET PRICE</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm font-mono text-gray-400 mt-4 border-t border-white/5 pt-4">
            <div>
              <span className="block text-gray-600 text-[10px] uppercase mb-1">VRAM</span>
              <span className="text-white font-bold">{data.specs.gpu1.vram}</span>
            </div>
             <div>
              <span className="block text-gray-600 text-[10px] uppercase mb-1">TDP</span>
              <span className="text-white font-bold">{data.specs.gpu1.tdp}</span>
            </div>
             <div>
              <span className="block text-gray-600 text-[10px] uppercase mb-1">RELEASE</span>
              <span className="text-white font-bold">{data.specs.gpu1.releaseYear}</span>
            </div>
          </div>
        </div>

        {/* GPU 2 Spec Card - Only show if GPU2 data exists */}
        {data.specs.gpu2 && data.gpu2Name && (
          <div className="glass-panel border-r-4 border-r-cyber-pink p-8 relative overflow-hidden text-right group rounded-l-lg">
             <div className="absolute top-0 left-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <h1 className="text-8xl font-black text-white tracking-tighter">02</h1>
            </div>
            <h2 className="text-3xl font-bold text-white font-mono mb-2 tracking-tight">{data.gpu2Name}</h2>
            <div className="flex items-center gap-3 mb-6 justify-end">
               <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">EST. MARKET PRICE</span>
               <span className="px-2 py-1 bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink text-xs font-mono font-bold rounded-sm">
                 {data.specs.gpu2.price}
               </span>
            </div>
             <div className="grid grid-cols-3 gap-4 text-sm font-mono text-gray-400 mt-4 border-t border-white/5 pt-4 direction-rtl">
              <div className="text-right">
                <span className="block text-gray-600 text-[10px] uppercase mb-1">VRAM</span>
                <span className="text-white font-bold">{data.specs.gpu2.vram}</span>
              </div>
               <div className="text-right">
                <span className="block text-gray-600 text-[10px] uppercase mb-1">TDP</span>
                <span className="text-white font-bold">{data.specs.gpu2.tdp}</span>
              </div>
               <div className="text-right">
                <span className="block text-gray-600 text-[10px] uppercase mb-1">RELEASE</span>
                <span className="text-white font-bold">{data.specs.gpu2.releaseYear}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Summary Banner */}
      {!stats.isSingle && stats.winner && (
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
           <div className="flex items-center gap-4">
             <div className={`p-3 rounded-full ${stats.avgDiff > 0 ? 'bg-cyber-cyan/10' : 'bg-cyber-pink/10'}`}>
                <TrendingUp className={`w-6 h-6 ${stats.avgDiff > 0 ? 'text-cyber-cyan' : 'text-cyber-pink'}`} />
             </div>
             <div>
               <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Average Performance Delta</h3>
               <p className="text-white font-bold font-mono text-xl">
                 <span className={stats.avgDiff > 0 ? 'text-cyber-cyan' : 'text-cyber-pink'}>{stats.winner}</span> is <span className="text-white">~{stats.absAvg}% faster</span> on average
               </p>
             </div>
           </div>
        </div>
      )}

      {/* Efficiency & Power Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-yellow-400 w-5 h-5" />
            <h3 className="font-mono text-lg text-white font-bold">Power Efficiency</h3>
          </div>
          
          <div className="space-y-6">
             {/* GPU 1 */}
             <div>
               <div className="flex justify-between text-xs font-mono mb-2">
                 <span className="text-cyber-cyan font-bold">{data.gpu1Name}</span>
                 <span className="text-white">{data.efficiency.gpu1FpsPerWatt.toFixed(2)} FPS/Watt</span>
               </div>
               <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                 <div 
                   className="bg-cyber-cyan h-full shadow-[0_0_10px_cyan]" 
                   style={{ width: maxEfficiency > 0 ? `${(data.efficiency.gpu1FpsPerWatt / maxEfficiency) * 100}%` : '0%' }}
                 ></div>
               </div>
             </div>

             {/* GPU 2 */}
             {data.gpu2Name && (
               <div>
                 <div className="flex justify-between text-xs font-mono mb-2">
                   <span className="text-cyber-pink font-bold">{data.gpu2Name}</span>
                   <span className="text-white">{data.efficiency.gpu2FpsPerWatt.toFixed(2)} FPS/Watt</span>
                 </div>
                 <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <div 
                     className="bg-cyber-pink h-full shadow-[0_0_10px_deeppink]" 
                     style={{ width: maxEfficiency > 0 ? `${(data.efficiency.gpu2FpsPerWatt / maxEfficiency) * 100}%` : '0%' }}
                   ></div>
                 </div>
               </div>
             )}

             <div className="mt-4 pt-4 border-t border-white/5">
               <p className="text-xs text-gray-400 font-mono leading-relaxed">
                 {data.efficiency.analysis}
               </p>
             </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-lg flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-3 mb-6">
               <BarChart3 className="text-green-500 w-5 h-5" />
               <h3 className="font-mono text-lg text-white font-bold">Value Proposition</h3>
             </div>
             <p className="text-sm text-gray-400 font-light mb-6 leading-relaxed">
               Comparison of typical board power (TDP) vs raw price. Analyzing total cost of ownership vs initial investment.
             </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-4 rounded-md border border-white/5 hover:border-cyber-cyan/30 transition-colors">
               <span className="block text-xs text-cyber-cyan font-mono truncate font-bold">{data.gpu1Name}</span>
               <div className="flex justify-between items-end mt-3">
                 <div>
                    <span className="text-[10px] text-gray-500 block mb-1">TDP</span>
                    <span className="text-white font-mono text-sm">{data.specs.gpu1.tdp}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] text-gray-500 block mb-1">PRICE</span>
                    <span className="text-green-400 font-mono text-sm font-bold">{data.specs.gpu1.price}</span>
                 </div>
               </div>
             </div>
             
             {data.specs.gpu2 && data.gpu2Name && (
               <div className="bg-white/5 p-4 rounded-md border border-white/5 hover:border-cyber-pink/30 transition-colors">
                 <span className="block text-xs text-cyber-pink font-mono truncate font-bold">{data.gpu2Name}</span>
                 <div className="flex justify-between items-end mt-3">
                   <div>
                      <span className="text-[10px] text-gray-500 block mb-1">TDP</span>
                      <span className="text-white font-mono text-sm">{data.specs.gpu2.tdp}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] text-gray-500 block mb-1">PRICE</span>
                      <span className="text-green-400 font-mono text-sm font-bold">{data.specs.gpu2.price}</span>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Gaming Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-lg border border-white/5">
           <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Crosshair className="text-cyber-cyan w-5 h-5" />
            <h3 className="font-mono text-lg text-white font-bold">Gaming Performance</h3>
          </div>
          <GamingChart data={data.gamingBenchmarks} gpu1Name={data.gpu1Name} gpu2Name={data.gpu2Name} />
        </div>
        <div className="bg-cyber-dark/80 backdrop-blur border border-white/5 p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <Terminal className="text-gray-500 w-5 h-5" />
             <h4 className="text-gray-400 font-mono text-xs uppercase tracking-widest">Analysis Log</h4>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-light">
            {data.gamingAnalysis}
          </p>
        </div>
      </div>

      {/* Productivity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-cyber-dark/80 backdrop-blur border border-white/5 p-6 rounded-lg flex flex-col order-2 lg:order-1">
           <div className="flex items-center gap-2 mb-4">
             <Film className="text-gray-500 w-5 h-5" />
             <h4 className="text-gray-400 font-mono text-xs uppercase tracking-widest">Workstation Log</h4>
           </div>
          <p className="text-sm text-gray-300 leading-relaxed font-light">
            {data.productivityAnalysis}
          </p>
        </div>
        <div className="lg:col-span-2 glass-panel p-6 rounded-lg border border-white/5 order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Cpu className="text-cyber-pink w-5 h-5" />
            <h3 className="font-mono text-lg text-white font-bold">Compute & Render Throughput</h3>
          </div>
          
          <ProductivityChart data={data.productivityBenchmarks} gpu1Name={data.gpu1Name} gpu2Name={data.gpu2Name} />
          
          {/* Render Times List for extra clarity */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data.productivityBenchmarks.map((bench, idx) => (
              bench.unit === "Seconds" && (
                <div key={idx} className="bg-white/5 p-4 rounded-md border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                     <Clock className="w-4 h-4 text-gray-500" />
                     <span className="text-xs text-gray-300 font-mono">{bench.workload}</span>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                     <div className="text-cyber-cyan font-mono text-xs font-bold bg-cyber-cyan/10 px-2 py-0.5 rounded-sm">
                        {data.gpu1Name}: {formatRenderTime(bench.gpu1Score, bench.unit)}
                     </div>
                     {data.gpu2Name && (
                        <div className="text-cyber-pink font-mono text-xs font-bold bg-cyber-pink/10 px-2 py-0.5 rounded-sm">
                           {data.gpu2Name}: {formatRenderTime(bench.gpu2Score, bench.unit)}
                        </div>
                     )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Verdict & CPU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 rounded-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
           <div className="flex items-center gap-3 mb-4 relative z-10">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_lime]"></div>
             <h3 className="font-mono text-sm text-green-500 uppercase tracking-widest font-bold">Final Verdict</h3>
           </div>
           <p className="text-white text-lg font-medium leading-relaxed relative z-10">
             {data.verdict}
           </p>
        </div>

        {data.specs.cpu ? (
          <div className="glass-panel p-8 rounded-lg border border-white/5">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-yellow-500 w-5 h-5" />
                 <h3 className="font-mono text-sm text-yellow-500 uppercase tracking-widest font-bold">CPU Pairing Context</h3>
               </div>
               <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded-sm">{data.specs.cpu.model}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono">
                <div className="bg-white/5 p-3 rounded border border-white/5">
                  <span className="text-gray-500 block mb-1">EST. PRICE</span>
                  <span className="text-green-400 font-bold">{data.specs.cpu.price}</span>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5">
                  <span className="text-gray-500 block mb-1">TDP</span>
                  <span className="text-white font-bold">{data.specs.cpu.tdp}</span>
                </div>
             </div>

             <p className="text-gray-300 text-sm leading-relaxed">
               {data.cpuBottleneckAnalysis}
             </p>
          </div>
        ) : (
           data.cpuBottleneckAnalysis && (
            <div className="glass-panel p-8 rounded-lg border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-yellow-500 w-5 h-5" />
                <h3 className="font-mono text-sm text-yellow-500 uppercase tracking-widest font-bold">Bottleneck Analysis</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {data.cpuBottleneckAnalysis}
              </p>
            </div>
           )
        )}
      </div>

    </div>
  );
};

export default ResultsSection;