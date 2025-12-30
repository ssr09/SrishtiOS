export interface Food {
  id: string;
  name: string;
  emoji: string;
  category: 'fruit' | 'veggie' | 'protein' | 'grain' | 'dairy';
  mealTime: ('breakfast' | 'lunch' | 'dinner' | 'snack')[];
}

export const defaultFoods: Food[] = [
  // Fruits
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'fruit', mealTime: ['breakfast', 'snack'] },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'fruit', mealTime: ['breakfast', 'snack'] },
  { id: 'orange', name: 'Orange', emoji: '🍊', category: 'fruit', mealTime: ['breakfast', 'snack'] },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'fruit', mealTime: ['snack'] },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'fruit', mealTime: ['breakfast', 'snack'] },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'fruit', mealTime: ['snack'] },

  // Veggies
  { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'veggie', mealTime: ['lunch', 'dinner', 'snack'] },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'veggie', mealTime: ['lunch', 'dinner'] },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'veggie', mealTime: ['lunch', 'dinner'] },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'veggie', mealTime: ['lunch', 'dinner', 'snack'] },
  { id: 'corn', name: 'Corn', emoji: '🌽', category: 'veggie', mealTime: ['lunch', 'dinner'] },

  // Proteins
  { id: 'egg', name: 'Egg', emoji: '🥚', category: 'protein', mealTime: ['breakfast', 'lunch'] },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', category: 'protein', mealTime: ['lunch', 'dinner'] },
  { id: 'fish', name: 'Fish', emoji: '🐟', category: 'protein', mealTime: ['lunch', 'dinner'] },
  { id: 'beans', name: 'Beans', emoji: '🫘', category: 'protein', mealTime: ['lunch', 'dinner'] },

  // Grains
  { id: 'bread', name: 'Bread', emoji: '🍞', category: 'grain', mealTime: ['breakfast', 'lunch', 'snack'] },
  { id: 'rice', name: 'Rice', emoji: '🍚', category: 'grain', mealTime: ['lunch', 'dinner'] },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'grain', mealTime: ['lunch', 'dinner'] },
  { id: 'cereal', name: 'Cereal', emoji: '🥣', category: 'grain', mealTime: ['breakfast'] },
  { id: 'pancake', name: 'Pancake', emoji: '🥞', category: 'grain', mealTime: ['breakfast'] },

  // Dairy
  { id: 'milk', name: 'Milk', emoji: '🥛', category: 'dairy', mealTime: ['breakfast', 'snack'] },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'dairy', mealTime: ['breakfast', 'lunch', 'snack'] },
  { id: 'yogurt', name: 'Yogurt', emoji: '🍦', category: 'dairy', mealTime: ['breakfast', 'snack'] },
];

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const mealTimeConfig = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🌅', color: 'bg-yellow-400' },
  { id: 'lunch', name: 'Lunch', emoji: '☀️', color: 'bg-orange-400' },
  { id: 'dinner', name: 'Dinner', emoji: '🌙', color: 'bg-purple-400' },
  { id: 'snack', name: 'Snacks', emoji: '🍪', color: 'bg-pink-400' },
];

export const categoryConfig = [
  { id: 'fruit', name: 'Fruits', emoji: '🍎', color: 'bg-red-100' },
  { id: 'veggie', name: 'Veggies', emoji: '🥕', color: 'bg-green-100' },
  { id: 'protein', name: 'Proteins', emoji: '🥚', color: 'bg-yellow-100' },
  { id: 'grain', name: 'Grains', emoji: '🍞', color: 'bg-orange-100' },
  { id: 'dairy', name: 'Dairy', emoji: '🥛', color: 'bg-blue-100' },
];
