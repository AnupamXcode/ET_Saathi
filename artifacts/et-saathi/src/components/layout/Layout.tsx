import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../hooks/use-auth';
import { 
  LineChart, 
  Newspaper, 
  GitBranch, 
  Target, 
  Briefcase, 
  History, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LineChart },
  { href: "/analyze-news", label: "Analyze News", icon: Newspaper },
  { href: "/scenario", label: "Scenario Engine", icon: GitBranch },
  { href: "/decision", label: "Decision Engine", icon: Target },
  { href: "/simulate", label: "Simulation", icon: LineChart },
  { href: "/portfolio", label: "My Portfolio", icon: Briefcase },
  { href: "/history", label: "History", icon: History },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Redirect to login if no user
  React.useEffect(() => {
    if (user === null) {
      window.location.href = "/login";
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-sidebar border-r border-sidebar-border z-20">
        <div className="h-20 flex items-center px-8 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 border-glow-gold">
              <LineChart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-glow-gold text-foreground">ET Saathi</h1>
              <p className="text-[10px] text-primary uppercase tracking-widest">Intelligence Engine</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(200,150,50,0.05)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/40 border border-white/5 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-display font-bold border border-white/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar/80 backdrop-blur-lg border-b border-sidebar-border z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
            <LineChart className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-display font-bold text-lg text-foreground">ET Saathi</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-16 bg-background z-20 flex flex-col"
          >
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href} className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-xl transition-all",
                      isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"
                    )}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="outline" className="w-full" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
