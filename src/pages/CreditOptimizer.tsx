import {
  CreditCard,
  Star,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Percent,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Gift,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cards = [
  {
    name: "Chase Sapphire Preferred",
    type: "Travel Rewards",
    lastFour: "4242",
    rewards: {
      dining: 3,
      travel: 2,
      other: 1,
    },
    annualFee: 95,
    currentSpend: 2450,
    rewardsEarned: 4890,
    color: "from-blue-600 to-blue-800",
  },
  {
    name: "AMEX Gold Card",
    type: "Dining Rewards",
    lastFour: "1234",
    rewards: {
      dining: 4,
      groceries: 4,
      other: 1,
    },
    annualFee: 250,
    currentSpend: 1890,
    rewardsEarned: 7560,
    color: "from-amber-500 to-amber-700",
  },
  {
    name: "Capital One Venture X",
    type: "Travel Miles",
    lastFour: "5678",
    rewards: {
      travel: 10,
      dining: 2,
      other: 2,
    },
    annualFee: 395,
    currentSpend: 890,
    rewardsEarned: 1780,
    color: "from-slate-700 to-slate-900",
  },
];

const categoryOptimization = [
  { category: "Dining", currentCard: "Chase Sapphire", optimalCard: "AMEX Gold", currentRate: "3x", optimalRate: "4x", monthlySpend: 450, potentialGain: 45 },
  { category: "Groceries", currentCard: "Chase Sapphire", optimalCard: "AMEX Gold", currentRate: "1x", optimalRate: "4x", monthlySpend: 600, potentialGain: 180 },
  { category: "Travel", currentCard: "Chase Sapphire", optimalCard: "Venture X", currentRate: "2x", optimalRate: "10x", monthlySpend: 200, potentialGain: 160 },
  { category: "Gas", currentCard: "Various", optimalCard: "Costco Visa", currentRate: "1x", optimalRate: "4x", monthlySpend: 180, potentialGain: 54 },
];

const missedRewardsValue = categoryOptimization.reduce((sum, c) => sum + c.potentialGain, 0);

export default function CreditOptimizer() {
  return (
    <DashboardLayout title="Credit Card Optimizer" subtitle="Maximize your rewards across all cards">
      <div className="space-y-6">
        {/* Missed Rewards Alert */}
        <Card className="card-warning">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/20">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">You're missing ${missedRewardsValue}/month in rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    By optimizing which card you use for each category, you could earn up to ${missedRewardsValue * 12}/year more
                  </p>
                </div>
              </div>
              <Button variant="warning" className="shrink-0">
                View Recommendations
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Credit Cards</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card key={card.lastFour} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Card visual */}
                <div className={`h-32 p-4 bg-gradient-to-br ${card.color} text-white relative overflow-hidden`}>
                  <div className="absolute top-4 right-4">
                    <CreditCard className="w-8 h-8 opacity-30" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-sm opacity-80">{card.type}</p>
                    <p className="text-lg font-bold">{card.name}</p>
                    <p className="text-sm font-mono mt-1">•••• {card.lastFour}</p>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Reward rates */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(card.rewards).map(([category, rate]) => (
                        <Badge key={category} variant="secondary" className="capitalize">
                          {category}: {rate}x
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">This Month</p>
                        <p className="font-semibold">${card.currentSpend.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rewards Earned</p>
                        <p className="font-semibold text-primary">{card.rewardsEarned.toLocaleString()} pts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Optimization Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle>Best Card by Category</CardTitle>
            </div>
            <CardDescription>
              Use the optimal card for each spending category to maximize rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Current Card</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Optimal Card</th>
                    <th className="text-center py-3 text-sm font-medium text-muted-foreground">Current Rate</th>
                    <th className="text-center py-3 text-sm font-medium text-muted-foreground">Optimal Rate</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Monthly Spend</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Potential Gain</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryOptimization.map((row, index) => {
                    const isOptimized = row.currentCard === row.optimalCard;
                    return (
                      <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-4 font-medium">{row.category}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {isOptimized ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-destructive" />
                            )}
                            {row.currentCard}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={isOptimized ? "success" : "info"}>
                            {row.optimalCard}
                          </Badge>
                        </td>
                        <td className="py-4 text-center">{row.currentRate}</td>
                        <td className="py-4 text-center">
                          <span className="text-primary font-semibold">{row.optimalRate}</span>
                        </td>
                        <td className="py-4 text-right">${row.monthlySpend}</td>
                        <td className="py-4 text-right">
                          {row.potentialGain > 0 ? (
                            <span className="text-success font-semibold">+${row.potentialGain}/mo</span>
                          ) : (
                            <span className="text-muted-foreground">Optimized</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Summary */}
            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">Total Potential Savings</p>
                    <p className="text-sm text-muted-foreground">By using the optimal card for each category</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${missedRewardsValue}/mo</p>
                  <p className="text-sm text-muted-foreground">${missedRewardsValue * 12}/year</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Annual Value Analysis</CardTitle>
            <CardDescription>
              Compare the value of each card based on your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cards.map((card) => {
                const annualRewards = card.rewardsEarned * 12 * 0.01; // Convert points to dollars at 1cpp
                const netValue = annualRewards - card.annualFee;
                const isPositive = netValue > 0;
                
                return (
                  <div
                    key={card.lastFour}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-8 rounded bg-gradient-to-br ${card.color}`} />
                      <div>
                        <p className="font-medium">{card.name}</p>
                        <p className="text-sm text-muted-foreground">Annual Fee: ${card.annualFee}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
                        {isPositive ? "+" : "-"}${Math.abs(netValue).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Net Annual Value</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
