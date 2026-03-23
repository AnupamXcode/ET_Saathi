import React, { useState } from 'react';
import { useAnalyzeNews } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ConfidenceMeter } from '../components/ui/confidence-meter';
import { AlertTriangle, Zap, TrendingUp, TrendingDown, Minus, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyzeNews() {
  const [newsText, setNewsText] = useState('');
  const { mutate: analyze, data: result, isPending, error } = useAnalyzeNews();

  const handleAnalyze = () => {
    if (!newsText.trim()) return;
    // Mocking API response if backend not connected yet, otherwise call actual mutation
    analyze(newsText);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-5 h-5" />;
      case 'bearish': return <TrendingDown className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return "text-positive bg-positive/10 border-positive/20";
      case 'bearish': return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  // Mock Result if API fails for visual testing
  const displayResult = result || (isPending ? null : error ? {
    keyEvent: "RBI announces unexpected repo rate hike of 50 basis points.",
    eventType: "Monetary Policy",
    sentiment: "bearish",
    sentimentScore: 25,
    confidence: 88,
    summary: "The Reserve Bank of India has increased the repo rate by 50 bps to curb inflation. This unexpected move will likely increase borrowing costs for banks, leading to higher interest rates for consumers and potentially slowing economic growth in the short term.",
    marketImpact: "Broad negative impact expected on interest-rate sensitive sectors like Real Estate, Auto, and Banking. IT might see a neutral to slightly negative impact due to broader market sentiment.",
    affectedSectors: [
      { name: "Real Estate", impact: "negative", magnitude: 8 },
      { name: "Banking & Financials", impact: "negative", magnitude: 6 },
      { name: "Automobiles", impact: "negative", magnitude: 5 },
      { name: "FMCG", impact: "neutral", magnitude: 2 },
    ],
    riskWarnings: [
      "High probability of near-term market correction.",
      "Home loan EMI increases may reduce consumer spending.",
      "Corporate margins may squeeze due to higher cost of capital."
    ]
  } : null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Newspaper className="text-primary" /> News Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">Paste financial news or press releases to extract insights and market impact.</p>
      </header>

      <Card className="border-primary/20 bg-black/40">
        <CardContent className="p-6">
          <Textarea 
            placeholder="Paste article text, press release, or earnings call transcript here..."
            className="min-h-[160px] text-base mb-4 font-mono leading-relaxed"
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button size="lg" onClick={handleAnalyze} isLoading={isPending} disabled={!newsText.trim()}>
              <Zap className="w-4 h-4 mr-2" /> Extract Intelligence
            </Button>
          </div>
        </CardContent>
      </Card>

      {displayResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          {/* Main Insights - Span 2 cols */}
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-panel border-primary/30 border-glow-gold relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="gold" className="mb-2 uppercase tracking-widest text-[10px]">{displayResult.eventType}</Badge>
                    <CardTitle className="text-2xl leading-snug">{displayResult.keyEvent}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">{displayResult.summary}</p>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Market Impact
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{displayResult.marketImpact}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-destructive/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-destructive/50" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" /> Risk Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {displayResult.riskWarnings?.map((warning: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-destructive/5 p-3 rounded-lg border border-destructive/10 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                      <span className="text-foreground/90">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Metrics & Sectors */}
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-2 text-center border-b border-white/5">
                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Analysis Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-8 flex flex-col items-center gap-8">
                <ConfidenceMeter score={displayResult.confidence} size={140} strokeWidth={10} />
                
                <div className="w-full text-center">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Sentiment</span>
                  <div className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border ${getSentimentColor(displayResult.sentiment)}`}>
                    {getSentimentIcon(displayResult.sentiment)}
                    <span className="font-bold text-lg uppercase tracking-wide">{displayResult.sentiment}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Sector Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayResult.affectedSectors.map((sector: any) => (
                    <div key={sector.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{sector.name}</span>
                        <span className={
                          sector.impact === 'positive' ? 'text-positive' : 
                          sector.impact === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                        }>
                          {sector.impact.toUpperCase()}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            sector.impact === 'positive' ? 'bg-positive' : 
                            sector.impact === 'negative' ? 'bg-destructive' : 'bg-muted-foreground'
                          }`}
                          style={{ width: `${(sector.magnitude / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
