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
import { CreditCardList } from "@/components/cards/CreditCardList";

const cards: any[] = [];


const categoryOptimization = [
  { category: "Dining", currentCard: "Chase Sapphire", optimalCard: "AMEX Gold", currentRate: "3x", optimalRate: "4x", monthlySpend: 450, potentialGain: 45 },
  { category: "Groceries", currentCard: "Chase Sapphire", optimalCard: "AMEX Gold", currentRate: "1x", optimalRate: "4x", monthlySpend: 600, potentialGain: 180 },
  { category: "Travel", currentCard: "Chase Sapphire", optimalCard: "Venture X", currentRate: "2x", optimalRate: "10x", monthlySpend: 200, potentialGain: 160 },
  { category: "Gas", currentCard: "Various", optimalCard: "Costco Visa", currentRate: "1x", optimalRate: "4x", monthlySpend: 180, potentialGain: 54 },
];

export default function CreditOptimizer() {
  return (
    <DashboardLayout title="Credit Card Optimizer" subtitle="Maximize your rewards across all cards">
      <div className="space-y-6">
        {/* Credit Cards Management */}
        <CreditCardList />
      </div>
    </DashboardLayout>
  );
}
