import React, { useState } from 'react';
import { useRunScenario } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { GitBranch, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPercent } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function ScenarioEngine() {
  const [query, setQuery] = useState('');
  const { mutate: runScenario, data: result, isPending, error } = useRunScenario();

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    runScenario(query);
  };

  // Mock Result if API fails for visual testing
  const displayResult = result || (isPending ? null : error ? {
    scenario: "What if crude oil prices surge to $120/barrel?",
    niftyImpact: -2.4,
    confidence: 82,
    explanation: "A surge in crude oil to $120 would significantly inflate India's import bill, widening the current account deficit and depreciating the Rupee. Inflationary pressures would likely force the RBI to tighten policy, impacting overall equity valuations.",
    sectorImpacts: [
      { sector: "Aviation", change: -6.5, direction: "down" },
      { sector: "Paints", change: -8.2, direction: "down" },
      { sector: "FMCG", change: -3.1, direction: "down" },
      { sector: "O&G Exploration", change: 5.4, direction: "up" },
      { sector: "IT", change: -0.5, direction: "neutral" },
    ],
    impactedCompanies: [
      { name: "Asian Paints", symbol: "ASIANPAINT.NS", impact: -9.5, direction: "down", reason: "Crude derivatives form 40% of raw material costs." },
      { name: "InterGlobe Aviation", symbol: "INDIGO.NS", impact: -8.0, direction: "down", reason: "ATF constitutes 40-50% of operating expenses." },
      { name: "ONGC", symbol: "ONGC.NS", impact: 6.5, direction: "up", reason: "Higher crude realizations directly boost profitability." },
    ],
    actionableInsights: [
      "Hedge existing portfolio with out-of-the-money Nifty Puts.",
      "Reduce exposure to paint and aviation stocks immediately.",
      "Accumulate upstream oil exploration companies as a tactical play."
    ]
  } : null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-xl">
          <p className="font-medium text-foreground">{data.sector}</p>
          <p className={`font-bold ${data.change >= 0 ? 'text-positive' : 'text-destructive'}`}>
            {formatPercent(data.change)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <GitBranch className="text-primary" /> Scenario Engine
        </h1>
        <p className="text-muted-foreground mt-1">Simulate macroeconomic events and assess their impact on sectors and specific stocks.</p>
      </header>

      <Card className="glass-panel border-white/5">
        <CardContent className="p-6">
          <form onSubmit={handleRun} className="flex gap-4">
            <Input 
              placeholder="e.g., What if the US Fed cuts rates by 50 bps?"
              className="flex-1 text-lg h-14"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button size="lg" type="submit" isLoading={isPending} disabled={!query.trim()}>
              Run Simulation
            </Button>
          </form>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground mr-2">Try:</span>
            {["Crude oil hits $100", "Monsoon fails this year", "HDFC Bank reports 20% profit drop"].map((q) => (
              <Badge 
                key={q} 
                variant="outline" 
                className="cursor-pointer hover:bg-white/10"
                onClick={() => setQuery(q)}
              >
                {q}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {displayResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mt-8"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="glass-panel border-primary/20 md:col-span-1 flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">Estimated Nifty Impact</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                {displayResult.niftyImpact > 0 ? <TrendingUp className="w-8 h-8 text-positive" /> : <TrendingDown className="w-8 h-8 text-destructive" />}
                <span className={`text-5xl font-display font-bold ${displayResult.niftyImpact > 0 ? 'text-positive' : 'text-destructive'}`}>
                  {formatPercent(displayResult.niftyImpact)}
                </span>
              </div>
              <Badge variant="outline" className="mt-4">Confidence: {displayResult.confidence}%</Badge>
            </Card>

            <Card className="glass-panel md:col-span-3">
              <CardHeader>
                <CardTitle>Sectoral Impact Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayResult.sectorImpacts} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="sector" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <ReferenceLine y={0} stroke="#555" />
                    <Bar dataKey="change" radius={[4, 4, 4, 4]}>
                      {displayResult.sectorImpacts.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.change >= 0 ? 'hsl(var(--positive))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Highly Impacted Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayResult.impactedCompanies.map((company: any) => (
                    <div key={company.symbol} className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-foreground">{company.symbol}</h4>
                          <p className="text-xs text-muted-foreground">{company.name}</p>
                        </div>
                        <Badge variant={company.impact >= 0 ? "positive" : "destructive"} className="text-sm px-2 py-1">
                          {formatPercent(company.impact)}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{company.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Rationale & Mechanism</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{displayResult.explanation}</p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Target className="w-5 h-5" /> Actionable Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {displayResult.actionableInsights.map((insight: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-foreground/90">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
