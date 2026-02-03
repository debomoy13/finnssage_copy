const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
const SITE_NAME = 'FinSage';

// Using a powerful, cost-effective model via OpenRouter
const MODEL = "google/gemini-2.0-flash-exp:free";

async function openRouterCall(messages: any[]) {
    if (!API_KEY) {
        console.warn("OpenRouter API Key missing. Please add VITE_OPENROUTER_API_KEY to .env.local");
        return null;
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": MODEL,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1000
            })
        });

        if (!response.ok) {
            console.error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error("OpenRouter Request Failed:", error);
        return null;
    }
}

export const aiService = {
    async generateResponse(prompt: string, context?: string) {
        const result = await openRouterCall([
            {
                role: "system",
                content: `You are FinSage, an expert AI financial advisor.
                Context Data: ${context || "No specific stock context provided."}
                Instructions: Be concise, professional, and helpful. Use formatting (bullet points, bold text). Focus on financial insights.`
            },
            { role: "user", content: prompt }
        ]);

        return result || "I'm running in offline mode. Please add your VITE_OPENROUTER_API_KEY to .env.local to unlock my full potential!";
    },

    // Used for the "Agent Walkthrough" Mode (7 Step Guide)
    async generateAgentWalkthrough(stock: any, profile: any) {
        if (!API_KEY) return null;

        try {
            const prompt = `
Generate 7 short, punchy, emoji-rich insights for a guided interaction with ${stock.symbol} (Price: ${stock.price}).
User Risk Profile: ${profile.riskTolerance}.

Steps:
1. Sentiment (bull/bear)
2. Technicals (RSI/MACD)
3. Trend (Moving Averages)
4. Volume Analysis
5. Sector Outlook
6. Risk Assessment
7. Trade Recommendation

Format: Return ONLY the 7 lines separated by newlines. No numbers.
            `;

            const text = await openRouterCall([{ role: "user", content: prompt }]);
            if (!text) return null;
            return text.split('\n').filter((line: string) => line.length > 5).slice(0, 7);
        } catch (e) {
            console.error("AI Agent Error:", e);
            return null;
        }
    },

    // Used for the "AI Analysis" Panel (Buy/Sell Rec)
    async analyzeStock(stock: any) {
        if (!API_KEY) return null;

        try {
            const prompt = `
Analyze ${stock.symbol} (Price: ${stock.price}, Sector: ${stock.sector || 'Equity'}).
Provide:
1. Recommendation (BUY/SELL/HOLD)
2. Confidence (0-100)
3. 4 Key Bullet Points (Insights)

Return JSON format ONLY:
{
    "recommendation": "BUY",
    "confidence": 85,
    "insights": ["Insight 1", "Insight 2", "Insight 3", "Insight 4"]
}
            `;

            const text = await openRouterCall([{ role: "user", content: prompt }]);
            if (!text) return null;

            // Clean markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                return JSON.parse(jsonStr);
            } catch (jsonError) {
                console.warn("AI returned non-JSON:", text);
                return null;
            }
        } catch (e) {
            console.error("AI Analysis Error:", e);
            return null;
        }
    }
};

export default aiService;
