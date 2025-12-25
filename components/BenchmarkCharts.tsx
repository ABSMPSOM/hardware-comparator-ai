import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { GamingBenchmark, ProductivityBenchmark } from '../types';

interface GamingChartProps {
  data: GamingBenchmark[];
  gpu1Name: string;
  gpu2Name?: string;
}

interface ProductivityChartProps {
  data: ProductivityBenchmark[];
  gpu1Name: string;
  gpu2Name?: string;
}

const CustomTooltip = ({ active, payload, label, gpu1Name, gpu2Name }: any) => {
  if (active && payload && payload.length > 0) {
    const resolution = payload[0]?.payload?.resolution || '';
    const val1 = payload[0]?.value || 0;
    // Check if second payload exists for GPU2
    const val2 = payload.length > 1 ? payload[1].value : 0;
    const hasGpu2 = !!gpu2Name && payload.length > 1;

    let diffText = null;
    if (hasGpu2) {
      const diff = val1 - val2;
      const betterVal = Math.max(val1, val2);
      const worseVal = Math.min(val1, val2);
      const percentFaster = worseVal > 0 ? ((betterVal - worseVal) / worseVal) * 100 : 0;
      const winnerName = val1 > val2 ? gpu1Name : gpu2Name;
      const winnerColor = val1 > val2 ? '#00f0ff' : '#ff003c';
      
      diffText = (
        <div className="mt-3 pt-2 border-t border-gray-700">
           <p className="text-[10px] text-gray-500 font-mono uppercase">Difference</p>
           <p style={{ color: winnerColor }} className="font-mono text-xs font-bold">
             {winnerName} is +{percentFaster.toFixed(1)}% faster
           </p>
        </div>
      );
    }

    return (
      <div className="bg-cyber-dark border border-gray-700 p-4 shadow-xl rounded-sm z-50 min-w-[200px]">
        <p className="text-gray-200 font-mono text-sm mb-1 font-bold border-b border-gray-700 pb-2 mb-2">{label}</p>
        {resolution && <p className="text-gray-500 font-mono text-[10px] mb-2 uppercase tracking-widest">@{resolution}</p>}
        
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center mb-1">
             <span style={{ color: entry.color }} className="font-mono text-xs mr-4">{entry.name}</span>
             <span className="text-white font-mono text-xs font-bold">{entry.value}</span>
          </div>
        ))}

        {diffText}
      </div>
    );
  }
  return null;
};

export const GamingChart: React.FC<GamingChartProps> = ({ data, gpu1Name, gpu2Name }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="gameName" 
            stroke="#94a3b8" 
            tick={{ fontFamily: 'monospace', fontSize: 9 }} 
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fontFamily: 'monospace', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'AVG FPS', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip 
            content={(props) => <CustomTooltip {...props} gpu1Name={gpu1Name} gpu2Name={gpu2Name} />} 
            cursor={{fill: 'rgba(255,255,255,0.05)'}} 
          />
          <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', paddingTop: '10px' }} />
          <Bar name={gpu1Name} dataKey="gpu1Fps" fill="#00f0ff" radius={[2, 2, 0, 0]} />
          {gpu2Name && <Bar name={gpu2Name} dataKey="gpu2Fps" fill="#ff003c" radius={[2, 2, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data, gpu1Name, gpu2Name }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" hide />
          <YAxis 
            dataKey="workload" 
            type="category" 
            stroke="#94a3b8" 
            tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#cbd5e1' }}
            width={100}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={(props) => <CustomTooltip {...props} gpu1Name={gpu1Name} gpu2Name={gpu2Name} />}
            cursor={{fill: 'rgba(255,255,255,0.05)'}} 
          />
          <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', paddingTop: '10px' }} />
          <Bar name={gpu1Name} dataKey="gpu1Score" fill="#00f0ff" radius={[0, 2, 2, 0]} barSize={20} />
          {gpu2Name && <Bar name={gpu2Name} dataKey="gpu2Score" fill="#ff003c" radius={[0, 2, 2, 0]} barSize={20} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};