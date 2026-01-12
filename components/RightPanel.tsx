
import React from 'react';
import { PillarConfig } from '../types';

interface RightPanelProps {
  pillar: PillarConfig;
}

const RightPanel: React.FC<RightPanelProps> = ({ pillar }) => {
  return (
    <aside className="w-80 h-screen border-l border-slate-100 bg-white flex flex-col fixed right-0 top-0 z-10 overflow-y-auto p-8">
      <div className="mb-10">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-2">Recommended Sources</h4>
        <ul className="space-y-4">
          {pillar.sources.map(source => (
            <li key={source} className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors"></div>
              <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors font-medium">{source}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-2">Key Metrics to Watch</h4>
        <ul className="space-y-4">
          {pillar.metrics.map(metric => (
            <li key={metric} className="flex flex-col">
              <span className="text-sm text-slate-700 font-medium">{metric}</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Live Data Not Connected</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-10 border-t border-slate-50">
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg">💡</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Analyst Reminder</span>
          </div>
          <p className="text-sm text-amber-800 italic leading-relaxed serif">
            "{pillar.reminder}"
          </p>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
