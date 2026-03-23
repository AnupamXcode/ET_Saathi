import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowUpRight, TrendingUp, Activity, Newspaper, GitBranch, Target } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { formatPercent } from '../lib/utils';

// Mock market data for the dashboard
const MARKET_INDICES = [
  { name: "NIFTY 50", value: "22,453.30", change: 0.85, positive: true },
  { name: "SENSEX", value: "73,903.91", change: 0.72, positive: true },
  { name: "BANK NIFTY", value: "48,159.00", change: -0.21, positive: false },
  { name: "INDIA VIX", value: "12.45", change: -2.15, positive: false },
];

const QUICK_ACTIONS = [
  { 
    title: "Analyze News", 
    desc: "Extract impact & sentiment from articles", 
    icon: Newspaper, 
    href: "/analyze-news",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  { 
    title: "Scenario Engine", 
    desc: "Simulate 'what-if' market events", 
    icon: GitBranch, 
    href: "/scenario",
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  { 
    title: "Decision Engine", 
    desc: "Get Buy/Hold/Avoid recommendations", 
    icon: Target, 
    href: "/decision",
    color: "text-primary",
    bg: "bg-primary/10"
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground">Terminal Overview</h1>
        <p className="text-muted-foreground mt-1 text-lg">Welcome back, {user?.name.split(' ')[0]}. Market is open.</p>
      </header>

      {/* Market Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MARKET_INDICES.map((index, i) => (
          <motion.div 
            key={index.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-black/20 border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium mb-1">{index.name}</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono tracking-tight">{index.value}</span>
                  <span className={`text-sm font-medium flex items-center ${index.positive ? 'text-positive' : 'text-destructive'}`}>
                    {index.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
                    {formatPercent(index.change)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-display font-semibold pt-4 border-t border-border/50">Intelligence Engines</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
          >
            <Link href={action.href} className="block group">
              <Card className="h-full glass-panel border-white/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mb-4`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{action.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{action.desc}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
