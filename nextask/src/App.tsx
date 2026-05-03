import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { useStreakStore } from './stores/useStreakStore';
import { useAuthStore } from './stores/useAuthStore';
import { useTaskStore } from './stores/useTaskStore';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { RageMode } from './components/RageMode';
import { SoundEngine } from './components/SoundEngine';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { FocusMode } from './pages/FocusMode';
import { Stopwatch } from './pages/Stopwatch';
import { Stories } from './pages/Stories';

function App() {
  const { currentPage, rageMode } = useAppStore();
  const { loadStreaks } = useStreakStore();
  const { loadTasks } = useTaskStore();
  const { isAuthenticated, currentUser } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadStreaks(currentUser.passkey);
      loadTasks(currentUser.passkey);
    }
  }, [isAuthenticated, currentUser]);
  
  if (!isAuthenticated) {
    return <AuthScreen />;
  }
  
  const pages = {
    dashboard: <Dashboard />,
    tasks: <Tasks />,
    calendar: <Calendar />,
    focus: <FocusMode />,
    stopwatch: <Stopwatch />,
    stories: <Stories />,
  };
  
  return (
    <div 
      className={`flex h-screen font-['Outfit'] text-[#e8eaf2] transition-all duration-1500 overflow-hidden ${
        rageMode 
          ? 'bg-[#1a0008] font-["JetBrains_Mono"]' 
          : 'bg-[#080a0f]'
      }`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <AnimatePresence mode="wait">
            {pages[currentPage]}
          </AnimatePresence>
        </main>
      </div>
      <RageMode />
      <SoundEngine />
    </div>
  );
}

export default App;
