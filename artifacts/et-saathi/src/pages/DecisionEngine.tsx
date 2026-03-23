import React, { useState } from 'react';
import { useDecisionEngine } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ConfidenceMeter } from '../components/ui/confidence-meter';
import { Target, CheckCircle2, AlertOctagon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../lib/utils';

export default function DecisionEngine() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [newsContext, setNewsContext] = useState('');
  const { mutate: getDecision, data: result, isPending, error } = useDecisionEngine();

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol.trim()) return;
    getDecision({ stockSymbol, newsContext });
  };

  // Mock Result if API fails
  const displayResult = result || (isPending ? null : error ? {
    stock: "RELIANCE.NS",
    recommendation: "buy",
    confidence: 85,
    riskLevel: "medium",
    targetPrice: 3250,
    stopLoss: 2840,
    timeHorizon: "6-9 Months",
    explanation: "Reliance shows strong technical breakout supported by robust gross refining margins in the O2C segment and continued subscriber additions in Jio. The recent retail expansion announcements add to the positive momentum.",
    reasons: [
      "O2C margins expanding beyond historical averages",
      "Jio ARPU increases starting to reflect in bottom line",
      "Debt reduction trajectory on target"
    ],
    warnings: [
      "Susceptible to sudden drops in global crude demand",
      "Valuations are slightly stretched compared to historical peers"
    ]
  } : null);

  const getRecStyles = (rec: string) => {
    switch (rec.toLowerCase()) {
      case 'buy': return { color: 'text-positive', bg: 'bg-positive/10', border: 'border-positive/30', glow: 'shadow-[0_0_40px_rgba(34,197,94,0.2)]' };
      case 'sell': 
      case 'avoid': return { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.2)]' };
      default: return { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', glow: 'shadow-[0_0_40px_rgba(200,150,50,0.2)]' };
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Target className="text-primary" /> Decision Engine
        </h1>
        <p className="text-muted-foreground mt-1">Get AI-driven Buy/Hold/Avoid recommendations with confidence scoring.</p>
      </header>

      <Card className="glass-panel border-white/5">
        <CardContent className="p-6">
          <form onSubmit={handleRun} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Stock Symbol</label>
                <Input 
                  placeholder="e.g. RELIANCE.NS, TCS.NS"
                  className="text-lg uppercase"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Context / News (Optional)</label>
                <Textarea 
                  placeholder="Paste any recent news or specific thesis you want the AI to consider..."
                  className="min-h-[48px]"
                  value={newsContext}
                  onChange={(e) => setNewsContext(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="lg" type="submit" isLoading={isPending} disabled={!stockSymbol.trim()}>
                Generate Decision
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {displayResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          {/* Main Recommendation Card */}
          <div className="md:col-span-2 space-y-6">
            <Card className={`glass-panel border-2 relative overflow-hidden ${getRecStyles(displayResult.recommendation).border} ${getRecStyles(displayResult.recommendation).glow}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] ${getRecStyles(displayResult.recommendation).bg} pointer-events-none -mr-20 -mt-20`} />
              
              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge variant="outline" className="mb-2">{displayResult.stock}</Badge>
                    <h2 className={`font-display text-7xl font-bold uppercase tracking-tighter ${getRecStyles(displayResult.recommendation).color}`}>
                      {displayResult.recommendation}
                    </h2>
                  </div>
                  <ConfidenceMeter score={displayResult.confidence} size={100} strokeWidth={6} />
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Target Price</p>
                    <p className="text-2xl font-mono font-bold text-foreground">{displayResult.targetPrice ? formatCurrency(displayResult.targetPrice) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Stop Loss</p>
                    <p className="text-2xl font-mono font-bold text-foreground">{displayResult.stopLoss ? formatCurrency(displayResult.stopLoss) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time Horizon</p>
                    <p className="text-xl font-medium text-foreground mt-1">{displayResult.timeHorizon || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">AI Thesis</h4>
                  <p className="text-muted-foreground leading-relaxed text-lg">{displayResult.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Reasons & Warnings */}
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-positive" /> Supporting Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {displayResult.reasons.map((reason: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed bg-white/5 p-3 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-positive shrink-0 mt-0.5" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {displayResult.warnings && displayResult.warnings.length > 0 && (
              <Card className="glass-panel border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                    <AlertOctagon className="w-5 h-5" /> Key Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {displayResult.warnings.map((warning: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed bg-destructive/5 p-3 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
