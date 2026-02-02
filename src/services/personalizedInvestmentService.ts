/**
 * Personalized Investment Service
 * Analyzes user's financial health and provides tailored investment recommendations
 */

export interface UserFinancialProfile {
    monthlyIncome: number;
    monthlyExpenses: number;
    savings: number;
    investments: number;
    debts: number;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentGoals: string[];
    age: number;
    dependents: number;
}

export interface InvestmentRecommendation {
    symbol: string;
    name: string;
    recommendedAmount: number;
    reasoning: string[];
    riskLevel: 'low' | 'medium' | 'high';
    expectedReturn: string;
    timeHorizon: string;
    suitabilityScore: number; // 0-100
    personalizedInsights: string[];
}

export interface PortfolioAllocation {
    stocks: number;
    bonds: number;
    gold: number;
    cash: number;
}

class PersonalizedInvestmentService {
    /**
     * Calculate user's investable surplus
     */
    calculateInvestableSurplus(profile: UserFinancialProfile): number {
        const monthlySurplus = profile.monthlyIncome - profile.monthlyExpenses;
        const emergencyFundNeeded = profile.monthlyExpenses * 6; // 6 months emergency fund
        const currentEmergencyFund = profile.savings;

        if (currentEmergencyFund < emergencyFundNeeded) {
            // Prioritize emergency fund
            return Math.max(0, monthlySurplus * 0.3); // Only 30% for investment
        }

        return monthlySurplus * 0.7; // 70% available for investment
    }

    /**
     * Determine optimal portfolio allocation based on user profile
     */
    getOptimalAllocation(profile: UserFinancialProfile): PortfolioAllocation {
        const { riskTolerance, age } = profile;

        // Age-based allocation (100 - age rule)
        const equityPercentage = Math.min(100 - age, 80);

        let allocation: PortfolioAllocation;

        if (riskTolerance === 'conservative') {
            allocation = {
                stocks: Math.min(equityPercentage * 0.6, 40),
                bonds: 40,
                gold: 15,
                cash: 5,
            };
        } else if (riskTolerance === 'moderate') {
            allocation = {
                stocks: Math.min(equityPercentage * 0.8, 60),
                bonds: 25,
                gold: 10,
                cash: 5,
            };
        } else {
            allocation = {
                stocks: Math.min(equityPercentage, 75),
                bonds: 15,
                gold: 5,
                cash: 5,
            };
        }

        return allocation;
    }

    /**
     * Generate personalized stock recommendation
     */
    generateRecommendation(
        symbol: string,
        stockData: any,
        profile: UserFinancialProfile,
        marketSentiment: string
    ): InvestmentRecommendation {
        const investableSurplus = this.calculateInvestableSurplus(profile);
        const allocation = this.getOptimalAllocation(profile);

        // Calculate recommended investment amount
        const recommendedAmount = Math.min(
            investableSurplus * 0.2, // Max 20% in single stock
            investableSurplus * (allocation.stocks / 100)
        );

        // Generate personalized reasoning
        const reasoning = this.generateReasoning(profile, stockData, marketSentiment);
        const personalizedInsights = this.generatePersonalizedInsights(profile, stockData);

        // Calculate suitability score
        const suitabilityScore = this.calculateSuitability(profile, stockData);

        return {
            symbol,
            name: stockData.name || symbol,
            recommendedAmount,
            reasoning,
            riskLevel: this.assessRiskLevel(stockData),
            expectedReturn: this.estimateReturn(stockData),
            timeHorizon: this.recommendTimeHorizon(profile),
            suitabilityScore,
            personalizedInsights,
        };
    }

    private generateReasoning(
        profile: UserFinancialProfile,
        stockData: any,
        sentiment: string
    ): string[] {
        const reasons: string[] = [];

        // Financial health based reasoning
        const surplus = this.calculateInvestableSurplus(profile);
        if (surplus > 0) {
            reasons.push(`✅ You have ₹${surplus.toLocaleString()} monthly surplus available for investment`);
        } else {
            reasons.push(`⚠️ Limited surplus detected. Focus on building emergency fund first`);
        }

        // Risk alignment
        if (profile.riskTolerance === 'conservative' && stockData.beta < 1) {
            reasons.push(`✅ Low volatility (Beta: ${stockData.beta}) aligns with your conservative profile`);
        } else if (profile.riskTolerance === 'aggressive' && stockData.beta > 1.2) {
            reasons.push(`✅ Higher volatility matches your aggressive risk appetite`);
        }

        // Age-based reasoning
        if (profile.age < 35) {
            reasons.push(`✅ Your age (${profile.age}) allows for long-term growth-focused investments`);
        } else if (profile.age > 50) {
            reasons.push(`⚠️ Consider stability and dividend-paying stocks given your age (${profile.age})`);
        }

        // Market sentiment
        reasons.push(`📊 Market sentiment: ${sentiment}`);

        return reasons;
    }

    private generatePersonalizedInsights(
        profile: UserFinancialProfile,
        stockData: any
    ): string[] {
        const insights: string[] = [];

        // Debt consideration
        if (profile.debts > profile.monthlyIncome * 3) {
            insights.push(`💡 Consider paying down high-interest debt before aggressive investing`);
        }

        // Emergency fund
        const emergencyFundNeeded = profile.monthlyExpenses * 6;
        if (profile.savings < emergencyFundNeeded) {
            insights.push(`💡 Build emergency fund to ₹${emergencyFundNeeded.toLocaleString()} first`);
        }

        // Diversification
        insights.push(`💡 This should be part of a diversified portfolio, not your only investment`);

        // Tax efficiency
        if (profile.monthlyIncome > 100000) {
            insights.push(`💡 Consider tax-saving instruments like ELSS for additional benefits`);
        }

        return insights;
    }

    private calculateSuitability(profile: UserFinancialProfile, stockData: any): number {
        let score = 50; // Base score

        // Risk alignment
        if (profile.riskTolerance === 'conservative' && stockData.beta < 1) score += 20;
        if (profile.riskTolerance === 'aggressive' && stockData.beta > 1.2) score += 20;
        if (profile.riskTolerance === 'moderate' && stockData.beta >= 0.8 && stockData.beta <= 1.2) score += 20;

        // Financial health
        const surplus = this.calculateInvestableSurplus(profile);
        if (surplus > profile.monthlyIncome * 0.3) score += 15;

        // Age appropriateness
        if (profile.age < 40 && stockData.growthPotential === 'high') score += 15;
        if (profile.age > 50 && stockData.dividendYield > 2) score += 15;

        return Math.min(100, Math.max(0, score));
    }

    private assessRiskLevel(stockData: any): 'low' | 'medium' | 'high' {
        if (stockData.beta < 0.8) return 'low';
        if (stockData.beta > 1.3) return 'high';
        return 'medium';
    }

    private estimateReturn(stockData: any): string {
        // Simplified return estimation
        if (stockData.growthRate > 15) return '15-20% annually';
        if (stockData.growthRate > 10) return '10-15% annually';
        return '8-12% annually';
    }

    private recommendTimeHorizon(profile: UserFinancialProfile): string {
        if (profile.age < 35) return '5-10 years (Long-term)';
        if (profile.age < 50) return '3-5 years (Medium-term)';
        return '1-3 years (Short to Medium-term)';
    }

    /**
     * Generate AI chat response explaining the recommendation
     */
    generateChatExplanation(
        recommendation: InvestmentRecommendation,
        profile: UserFinancialProfile,
        userQuestion?: string
    ): string {
        if (userQuestion) {
            // Handle specific questions
            if (userQuestion.toLowerCase().includes('why')) {
                return `I recommended ${recommendation.symbol} because:\n\n${recommendation.reasoning.join('\n')}\n\nYour suitability score is ${recommendation.suitabilityScore}/100, which means this is a ${recommendation.suitabilityScore > 70 ? 'great' : 'moderate'} fit for your profile.`;
            }
            if (userQuestion.toLowerCase().includes('risk')) {
                return `This stock has ${recommendation.riskLevel} risk. ${recommendation.personalizedInsights[0]}`;
            }
            if (userQuestion.toLowerCase().includes('amount')) {
                return `Based on your monthly surplus of ₹${this.calculateInvestableSurplus(profile).toLocaleString()}, I recommend investing ₹${recommendation.recommendedAmount.toLocaleString()} in ${recommendation.symbol}. This is ${((recommendation.recommendedAmount / this.calculateInvestableSurplus(profile)) * 100).toFixed(0)}% of your investable amount.`;
            }
        }

        // Default explanation
        return `Based on your financial profile:\n• Monthly Income: ₹${profile.monthlyIncome.toLocaleString()}\n• Risk Tolerance: ${profile.riskTolerance}\n• Age: ${profile.age}\n\nI recommend ${recommendation.symbol} with an investment of ₹${recommendation.recommendedAmount.toLocaleString()}. This aligns with your ${recommendation.riskLevel} risk appetite and has an expected return of ${recommendation.expectedReturn}.`;
    }
}

export const personalizedInvestmentService = new PersonalizedInvestmentService();
export default personalizedInvestmentService;
