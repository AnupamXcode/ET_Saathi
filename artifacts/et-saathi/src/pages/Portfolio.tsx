import React from 'react';
import { useProfile, useUpdateProfile } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Briefcase, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'];

export default function Portfolio() {
  const { data: profile, isLoading } = useProfile();
  
  // Mock Data if API missing
  const portfolioData = profile?.portfolio || [
    { symbol: 'RELIANCE.NS', name: 'Reliance Ind', quantity: 50, avgPrice: 2400, currentPrice: 2950, allocation: 40 },
    { symbol: 'TCS.NS', name: 'Tata Consultancy', quantity: 20, avgPrice: 3100, currentPrice: 3800, allocation: 25 },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', quantity: 100, avgPrice: 1550, currentPrice: 1480, allocation: 20 },
    { symbol: 'INFY.NS', name: 'Infosys', quantity: 40, avgPrice: 1400, currentPrice: 1650, allocation: 15 },
  ];

  const totalValue = portfolioData.reduce((acc, stock) => acc + (stock.quantity * (stock.currentPrice || stock.avgPrice)), 0);
  const totalInvested = portfolioData.reduce((acc, stock) => acc + (stock.quantity * stock.avgPrice), 0);
  const totalPnl = totalValue - totalInvested;
  const pnlPercent = (totalPnl / totalInvested) * 100;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Briefcase className="text-primary" /> My Portfolio
          </h1>
          <p className="text-muted-foreground mt-1">Manage holdings to get personalized impact analysis from the Scenario Engine.</p>
        </div>
        <Button variant="outline">Sync Broker</Button>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="glass-panel border-white/5 p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Current Value</p>
          <h2 className="text-3xl font-mono font-bold">{formatCurrency(totalValue)}</h2>
          <div className={`mt-2 flex items-center gap-2 text-sm font-bold ${totalPnl >= 0 ? 'text-positive' : 'text-destructive'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)} ({pnlPercent.toFixed(2)}%)
          </div>
        </Card>
        <Card className="glass-panel border-white/5 p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
          <h2 className="text-3xl font-mono font-bold text-foreground/80">{formatCurrency(totalInvested)}</h2>
        </Card>
        <Card className="glass-panel border-white/5 p-6 md:col-span-2 flex items-center gap-4 bg-primary/5 border-primary/20">
          <AlertCircle className="w-10 h-10 text-primary shrink-0" />
          <div>
            <h3 className="font-semibold text-primary">Optimize Your Returns</h3>
            <p className="text-sm text-muted-foreground">Run the Scenario Engine with your portfolio connected to see exact Rupee impact of global events.</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-panel md:col-span-2">
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Stock</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Avg Price</th>
                    <th className="px-4 py-3 text-right">LTP</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((stock, i) => {
                    const pnl = (stock.currentPrice! - stock.avgPrice) * stock.quantity;
                    const pnlP = ((stock.currentPrice! - stock.avgPrice) / stock.avgPrice) * 100;
                    return (
                      <tr key={stock.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-foreground">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">{stock.name}</div>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">{stock.quantity}</td>
                        <td className="px-4 py-4 text-right font-mono">{formatCurrency(stock.avgPrice)}</td>
                        <td className="px-4 py-4 text-right font-mono">{formatCurrency(stock.currentPrice!)}</td>
                        <td className={`px-4 py-4 text-right font-mono font-bold ${pnl >= 0 ? 'text-positive' : 'text-destructive'}`}>
                          {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}<br/>
                          <span className="text-xs">({pnlP.toFixed(2)}%)</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="allocation"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0D0D0D', borderColor: '#333' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
