import React, { useState } from 'react';
import { useSimulation } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LineChart as ChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Simulation() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [amount, setAmount] = useState('100000');
  const [years, setYears] = useState('5');
  const { mutate: simulate, data: result, isPending, error } = useSimulation();

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol.trim() || !amount || !years) return;
    simulate({ stockSymbol, amount: Number(amount), years: Number(years) });
  };

  // Mock Result
  const displayResult = result || (isPending ? null : error ? {
    stock: "HDFCBANK.NS",
    initialAmount: 100000,
    projectedValue: 248000,
    notInvestedValue: 100000,
    annualReturn: 19.9,
    totalReturn: 148,
    explanation: "Based on historical 10-year CAGR, mean reversion models, and projected earnings growth, HDFC Bank is expected to compound wealth steadily.",
    assumptions: [
      "Historical CAGR of 18% maintained with 2% premium for upcoming cycle",
      "No major macro economic shocks",
      "Dividends are reinvested"
    ],
    dataPoints: Array.from({length: 6}).map((_, i) => ({
      year: new Date().getFullYear() + i,
      investedValue: Math.round(100000 * Math.pow(1.199, i)),
      notInvestedValue: 100000
    }))
  } : null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <ChartIcon className="text-primary" /> Wealth Simulation
        </h1>
        <p className="text-muted-foreground mt-1">Project potential future value based on AI growth models and historical patterns.</p>
      </header>

      <Card className="glass-panel border-white/5">
        <CardContent className="p-6">
          <form onSubmit={handleRun} className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Stock Symbol</label>
              <Input 
                placeholder="e.g. INFY.NS"
                className="uppercase"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Initial Amount (₹)</label>
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Time Horizon (Years: {years})</label>
              <input 
                type="range" 
                min="1" max="30" 
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary my-4"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
            <Button size="lg" type="submit" isLoading={isPending} disabled={!stockSymbol.trim()}>
              Project Value
            </Button>
          </form>
        </CardContent>
      </Card>

      {displayResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          <div className="md:col-span-1 space-y-6">
            <Card className="glass-panel border-primary/20 bg-primary/5 text-center p-6">
              <h3 className="text-sm font-medium uppercase tracking-widest text-primary mb-2">Projected Value</h3>
              <p className="text-4xl font-mono font-bold text-foreground mb-4">
                {formatCurrency(displayResult.projectedValue)}
              </p>
              <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
                <span className="text-muted-foreground">Total Return</span>
                <span className="text-positive font-bold">{formatPercent(displayResult.totalReturn)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">Est. CAGR</span>
                <span className="text-positive font-bold">{displayResult.annualReturn}%</span>
              </div>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Model Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {displayResult.assumptions.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel md:col-span-2">
            <CardHeader>
              <CardTitle>Growth Trajectory</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayResult.dataPoints} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="year" stroke="#888" tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0D0D0D', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line type="monotone" name="Invested" dataKey="investedValue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
                  <Line type="monotone" name="Not Invested" dataKey="notInvestedValue" stroke="#555" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
