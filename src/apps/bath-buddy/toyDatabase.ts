export interface BathToy {
  id: string;
  name: string;
  emoji: string;
  category: 'animal' | 'vehicle' | 'character' | 'tool';
  sound?: string; // Sound description for audio
}

export const defaultToys: BathToy[] = [
  // Animals
  { id: 'duck', name: 'Rubber Duck', emoji: '🦆', category: 'animal', sound: 'quack' },
  { id: 'whale', name: 'Whale', emoji: '🐋', category: 'animal', sound: 'whoosh' },
  { id: 'frog', name: 'Frog', emoji: '🐸', category: 'animal', sound: 'ribbit' },
  { id: 'fish', name: 'Fish', emoji: '🐠', category: 'animal', sound: 'bubble' },
  { id: 'octopus', name: 'Octopus', emoji: '🐙', category: 'animal', sound: 'splash' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', category: 'animal', sound: 'splash' },

  // Vehicles
  { id: 'boat', name: 'Boat', emoji: '🚤', category: 'vehicle', sound: 'vroom' },
  { id: 'submarine', name: 'Submarine', emoji: '🚢', category: 'vehicle', sound: 'beep' },
  { id: 'car', name: 'Water Car', emoji: '🚗', category: 'vehicle', sound: 'vroom' },

  // Characters
  { id: 'mermaid', name: 'Mermaid', emoji: '🧜', category: 'character' },
  { id: 'doll', name: 'Doll', emoji: '👶', category: 'character' },
  { id: 'superhero', name: 'Superhero', emoji: '🦸', category: 'character' },

  // Tools
  { id: 'cup', name: 'Cup', emoji: '🥤', category: 'tool', sound: 'pour' },
  { id: 'bucket', name: 'Bucket', emoji: '🪣', category: 'tool', sound: 'splash' },
  { id: 'bubbles', name: 'Bubbles', emoji: '🫧', category: 'tool', sound: 'pop' },
  { id: 'waterwheel', name: 'Water Wheel', emoji: '⚙️', category: 'tool', sound: 'spin' },
];

export const categoryConfig = [
  { id: 'animal', name: 'Animals', emoji: '🦆', color: 'bg-blue-100' },
  { id: 'vehicle', name: 'Vehicles', emoji: '🚤', color: 'bg-green-100' },
  { id: 'character', name: 'Characters', emoji: '🧜', color: 'bg-purple-100' },
  { id: 'tool', name: 'Tools', emoji: '🪣', color: 'bg-yellow-100' },
];

export const MAX_SELECTIONS = 5;
