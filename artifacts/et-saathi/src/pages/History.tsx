import React from 'react';
import { useHistory } from '../hooks/use-analysis';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { History as HistoryIcon, Newspaper, GitBranch, Target, LineChart } from 'lucide-react';
import { format } from 'date-fns';

export default function History() {
  const { data, isLoading } = useHistory();

  // Mock data for visual testing
  const historyItems = data?.items || [
    {
      id: 1,
      type: "decision",
      query: "RELIANCE.NS with context of new retail store additions",
      createdAt: new Date().toISOString(),
      result: { recommendation: "BUY", confidence: 85 }
    },
    {
      id: 2,
      type: "scenario",
      query: "What if the US Fed cuts rates by 50 bps?",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      result: { niftyImpact: 1.2 }
    },
    {
      id: 3,
      type: "news",
      query: "RBI Monetary policy minutes released yesterday",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      result: { sentiment: "bearish" }
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'news': return <Newspaper className="w-5 h-5 text-blue-400" />;
      case 'scenario': return <GitBranch className="w-5 h-5 text-purple-400" />;
      case 'decision': return <Target className="w-5 h-5 text-primary" />;
      case 'simulation': return <LineChart className="w-5 h-5 text-emerald-400" />;
      default: return <HistoryIcon className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <HistoryIcon className="text-primary" /> Intelligence History
        </h1>
        <p className="text-muted-foreground mt-1">Review your past queries and analyses.</p>
      </header>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {historyItems.map((item: any, i: number) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/80 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10">
              {getIcon(item.type)}
            </div>
            
            <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] glass-panel hover:border-white/20 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="uppercase text-[10px] tracking-widest">{item.type}</Badge>
                  <time className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </time>
                </div>
                <p className="font-medium text-foreground text-sm line-clamp-2 leading-relaxed">"{item.query}"</p>
                
                {/* Result Snippet */}
                {item.result && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                    {item.result.recommendation && (
                      <Badge variant={item.result.recommendation === 'BUY' ? 'positive' : 'gold'}>{item.result.recommendation}</Badge>
                    )}
                    {item.result.sentiment && (
                      <Badge variant="outline" className="capitalize">{item.result.sentiment} Sentiment</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
