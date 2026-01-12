
import React from 'react';
import { ContentPillarId } from '../types';
import { PILLARS } from '../constants';

interface SidebarProps {
  activePillar: ContentPillarId;
  onPillarChange: (id: ContentPillarId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePillar, onPillarChange }) => {
  return (
    <aside className="w-72 h-screen border-r border-slate-100 bg-white flex flex-col fixed left-0 top-0 z-10">
      <div className="p-8 pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 mb-1">Intelligence</h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Crypto Workspace</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-slate-400 px-4 mb-2 uppercase tracking-wider">Analysis Pillars</div>
        {PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => onPillarChange(pillar.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              activePillar === pillar.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-lg">{pillar.icon}</span>
            <span className="font-medium">{pillar.name}</span>
          </button>
        ))}

        <div className="pt-8 text-xs font-semibold text-slate-400 px-4 mb-2 uppercase tracking-wider">Output</div>
        <button
          onClick={() => onPillarChange(ContentPillarId.NEWSLETTER)}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
            activePillar === ContentPillarId.NEWSLETTER
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="text-lg">📧</span>
          <span className="font-medium">Newsletter & Email</span>
        </button>
      </nav>

      <div className="p-6 border-t border-slate-50">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Workspace Mode</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-600">Deep Work Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
