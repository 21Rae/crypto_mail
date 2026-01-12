
export enum ContentPillarId {
  MARKET_STRUCTURE = 'market_structure',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  ALTCOINS = 'altcoins',
  MEME_COINS = 'meme_coins',
  EXCHANGES = 'exchanges',
  REGULATION = 'regulation',
  SECURITY = 'security',
  NEWSLETTER = 'newsletter'
}

export interface PillarConfig {
  id: ContentPillarId;
  name: string;
  icon: string;
  questions: string[];
  sources: string[];
  metrics: string[];
  reminder: string;
}

export interface SavedInsight {
  id: string;
  pillarId: ContentPillarId;
  date: string;
  source: string;
  signal: string;
  journalAnswers: Record<string, string>;
  narrative: string;
  outputTypes: string[];
}

export interface NewsletterDraft {
  id: string;
  title: string;
  type: string;
  content: string;
  insightIds: string[];
  date: string;
}
