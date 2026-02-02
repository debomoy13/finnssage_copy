/**
 * Finnhub API Service
 * Provides real-time stock data from global markets including BSE, NSE, NYSE, NASDAQ, etc.
 */

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || '';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockQuote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
    t: number; // Timestamp
}

export interface CompanyProfile {
    country: string;
    currency: string;
    exchange: string;
    ipo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
    logo: string;
    finnhubIndustry: string;
}

export interface StockCandle {
    c: number[]; // Close prices
    h: number[]; // High prices
    l: number[]; // Low prices
    o: number[]; // Open prices
    s: string; // Status
    t: number[]; // Timestamps
    v: number[]; // Volume
}

export interface RecommendationTrend {
    buy: number;
    hold: number;
    period: string;
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}

export interface StockSymbol {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
    currency?: string;
}

class FinnhubService {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = FINNHUB_API_KEY;
        this.baseUrl = FINNHUB_BASE_URL;
    }

    private async fetchAPI(endpoint: string, params: Record<string, string> = {}): Promise<any> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('token', this.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Finnhub API error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Finnhub API error:', error);
            throw error;
        }
    }

    /**
     * Get real-time quote for a stock symbol
     */
    async getQuote(symbol: string): Promise<StockQuote> {
        return this.fetchAPI('/quote', { symbol });
    }

    /**
     * Get company profile
     */
    async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
        return this.fetchAPI('/stock/profile2', { symbol });
    }

    /**
     * Get historical candle data
     * @param resolution - Supported resolutions: 1, 5, 15, 30, 60, D, W, M
     */
    async getCandles(
        symbol: string,
        resolution: string = 'D',
        from: number,
        to: number
    ): Promise<StockCandle> {
        return this.fetchAPI('/stock/candle', {
            symbol,
            resolution,
            from: from.toString(),
            to: to.toString(),
        });
    }

    /**
     * Get recommendation trends
     */
    async getRecommendationTrends(symbol: string): Promise<RecommendationTrend[]> {
        return this.fetchAPI('/stock/recommendation', { symbol });
    }

    /**
     * Get list of supported stocks for an exchange
     * @param exchange - Exchange code (e.g., 'US', 'NSE', 'BSE')
     */
    async getStockSymbols(exchange: string): Promise<StockSymbol[]> {
        return this.fetchAPI('/stock/symbol', { exchange });
    }

    /**
     * Search for stock symbols
     */
    async searchSymbol(query: string): Promise<{ result: StockSymbol[] }> {
        return this.fetchAPI('/search', { q: query });
    }

    /**
     * Get basic financials
     */
    async getBasicFinancials(symbol: string): Promise<any> {
        return this.fetchAPI('/stock/metric', { symbol, metric: 'all' });
    }

    /**
     * Get market news
     */
    async getMarketNews(category: string = 'general'): Promise<any[]> {
        return this.fetchAPI('/news', { category });
    }

    /**
     * Get company news
     */
    async getCompanyNews(symbol: string, from: string, to: string): Promise<any[]> {
        return this.fetchAPI('/company-news', { symbol, from, to });
    }

    /**
     * Get popular Indian stocks (NSE/BSE)
     */
    getPopularIndianStocks(): string[] {
        return [
            'RELIANCE.NS',  // Reliance Industries
            'TCS.NS',       // Tata Consultancy Services
            'HDFCBANK.NS',  // HDFC Bank
            'INFY.NS',      // Infosys
            'ICICIBANK.NS', // ICICI Bank
            'HINDUNILVR.NS', // Hindustan Unilever
            'ITC.NS',       // ITC Limited
            'SBIN.NS',      // State Bank of India
            'BHARTIARTL.NS', // Bharti Airtel
            'KOTAKBANK.NS', // Kotak Mahindra Bank
        ];
    }

    /**
     * Get popular US stocks
     */
    getPopularUSStocks(): string[] {
        return [
            'AAPL',  // Apple
            'MSFT',  // Microsoft
            'GOOGL', // Alphabet
            'AMZN',  // Amazon
            'NVDA',  // NVIDIA
            'TSLA',  // Tesla
            'META',  // Meta
            'BRK.B', // Berkshire Hathaway
            'JPM',   // JPMorgan Chase
            'V',     // Visa
        ];
    }

    /**
     * Format symbol for display
     */
    formatSymbol(symbol: string): { ticker: string; exchange: string } {
        if (symbol.includes('.NS')) {
            return { ticker: symbol.replace('.NS', ''), exchange: 'NSE' };
        } else if (symbol.includes('.BO')) {
            return { ticker: symbol.replace('.BO', ''), exchange: 'BSE' };
        }
        return { ticker: symbol, exchange: 'US' };
    }
}

export const finnhubService = new FinnhubService();
export default finnhubService;
