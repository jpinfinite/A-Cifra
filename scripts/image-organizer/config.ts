import { OrganizerConfig, CategoryConfig } from './types';

/**
 * Configuration for the Image Organization System
 */

export const CATEGORIES: CategoryConfig[] = [
  {
    name: 'bitcoin',
    keywords: ['bitcoin', 'btc', 'satoshi', 'nakamoto', 'mining', 'hash', 'block'],
    priority: 10
  },
  {
    name: 'ethereum',
    keywords: ['ethereum', 'eth', 'ether', 'vitalik', 'smart-contract', 'erc20', 'gas'],
    priority: 9
  },
  {
    name: 'altcoins',
    keywords: ['altcoin', 'dogecoin', 'litecoin', 'ripple', 'cardano', 'polkadot', 'solana', 'avalanche'],
    priority: 8
  },
  {
    name: 'defi',
    keywords: ['defi', 'decentralized', 'finance', 'yield', 'farming', 'liquidity', 'pool', 'swap', 'uniswap', 'compound'],
    priority: 7
  },
  {
    name: 'trading',
    keywords: ['trading', 'exchange', 'chart', 'analysis', 'candlestick', 'volume', 'price', 'market', 'technical'],
    priority: 6
  },
  {
    name: 'staking',
    keywords: ['staking', 'stake', 'reward', 'validator', 'delegation', 'proof-of-stake', 'pos'],
    priority: 5
  },
  {
    name: 'security',
    keywords: ['wallet', 'security', 'private-key', 'seed', 'phrase', 'cold', 'hardware', 'metamask'],
    priority: 4
  },
  {
    name: 'tutorials',
    keywords: ['tutorial', 'guide', 'how-to', 'step', 'learn', 'education', 'beginner'],
    priority: 3
  },
  {
    name: 'market',
    keywords: ['market', 'cap', 'bull', 'bear', 'trend', 'forecast', 'prediction', 'analysis'],
    priority: 2
  },
  {
    name: 'general',
    keywords: ['crypto', 'cryptocurrency', 'blockchain', 'digital', 'currency', 'coin'],
    priority: 1
  }
];

export const DEFAULT_CONFIG: OrganizerConfig = {
  sourceDir: 'public/images',
  targetDir: 'public/images',
  categories: CATEGORIES,
  preserveExisting: ['articles', 'authors', 'brand', 'icons', 'logos'],
  maxFilenameLength: 50,
  dryRun: false
};

export function getConfig(overrides: Partial<OrganizerConfig> = {}): OrganizerConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides
  };
}