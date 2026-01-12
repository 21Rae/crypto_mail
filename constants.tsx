
import { ContentPillarId, PillarConfig } from './types';

export const PILLARS: PillarConfig[] = [
  {
    id: ContentPillarId.MARKET_STRUCTURE,
    name: 'Market Structure & Macro',
    icon: '📊',
    questions: [
      'What is the market pricing in this week?',
      'Where is capital rotating and why?'
    ],
    sources: ['Glassnode', 'DeFiLlama', 'ZeroHedge', 'The Block Research'],
    metrics: ['BTC Dominance', 'Stablecoin Supply Ratio (SSR)', 'Funding Rates'],
    reminder: 'Focus on macro liquidity trends and institutional flow.'
  },
  {
    id: ContentPillarId.BITCOIN,
    name: 'Bitcoin (BTC) Deep Dive',
    icon: '₿',
    questions: [
      'How are ETF flows influencing local price action?',
      'Is on-chain accumulation signaling a cycle shift?'
    ],
    sources: ['Bitcoin Magazine', 'Checkonchain', 'Farside ETF Tracker'],
    metrics: ['ETF Net Inflow/Outflow', 'Hashrate Growth', 'HODL Waves'],
    reminder: 'Bitcoin is the anchor. Watch the base layer health.'
  },
  {
    id: ContentPillarId.ETHEREUM,
    name: 'Ethereum & Smart Platforms',
    icon: '⟠',
    questions: [
      'What is the current L2 vs L1 value capture dynamic?',
      'Is network fee usage indicating new application growth?'
    ],
    sources: ['L2Beat', 'Ultra Sound Money', 'The Daily Gwei'],
    metrics: ['L2 TVL Growth', 'Burn Rate vs Issuance', 'Active Validator Count'],
    reminder: 'Ethereum is an economy. Analyze throughput and burn.'
  },
  {
    id: ContentPillarId.ALTCOINS,
    name: 'Altcoins (Narrative-Based)',
    icon: '🚀',
    questions: [
      'Which sub-sector is currently leading the bounce?',
      'Is there genuine technical innovation or purely speculative hype?'
    ],
    sources: ['Messari', 'CoinGecko Narrative Tracker', 'Dune Analytics'],
    metrics: ['Sector Market Cap Change', 'Developer Activity', 'Social Volume'],
    reminder: 'Altcoins follow narratives. Identify the theme before the pump.'
  },
  {
    id: ContentPillarId.MEME_COINS,
    name: 'Meme Coins (Psychology)',
    icon: '🐕',
    questions: [
      'Why is this meme gaining attention right now?',
      'What behavior is driving liquidity (community vs influencers)?'
    ],
    sources: ['DexScreener', 'BubbleMaps', 'X/Twitter Trends'],
    metrics: ['Holder Concentration', 'DEX Volume/Liquidity Ratio', 'Sentiment Score'],
    reminder: 'Avoid shilling. Focus on behavior and narrative psychology.'
  },
  {
    id: ContentPillarId.EXCHANGES,
    name: 'Exchanges (CEX & DEX)',
    icon: '🏦',
    questions: [
      'Are exchange balances increasing or decreasing significantly?',
      'Which DEX is capturing the most volume from specific narratives?'
    ],
    sources: ['Nansen', 'Token Terminal', 'Exchange Proof of Reserves'],
    metrics: ['CEX Inflow/Outflow', 'DEX vs CEX Volume Ratio', 'OI on Top Pairs'],
    reminder: 'Exchanges are the pipes. Watch for leaks or surges.'
  },
  {
    id: ContentPillarId.REGULATION,
    name: 'Regulation & Legal',
    icon: '⚖️',
    questions: [
      'How do recent legal filings impact US-based operations?',
      'Which jurisdictions are showing the most builder-friendly progress?'
    ],
    sources: ['CoinDesk Policy', 'Variant Fund Legal', 'SEC/CFTC Filings'],
    metrics: ['Regulatory Score by Region', 'Legal Case Status Tracker'],
    reminder: 'Compliance is the gatekeeper. Stay ahead of the hammer.'
  },
  {
    id: ContentPillarId.SECURITY,
    name: 'Security, Hacks & Risk',
    icon: '🛡️',
    questions: [
      'What was the primary vector for the latest exploit?',
      'Are users migrating to self-custody or safer bridges?'
    ],
    sources: ['PeckShield', 'CertiK', 'Rekt News'],
    metrics: ['Total Value Hacked (TVH)', 'Audit Coverage Percent'],
    reminder: 'Risk is the only constant. Protect the capital.'
  }
];

export const SOURCES = ['Glassnode', 'DeFiLlama', 'Twitter/X', 'Manual Insight', 'Farside', 'Nansen', 'Messari'];

export const NEWSLETTER_TYPES = [
  'Market Pulse',
  'Narrative Watch',
  'On-Chain Insight',
  'Meme Psychology',
  'Risk Report',
  'Builder / Investor Journal'
];

export const EXAMPLE_HOOKS = [
  "What most crypto traders missed this week",
  "The metric no influencer is talking about",
  "Why the consensus is likely wrong about [Topic]",
  "Connecting the dots between macro and on-chain"
];
