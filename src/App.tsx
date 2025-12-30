import { useState } from 'react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { NavigationProvider, type AppRoute } from './shared/contexts/NavigationContext';
import { HomePage } from './HomePage';
import { DailyRoutine } from './apps/daily-routine/DailyRoutine';
import { MagicTimer } from './apps/magic-timer/MagicTimer';
import { StarChart } from './apps/star-rewards/StarChart';
import { FoodMenu } from './apps/food-friends/FoodMenu';
import { BathBuddy } from './apps/bath-buddy/BathBuddy';
import { ColorsGame } from './apps/learning-games/ColorsGame';
import { ShapesGame } from './apps/learning-games/ShapesGame';
import { CountingGame } from './apps/learning-games/CountingGame';
import { AnimalSounds } from './apps/learning-games/AnimalSounds';
import { CreativeCanvas } from './apps/creative/CreativeCanvas';
import { StoryTime } from './apps/stories/StoryTime';

function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');

  const renderApp = () => {
    switch (currentRoute) {
      case 'routine':
        return <DailyRoutine />;
      case 'timer':
        return <MagicTimer />;
      case 'stars':
        return <StarChart />;
      case 'food':
        return <FoodMenu />;
      case 'bath':
        return <BathBuddy />;
      case 'colors':
        return <ColorsGame />;
      case 'shapes':
        return <ShapesGame />;
      case 'counting':
        return <CountingGame />;
      case 'animals':
        return <AnimalSounds />;
      case 'draw':
        return <CreativeCanvas />;
      case 'stories':
        return <StoryTime />;
      case 'home':
      default:
        return <HomePage onNavigate={(route) => setCurrentRoute(route as AppRoute)} />;
    }
  };

  return (
    <ThemeProvider>
      <NavigationProvider onNavigate={setCurrentRoute}>
        {renderApp()}
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
