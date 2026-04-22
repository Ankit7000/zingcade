export type Game = {
  slug: string;
  title: string;
  hook: string;
  description: string;
  categories: string[];
  controls: string[];
  thumbnail: string;
  featured?: boolean;
};

export const games: Game[] = [
  {
    slug: 'neon-dash',
    title: 'Neon Dash',
    hook: 'Three lanes. Zero mercy. Dash through the city.',
    description: 'A perspective endless runner. Dodge neon obstacles, collect coins, and dash through the city. Shift between three lanes, dodge neon hazards, and turn clean reactions into a longer score run through the city.',
    categories: ['Endless Runner', 'Action'],
    controls: ['Keyboard', 'Swipe', 'Touch'],
    thumbnail: '/images/thumbnails/neon-dash.svg',
    featured: true,
  },
  {
    slug: 'merge-monster-2048',
    title: 'Merge Monster 2048',
    hook: 'Slide a 4x4 board, merge creature tiers.',
    description: 'Slide a 4x4 board, merge creature tiers into bigger evolutions, and keep the ladder alive long enough to push into Dragon and Void Titan territory.',
    categories: ['Puzzle Addict'],
    controls: ['Arrow keys', 'Swipe'],
    thumbnail: '/images/thumbnails/merge-monster-2048.svg',
  },
  {
    slug: 'rainball-rush',
    title: 'Rainball Rush',
    hook: 'Dodge the relentless storm.',
    description: 'Control the glowing sphere, slide through hazardous patterns, and climb to the Legend rank before you break.',
    categories: ['Reflex Rage'],
    controls: ['Keyboard', 'Swipe'],
    thumbnail: '/images/thumbnails/rainball-rush.svg',
  },
  {
    slug: 'daily-vault',
    title: 'Daily Vault',
    hook: 'Solve the daily 4-slot code.',
    description: 'Solve the daily 4-slot code, protect your streak, and switch to Practice Mode when you want another logic run immediately.',
    categories: ['Daily Challenge', 'Puzzle'],
    controls: ['Keyboard'],
    thumbnail: '/images/thumbnails/daily-vault.svg',
  },
  {
    slug: 'color-crown',
    title: 'Color Crown',
    hook: 'Leave your safe color, close risky loops.',
    description: 'Leave your safe color, close risky loops, and claim territory before arena cutters break the vulnerable trail.',
    categories: ['Growth', 'Control'],
    controls: ['Keyboard', 'Swipe'],
    thumbnail: '/images/thumbnails/color-crown.svg',
  },
  {
    slug: 'arcade-tycoon',
    title: 'Arcade Tycoon Clicker',
    hook: 'Grow a tiny arcade corner into a massive empire.',
    description: 'Grow a tiny arcade corner into a massive empire. Buy machines, rank up, and earn passive tokens even while you are offline.',
    categories: ['Idle', 'Progression'],
    controls: ['Mouse', 'Touch'],
    thumbnail: '/images/thumbnails/arcade-tycoon.svg',
  },
  {
    slug: 'dont-stop-ball',
    title: 'Dont Stop Ball',
    hook: 'Read warning lanes, dodge mixed hazard patterns.',
    description: 'Read warning lanes, dodge mixed hazard patterns, and keep the score chain alive long enough to reach the hotter stages.',
    categories: ['Arcade Survival'],
    controls: ['Keyboard', 'Swipe'],
    thumbnail: '/images/thumbnails/dont-stop-ball.svg',
  },
  {
    slug: 'sky-hop',
    title: 'Sky Hop',
    hook: 'Bounce between varied cloud platforms.',
    description: 'Bounce between varied cloud platforms, ride forgiving landings, and keep climbing toward the next saved height milestone.',
    categories: ['Sky Platformer'],
    controls: ['Keyboard', 'Touch'],
    thumbnail: '/images/thumbnails/sky-hop.svg',
  }
];
