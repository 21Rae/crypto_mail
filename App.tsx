
import React, { useState, useEffect } from 'react';
import { ContentPillarId, SavedInsight, PillarConfig, NewsletterDraft } from './types';
import { PILLARS } from './constants';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import NewsletterWorkspace from './components/NewsletterWorkspace';
import RightPanel from './components/RightPanel';

const App: React.FC = () => {
  const [activePillarId, setActivePillarId] = useState<ContentPillarId>(ContentPillarId.MARKET_STRUCTURE);
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>(() => {
    const saved = localStorage.getItem('crypto_intelligence_insights');
    return saved ? JSON.parse(saved) : [];
  });

  const activePillar = PILLARS.find(p => p.id === activePillarId) || PILLARS[0];

  useEffect(() => {
    localStorage.setItem('crypto_intelligence_insights', JSON.stringify(savedInsights));
  }, [savedInsights]);

  const handleSaveInsight = (insight: SavedInsight) => {
    setSavedInsights(prev => [insight, ...prev]);
    alert('Insight saved to your workspace archive.');
  };

  const handleSaveNewsletterDraft = (draft: NewsletterDraft) => {
    console.log('Draft saved:', draft);
    // Future: Persist drafts
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Sidebar - Fixed */}
      <Sidebar activePillar={activePillarId} onPillarChange={setActivePillarId} />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 ml-72 mr-80 h-screen relative overflow-y-auto scroll-smooth">
        <div className="w-full min-h-full">
          {activePillarId === ContentPillarId.NEWSLETTER ? (
            <NewsletterWorkspace 
              savedInsights={savedInsights} 
              onDraftSave={handleSaveNewsletterDraft} 
            />
          ) : (
            <Workspace 
              pillar={activePillar} 
              onSave={handleSaveInsight} 
            />
          )}
          
          <footer className="py-12 flex justify-center opacity-20 select-none">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-slate-500">Intelligence Workspace v1.0 • Built for Clarity</p>
          </footer>
        </div>
      </main>

      {/* Right Guidance Panel - Fixed (Only show for active pillars, not newsletter) */}
      {activePillarId !== ContentPillarId.NEWSLETTER && (
        <RightPanel pillar={activePillar} />
      )}
      
      {/* Newsletter Right Panel placeholder */}
      {activePillarId === ContentPillarId.NEWSLETTER && (
        <aside className="w-80 h-screen border-l border-slate-100 bg-slate-50 flex flex-col fixed right-0 top-0 z-10 overflow-y-auto p-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-200 pb-3 text-center">Export Status</h4>
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Selected Insights</p>
              <p className="text-3xl font-light text-slate-900 serif italic">0</p>
              <div className="mt-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-slate-900"></div>
              </div>
            </div>
            
            <div className="p-6 rounded-[24px] border-2 border-dashed border-slate-200 bg-white/50">
              <p className="text-xs text-slate-400 leading-relaxed text-center italic serif">
                Select your best intelligence signals to synthesize a professional market update.
              </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default App;
