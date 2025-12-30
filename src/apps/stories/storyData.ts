export interface StoryScene {
  id: number;
  text: string;
  emoji: string;
  interactiveElements?: {
    emoji: string;
    sound: string;
    position: { x: number; y: number };
  }[];
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  scenes: StoryScene[];
}

export const stories: Story[] = [
  {
    id: 'little-bear',
    title: 'Little Bear\'s Day',
    emoji: '🐻',
    scenes: [
      {
        id: 1,
        text: 'Once upon a time, there was a little bear who woke up in the morning.',
        emoji: '🌅',
        interactiveElements: [
          { emoji: '🐻', sound: 'Roar', position: { x: 50, y: 50 } },
          { emoji: '☀️', sound: 'Good morning', position: { x: 80, y: 20 } },
        ]
      },
      {
        id: 2,
        text: 'Little bear went to the river to catch some fish for breakfast.',
        emoji: '🎣',
        interactiveElements: [
          { emoji: '🐠', sound: 'Splash', position: { x: 60, y: 70 } },
          { emoji: '🌊', sound: 'Whoosh', position: { x: 40, y: 60 } },
        ]
      },
      {
        id: 3,
        text: 'After eating, little bear played with friends in the forest.',
        emoji: '🌲',
        interactiveElements: [
          { emoji: '🐰', sound: 'Hop hop', position: { x: 30, y: 50 } },
          { emoji: '🦊', sound: 'Yip', position: { x: 70, y: 50 } },
        ]
      },
      {
        id: 4,
        text: 'When the sun set, little bear went home and fell asleep.',
        emoji: '🌙',
        interactiveElements: [
          { emoji: '🏠', sound: 'Home sweet home', position: { x: 50, y: 60 } },
          { emoji: '⭐', sound: 'Twinkle', position: { x: 80, y: 30 } },
        ]
      },
      {
        id: 5,
        text: 'The End! Sweet dreams, little bear! 💤',
        emoji: '💤',
        interactiveElements: [
          { emoji: '🐻', sound: 'Zzz', position: { x: 50, y: 50 } },
        ]
      }
    ]
  },
  {
    id: 'rainbow-adventure',
    title: 'The Rainbow Adventure',
    emoji: '🌈',
    scenes: [
      {
        id: 1,
        text: 'A little girl found a magical rainbow in her garden.',
        emoji: '🌈',
        interactiveElements: [
          { emoji: '👧', sound: 'Wow', position: { x: 40, y: 60 } },
          { emoji: '🌈', sound: 'Magic', position: { x: 60, y: 40 } },
        ]
      },
      {
        id: 2,
        text: 'She climbed up the rainbow and met friendly clouds.',
        emoji: '☁️',
        interactiveElements: [
          { emoji: '☁️', sound: 'Hello', position: { x: 50, y: 30 } },
          { emoji: '☁️', sound: 'Hello', position: { x: 70, y: 50 } },
        ]
      },
      {
        id: 3,
        text: 'The clouds gave her colorful balloons to play with.',
        emoji: '🎈',
        interactiveElements: [
          { emoji: '🎈', sound: 'Pop', position: { x: 40, y: 40 } },
          { emoji: '🎈', sound: 'Pop', position: { x: 60, y: 40 } },
        ]
      },
      {
        id: 4,
        text: 'She slid down the rainbow back home for dinner.',
        emoji: '🏡',
        interactiveElements: [
          { emoji: '🏡', sound: 'Home', position: { x: 50, y: 70 } },
        ]
      },
      {
        id: 5,
        text: 'The End! What a colorful adventure! ✨',
        emoji: '✨',
        interactiveElements: [
          { emoji: '✨', sound: 'Sparkle', position: { x: 50, y: 50 } },
        ]
      }
    ]
  }
];
