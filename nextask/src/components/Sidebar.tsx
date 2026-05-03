import { LayoutDashboard, CheckSquare, CalendarDays, Brain, Timer, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

type Page = 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'stopwatch' | 'stories';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'focus', label: 'Focus Mode', icon: Brain },
  { id: 'stopwatch', label: 'Stopwatch', icon: Timer },
  { id: 'stories', label: 'తెలుగు కథలు', icon: BookOpen },
];

export const Sidebar = () => {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useAppStore();
  
  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-56 md:w-56'
        } fixed md:relative h-full bg-white/4 backdrop-blur-md border-r border-white/8 flex flex-col transition-all duration-300 z-50`}
      >
        <div className="h-16 md:h-20 flex items-center justify-between px-4 border-b border-white/8">
          {!sidebarCollapsed && (
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              NX
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden md:block p-2 rounded-lg hover:bg-white/8 transition-colors ml-auto"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  // Close mobile menu after selection
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white/8 border-l-4 border-cyan-400 text-cyan-400'
                    : 'text-white/70 hover:bg-white/6 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/8">
          {!sidebarCollapsed && (
            <div className="text-xs text-white/30 text-center">
              v1.0.0
            </div>
          )}
        </div>
      </div>
    </>
  );
};
