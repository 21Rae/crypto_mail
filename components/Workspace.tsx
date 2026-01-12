
import React, { useState, useEffect } from 'react';
import { ContentPillarId, PillarConfig, SavedInsight } from '../types';
import { PILLARS, SOURCES } from '../constants';
import { synthesizeNarrative, generateAutomatedInsight } from '../services/gemini';

interface WorkspaceProps {
  pillar: PillarConfig;
  onSave: (insight: SavedInsight) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ pillar, onSave }) => {
  const [source, setSource] = useState(SOURCES[0]);
  const [signal, setSignal] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [narrative, setNarrative] = useState('');
  const [outputTypes, setOutputTypes] = useState<string[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [intelSources, setIntelSources] = useState<{ uri: string; title: string }[]>([]);

  // Clear workspace when pillar changes
  useEffect(() => {
    setSignal('');
    setAnswers({});
    setNarrative('');
    setOutputTypes([]);
    setIntelSources([]);
  }, [pillar.id]);

  const handleAnswerChange = (q: string, value: string) => {
    setAnswers(prev => ({ ...prev, [q]: value }));
  };

  const handleToggleOutput = (type: string) => {
    setOutputTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleAutomate = async () => {
    setIsAutomating(true);
    try {
      const result = await generateAutomatedInsight(pillar.name, source, pillar.questions);
      setSignal(result.signal);
      setNarrative(result.narrative);
      setIntelSources(result.sources);
      
      const newAnswers: Record<string, string> = {};
      pillar.questions.forEach((q, i) => {
        newAnswers[q] = result.reflections[i] || "";
      });
      setAnswers(newAnswers);
    } catch (error) {
      alert("Intelligence fetch failed. Please check your connection or API key.");
    } finally {
      setIsAutomating(false);
    }
  };

  const handleAISynthesis = async () => {
    if (!signal) return;
    setIsSynthesizing(true);
    const result = await synthesizeNarrative(signal, Object.values(answers));
    setNarrative(result);
    setIsSynthesizing(false);
  };

  const handleSave = () => {
    const newInsight: SavedInsight = {
      id: crypto.randomUUID(),
      pillarId: pillar.id,
      date: new Date().toISOString(),
      source,
      signal,
      journalAnswers: answers,
      narrative,
      outputTypes,
    };
    onSave(newInsight);
    // Reset form
    setSignal('');
    setAnswers({});
    setNarrative('');
    setOutputTypes([]);
    setIntelSources([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 pb-24">
      <header className="mb-10 border-b border-slate-100 pb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">{pillar.icon}</span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 serif italic">{pillar.name}</h2>
          </div>
          <p className="text-slate-500 font-light leading-relaxed text-base">
            Reflect on market signals and structural shifts.
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target Source:</span>
            <select 
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="text-[10px] bg-slate-50 border border-slate-100 rounded px-2 py-1 outline-none text-slate-900 font-bold uppercase tracking-wider"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={handleAutomate}
            disabled={isAutomating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all ${
              isAutomating ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            <span>{isAutomating ? 'Searching Markets...' : '✨ Fetch & Auto-Generate'}</span>
          </button>
        </div>
      </header>

      <div className="space-y-12">
        {/* Block 1: Signal Input */}
        <section className="overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">01. Market Signal</h3>
          </div>
          <textarea
            value={signal}
            onChange={(e) => setSignal(e.target.value)}
            placeholder="AI will populate this or you can type manually..."
            className="w-full h-32 p-6 bg-slate-900 border-none rounded-2xl text-white placeholder-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all serif leading-relaxed text-lg font-medium shadow-inner resize-none"
          />
        </section>

        {/* Block 2: Guided Journaling */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">02. Reflection</h3>
          <div className="grid grid-cols-1 gap-6">
            {pillar.questions.map((q, idx) => (
              <div key={idx} className="space-y-2">
                <label className="block text-slate-800 font-semibold italic serif text-base">{q}</label>
                <textarea
                  value={answers[q] || ''}
                  onChange={(e) => handleAnswerChange(q, e.target.value)}
                  placeholder="Record insights here..."
                  className="w-full h-20 p-4 bg-slate-800 border-none rounded-xl text-white placeholder-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all leading-relaxed text-base font-medium shadow-inner resize-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Block 3: Narrative Analysis */}
        <section className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">03. Narrative Interpretation</h3>
            <button
              onClick={handleAISynthesis}
              disabled={isSynthesizing || !signal}
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center space-x-2 ${isSynthesizing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{isSynthesizing ? 'Updating...' : 'Refine Summary'}</span>
            </button>
          </div>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="A deep dive into the 'why' behind the market behavior..."
            className="w-full h-44 p-6 bg-slate-900 border-none rounded-2xl text-white placeholder-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all serif leading-relaxed text-lg font-medium shadow-inner resize-none"
          />
        </section>

        {/* Grounding Sources */}
        {intelSources.length > 0 && (
          <section className="pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-50 pb-2">Intelligence Sources Found</h3>
            <div className="flex flex-wrap gap-2">
              {intelSources.map((s, i) => (
                <a 
                  key={i} 
                  href={s.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 transition-all"
                >
                  🔗 {s.title.length > 30 ? s.title.substring(0, 30) + '...' : s.title}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Block 4: Output Selector */}
        <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">04. Utilization</h3>
          <div className="flex flex-wrap gap-6 mb-8">
            {['Newsletter', 'Blog Post', 'Journal Archive', 'Email Campaign'].map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={outputTypes.includes(type)}
                  onChange={() => handleToggleOutput(type)}
                  className="w-5 h-5 rounded border-slate-200 text-slate-900 focus:ring-slate-900 transition-all cursor-pointer"
                />
                <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${outputTypes.includes(type) ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {type}
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={!signal || !narrative}
            className={`w-full py-4 rounded-xl text-white font-bold tracking-[0.2em] uppercase text-xs transition-all shadow-lg shadow-slate-200 ${
              !signal || !narrative 
                ? 'bg-slate-200 cursor-not-allowed shadow-none text-slate-400' 
                : 'bg-slate-900 hover:bg-black hover:shadow-2xl active:scale-[0.98]'
            }`}
          >
            Archive Intelligence
          </button>
        </section>
      </div>
    </div>
  );
};

export default Workspace;
