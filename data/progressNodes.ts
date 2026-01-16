
import { ProgressNode } from '@/types/game';

// Progress Tree nodes for Planetary Labour Clicker
export const progressNodes: ProgressNode[] = [
  // Early Game - Basic clicking improvements
  {
    id: 'basic-thinking',
    title: 'Basic Thinking',
    description: 'Develop fundamental cognitive processes',
    cost: 10,
    unlocked: false,
    benefit: {
      type: 'clickBonus',
      value: 1,
    },
    flavorText: 'Individual thought begins to scale.',
  },
  {
    id: 'written-communication',
    title: 'Written Communication',
    description: 'Record and share knowledge across time',
    cost: 50,
    unlocked: false,
    benefit: {
      type: 'passiveIncome',
      value: 0.5,
    },
    flavorText: 'Knowledge persists beyond the moment.',
    prerequisite: 'basic-thinking',
  },
  {
    id: 'analysis-tools',
    title: 'Analysis Tools',
    description: 'Systematic methods for understanding complexity',
    cost: 150,
    unlocked: false,
    benefit: {
      type: 'multiplier',
      value: 1.25,
    },
    flavorText: 'Efficiency increases through methodology.',
    prerequisite: 'written-communication',
  },
  {
    id: 'automation-scripts',
    title: 'Automation Scripts',
    description: 'Simple programs that work while you rest',
    cost: 400,
    unlocked: false,
    benefit: {
      type: 'passiveIncome',
      value: 2,
    },
    flavorText: 'Labour continues in your absence.',
    prerequisite: 'analysis-tools',
  },
  
  // Mid Game - Collective intelligence
  {
    id: 'collective-intelligence',
    title: 'Collective Intelligence',
    description: 'Minds working together amplify output',
    cost: 1000,
    unlocked: false,
    benefit: {
      type: 'passiveIncome',
      value: 5,
    },
    flavorText: 'Your labour now scales beyond individual effort.',
    prerequisite: 'automation-scripts',
  },
  {
    id: 'distributed-networks',
    title: 'Distributed Networks',
    description: 'Connect intelligence across vast distances',
    cost: 2500,
    unlocked: false,
    benefit: {
      type: 'clickBonus',
      value: 5,
    },
    flavorText: 'Distance becomes irrelevant.',
    prerequisite: 'collective-intelligence',
  },
  {
    id: 'ai-coordination',
    title: 'AI Coordination',
    description: 'Artificial minds assist in planning and execution',
    cost: 6000,
    unlocked: false,
    benefit: {
      type: 'multiplier',
      value: 1.5,
    },
    flavorText: 'Planning has become automated.',
    prerequisite: 'distributed-networks',
  },
  {
    id: 'systems-planning',
    title: 'Systems Planning',
    description: 'Holistic optimization of all processes',
    cost: 15000,
    unlocked: false,
    benefit: {
      type: 'multiplier',
      value: 2.0,
    },
    flavorText: 'All production doubled through systematic thinking.',
    prerequisite: 'ai-coordination',
  },
  
  // Late Game - Planetary scale
  {
    id: 'global-coordination',
    title: 'Global Coordination',
    description: 'Planetary-scale synchronization of effort',
    cost: 40000,
    unlocked: false,
    benefit: {
      type: 'passiveIncome',
      value: 20,
    },
    flavorText: 'The entire planet works as one.',
    prerequisite: 'systems-planning',
  },
  {
    id: 'planetary-optimization',
    title: 'Planetary Optimization',
    description: 'Every resource allocated with perfect efficiency',
    cost: 100000,
    unlocked: false,
    benefit: {
      type: 'multiplier',
      value: 3.0,
    },
    flavorText: 'Civilization output increasing exponentially.',
    prerequisite: 'global-coordination',
  },
  {
    id: 'civilizational-scaling',
    title: 'Civilizational Scaling',
    description: 'Transcend planetary limitations',
    cost: 250000,
    unlocked: false,
    benefit: {
      type: 'multiplier',
      value: 5.0,
    },
    flavorText: 'Labour scales beyond comprehension.',
    prerequisite: 'planetary-optimization',
  },
  {
    id: 'universal-intelligence',
    title: 'Universal Intelligence',
    description: 'Intelligence becomes the fabric of reality',
    cost: 1000000,
    unlocked: false,
    benefit: {
      type: 'multiplier',
      value: 10.0,
    },
    flavorText: 'You have achieved planetary labour at cosmic scale.',
    prerequisite: 'civilizational-scaling',
  },
];
