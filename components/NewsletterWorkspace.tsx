
import React, { useState } from 'react';
import { SavedInsight, NewsletterDraft } from '../types';
import { NEWSLETTER_TYPES, EXAMPLE_HOOKS, SOURCES } from '../constants';
import { draftNewsletter, generateAutomatedNewsletter } from '../services/gemini';

interface NewsletterWorkspaceProps {
  savedInsights: SavedInsight[];
  onDraftSave: (draft: NewsletterDraft) => void;
}

const NewsletterWorkspace: React.FC<NewsletterWorkspaceProps> = ({ savedInsights, onDraftSave }) => {
  const [selectedType, setSelectedType] = useState(NEWSLETTER_TYPES[0]);
  const [targetSource, setTargetSource] = useState(SOURCES[0]);
  const [selectedInsightIds, setSelectedInsightIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [intelSources, setIntelSources] = useState<{ uri: string; title: string }[]>([]);

  const toggleInsight = (id: string) => {
    setSelectedInsightIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAutomateFull = async () => {
    setIsAutomating(true);
    try {
      const result = await generateAutomatedNewsletter(selectedType, targetSource);
      setTitle(result.title);
      setDraftContent(result.content);
      setIntelSources(result.sources);
    } catch (error) {
      alert("Failed to auto-generate newsletter. Check API key or connection.");
    } finally {
      setIsAutomating(false);
    }
  };

  const handleAIDraftFromInsights = async () => {
    const selected = savedInsights.filter(i => selectedInsightIds.includes(i.id));
    if (selected.length === 0) return;
    setIsGenerating(true);
    const result = await draftNewsletter(selected);
    setDraftContent(result);
    setIntelSources([]);
    setIsGenerating(false);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const filteredInsights = savedInsights.filter(i => i.outputTypes.includes('Newsletter'));

  return (
    <div className="max-w-5xl mx-auto px-12 py-16 pb-40">
      <header className="mb-16 flex items-start justify-between">
        <div>
          <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 rounded-sm">
            Intelligence Engine
          </div>
          <h2 className="text-5xl font-semibold tracking-tight text-slate-900 serif italic mb-6 leading-tight">
            Compose your next <br/>market thesis.
          </h2>
          <p className="text-xl text-slate-500 font-light max-w-xl leading-relaxed serif">
            Fetch real-time market news or synthesize your curated signals into a high-signal narrative.
          </p>
        </div>

        <div className="flex flex-col items-end space-y-4 pt-4">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Search Source:</span>
            <select 
              value={targetSource}
              onChange={(e) => setTargetSource(e.target.value)}
              className="text-[10px] bg-slate-50 border border-slate-100 rounded px-3 py-2 outline-none text-slate-900 font-bold uppercase tracking-wider shadow-sm"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={handleAutomateFull}
            disabled={isAutomating}
            className={`flex items-center space-x-3 px-8 py-4 rounded-full text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all active:scale-[0.98] ${
              isAutomating ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            <span>{isAutomating ? 'Researching Markets...' : '✨ Fetch & Auto-Generate Edition'}</span>
          </button>
        </div>
      </header>

      <div className="space-y-24">
        {/* Section 1: Type Selector */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-100 pb-3">
            01. Choose Campaign Focus
          </h3>
          <div className="flex flex-wrap gap-3">
            {NEWSLETTER_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedType === type 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 ring-4 ring-slate-100' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Insights Selection */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              02. Or Synthesize Curated Intelligence
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {selectedInsightIds.length} Signals Selected
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInsights.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-xs italic serif">No signals have been tagged for 'Newsletter' utilization yet. <br/> Use the Auto-Generate button above for a fresh start.</p>
              </div>
            ) : (
              filteredInsights.map(insight => (
                <div 
                  key={insight.id}
                  onClick={() => toggleInsight(insight.id)}
                  className={`relative p-8 rounded-3xl border transition-all duration-500 cursor-pointer group ${
                    selectedInsightIds.includes(insight.id)
                      ? 'border-slate-900 bg-white shadow-2xl shadow-slate-200 -translate-y-1'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-widest rounded-sm mb-2">
                        {insight.pillarId.replace('_', ' ')}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {new Date(insight.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedInsightIds.includes(insight.id) 
                        ? 'bg-slate-900 border-slate-900 text-white scale-110 shadow-lg shadow-slate-200' 
                        : 'border-slate-100 group-hover:border-slate-300 text-transparent'
                    }`}>
                      <span className="text-[10px] font-bold">✓</span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-slate-900 mb-3 serif leading-snug">
                    {insight.signal.length > 80 ? insight.signal.substring(0, 80) + '...' : insight.signal}
                  </h4>
                  <p className="text-base text-slate-500 italic leading-relaxed line-clamp-2 serif">
                    {insight.narrative}
                  </p>
                </div>
              ))
            )}
          </div>
          {selectedInsightIds.length > 0 && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleAIDraftFromInsights}
                disabled={isGenerating}
                className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-slate-200"
              >
                {isGenerating ? 'Synthesizing...' : 'Draft From Selected Signals ✨'}
              </button>
            </div>
          )}
        </section>

        {/* Section 3: Drafting Area */}
        <section className="pt-12">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              03. Final Manuscript
            </h3>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl shadow-slate-200 p-12 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Subject Line</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Subject Line (Auto-generated or type here)..."
                className="w-full text-4xl font-semibold serif italic text-white bg-transparent outline-none transition-all placeholder-slate-300 border-none p-0 focus:placeholder-slate-500"
              />
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] text-slate-600 font-bold uppercase py-1 tracking-widest">Hooks:</span>
                {EXAMPLE_HOOKS.map(h => (
                  <button 
                    key={h}
                    onClick={() => setTitle(h)}
                    className="text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-wider transition-colors bg-slate-800 px-2.5 py-1 rounded-md"
                  >
                    "{h}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-slate-800">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-6">Body Content</label>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Start your editorial thesis. Use the 'Fetch' button for AI research..."
                className="w-full h-[700px] bg-transparent text-white leading-relaxed serif text-xl font-medium outline-none transition-all resize-none custom-scrollbar p-0 placeholder-slate-300 focus:placeholder-slate-500"
              />
            </div>
          </div>
        </section>

        {/* Intelligence Sources */}
        {intelSources.length > 0 && (
          <section className="pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-50 pb-2">Verified Research Sources</h3>
            <div className="flex flex-wrap gap-2">
              {intelSources.map((s, i) => (
                <a 
                  key={i} 
                  href={s.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 transition-all flex items-center space-x-2"
                >
                  <span>🔗</span>
                  <span>{s.title.length > 40 ? s.title.substring(0, 40) + '...' : s.title}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Export Buttons */}
        <footer className="flex flex-wrap items-center justify-center gap-6 pt-16 border-t border-slate-50">
          <p className="text-sm text-slate-400 font-semibold italic serif w-full text-center mb-4">Export to your distribution platforms</p>
          <button 
            onClick={() => handleCopy(draftContent)}
            className="group px-8 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold uppercase tracking-widest text-[11px] hover:border-slate-900 hover:text-slate-900 hover:shadow-xl transition-all flex items-center space-x-3"
          >
            <span>Copy for Email</span>
            <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-1">📋</span>
          </button>
          <button 
            onClick={() => handleCopy(draftContent)}
            className="group px-8 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold uppercase tracking-widest text-[11px] hover:border-slate-900 hover:text-slate-900 hover:shadow-xl transition-all flex items-center space-x-3"
          >
            <span>Substack Markdown</span>
            <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-1">✍️</span>
          </button>
          <button 
            onClick={() => handleCopy(draftContent)}
            className="group px-8 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold uppercase tracking-widest text-[11px] hover:border-slate-900 hover:text-slate-900 hover:shadow-xl transition-all flex items-center space-x-3"
          >
            <span>Research Archive</span>
            <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-1">🏛️</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NewsletterWorkspace;
