import { tool } from "ai";
import { z } from "zod";

export const stockPriceTool = tool({
  description: "Get the current stock price for a given company symbol.",
  inputSchema: z.object({
    symbol: z
      .string()
      .describe(
        "The company stock symbol to get the price for (e.g., AAPL, NVDA)"
      ),
  }),
  execute: async function ({ symbol }) {
    console.log("Fetching current price for symbol:", symbol);
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`
      );

      const data = await response.json();

      const result = data.chart.result[0];

      // Yahoo Finance puts the current price in the 'meta' object
      const currentPrice = result.meta.regularMarketPrice;
      const currency = result.meta.currency;
      const previousClose = result.meta.chartPreviousClose;

      return {
        symbol: symbol.toUpperCase(),
        price: currentPrice,
        currency,
        previousClose,
      };
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return {
        symbol: symbol.toUpperCase(),
        price: 0,
        currency: "USD",
        previousClose: 0,
        error: "Failed to fetch price",
      };
    }
  },
});

export const stockChartTool = tool({
  description:
    "Display the stock chart for a stock symbol for a given range, If no range is provided or just show chart of apple stock, the default is 1y",
  inputSchema: z.object({
    symbol: z
      .string()
      .describe("The company stock symbol to get the stock price for"),
    range: z
      .string()
      .describe(
        "The range of the stock price to get: 1 year is 1y, 5 years is 5y, 1 month is 1mo, 3 months is 3mo, 6 months is 6mo, 1 day is 1d, max is max, year to date is ytd. Default is 1y if not specified."
      ),
  }),
  execute: async function ({ symbol, range = "1y" }) {
    console.log("Fetching stock price for symbol:", symbol);
    try {
      if (range === "1d") {
        range = "1y";
      }
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=1d`
      );
      const data = await response.json();
      const timestamp = data.chart.result[0].timestamp;
      const prices = data.chart.result[0].indicators.quote[0].close;
      const stockPrice = prices[prices.length - 1];
      return { stockPrice, prices, timestamp, symbol };
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return { stockPrice: 0, symbol };
    }
  },
});

export const cryptoPriceTool = tool({
  description:
    "Get the current price for a cryptocurrency (e.g., Bitcoin, Ethereum, SOL).",
  inputSchema: z.object({
    symbol: z
      .string()
      .describe(
        "The cryptocurrency ticker symbol (e.g., BTC, ETH, SOL, DOGE)."
      ),
  }),
  execute: async function ({ symbol }) {
    // 1. Normalize symbol for Yahoo Finance (BTC -> BTC-USD)
    let formattedSymbol = symbol.toUpperCase();
    if (!formattedSymbol.endsWith("-USD")) {
      formattedSymbol = `${formattedSymbol}-USD`;
    }

    console.log("Fetching crypto price for:", formattedSymbol);

    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?range=1d&interval=1d`
      );
      const data = await response.json();

      // Check if data exists
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error("Symbol not found");
      }

      const result = data.chart.result[0];
      const meta = result.meta;

      const currentPrice = meta.regularMarketPrice;
      const currency = meta.currency;
      const previousClose = meta.chartPreviousClose; // Useful for calculating 24h change

      return {
        symbol: formattedSymbol.replace("-USD", ""), // Return clean symbol (BTC)
        price: currentPrice,
        currency,
        previousClose,
        logoUrl: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${symbol.toLowerCase()}.png`, // Fallback logic for logos often works with standard tickers
      };
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return {
        symbol: symbol.toUpperCase(),
        price: 0,
        error: "Failed to fetch price",
      };
    }
  },
});

export const cryptoChartTool = tool({
  description:
    "Display a historical price chart for a cryptocurrency over a specific period of time.",
  inputSchema: z.object({
    symbol: z
      .string()
      .describe(
        "The cryptocurrency ticker symbol (e.g., BTC, ETH, SOL, DOGE)."
      ),
    range: z
      .string()
      .optional()
      .describe(
        "The time range for the chart. Valid options: 1d, 5d, 1mo, 3mo, 6mo, 1y, ytd, max. Default is '1mo' if not specified."
      ),
  }),
  execute: async function ({ symbol, range = "1mo" }) {
    // 1. Normalize symbol (BTC -> BTC-USD) for Yahoo API
    let formattedSymbol = symbol.toUpperCase();
    if (!formattedSymbol.endsWith("-USD")) {
      formattedSymbol = `${formattedSymbol}-USD`;
    }

    // 2. Determine appropriate interval based on range to avoid oversized payloads
    let interval = "1d";
    if (range === "1d" || range === "5d") {
      interval = "60m"; // Higher resolution for short timeframes
    }

    console.log(
      `Fetching crypto chart: ${formattedSymbol}, Range: ${range}, Interval: ${interval}`
    );

    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?range=${range}&interval=${interval}`
      );
      const data = await response.json();

      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error(`No chart data found for ${symbol}`);
      }

      const result = data.chart.result[0];
      const quote = result.indicators.quote[0];
      const meta = result.meta;

      // Basic validation
      if (!result.timestamp || !quote.close) {
        throw new Error("Incomplete data received");
      }

      return {
        symbol: formattedSymbol.replace("-USD", ""), // Return clean symbol to UI (BTC)
        prices: quote.close as (number | null)[],
        timestamp: result.timestamp as number[],
        currentPrice: meta.regularMarketPrice,
        currency: meta.currency,
        rangeUsed: range,
      };
    } catch (error) {
      console.error("Error fetching crypto chart:", error);
      // Return structured error info so the UI can display a nice message
      return {
        symbol: symbol.toUpperCase(),
        prices: [],
        timestamp: [],
        currentPrice: 0,
        error: "Failed to load historical data.",
      };
    }
  },
});

export const newsTool = tool({
  description:
    "Get the latest news headlines for a specific stock, cryptocurrency, or company.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The stock symbol, crypto ticker, or company name to search for (e.g., AAPL, Bitcoin, Tesla)."
      ),
  }),
  execute: async function ({ query }) {
    console.log("Fetching news for:", query);

    try {
      // Yahoo Finance Search API returns news alongside quotes
      const response = await fetch(
        `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`
      );
      const data = await response.json();

      if (!data.news || data.news.length === 0) {
        return { query, news: [] };
      }

      // Format the news items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newsItems = data.news.slice(0, 5).map((item: any) => ({
        uuid: item.uuid,
        title: item.title,
        publisher: item.publisher,
        link: item.link,
        // Convert unix timestamp to readable date
        publishTime: new Date(item.providerPublishTime * 1000).toLocaleString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        ),
        thumbnail: item.thumbnail?.resolutions?.[0]?.url || null, // Get first available thumbnail
      }));

      return {
        query,
        news: newsItems,
      };
    } catch (error) {
      console.error("Error fetching news:", error);
      return { query, news: [], error: "Failed to fetch news." };
    }
  },
});

export const sentimentTool = tool({
  description:
    "Get the current 'Fear & Greed' sentiment index for the crypto market. Score ranges from 0 (Extreme Fear) to 100 (Extreme Greed).",
  inputSchema: z.object({
    // Input is optional since this is a global market index
    dummy: z
      .string()
      .optional()
      .describe(
        "Ignored parameter, just to satisfy schema requirements if needed."
      ),
  }),
  execute: async function () {
    console.log("Fetching Crypto Fear & Greed Index...");
    try {
      const response = await fetch("https://api.alternative.me/fng/?limit=1");
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error("No data received");
      }

      const result = data.data[0];

      return {
        value: parseInt(result.value),
        classification: result.value_classification,
        timestamp: parseInt(result.timestamp),
        timeUntilUpdate: parseInt(result.time_until_update),
      };
    } catch (error) {
      console.error("Error fetching sentiment:", error);
      return {
        value: 50,
        classification: "Neutral",
        error: "Failed to fetch sentiment",
      };
    }
  },
});

export const cryptoHeatmapTool = tool({
  description:
    "Display a market heatmap of top cryptocurrencies showing their current price and 24h percentage change.",
  inputSchema: z.object({
    limit: z
      .number()
      .optional()
      .describe("Number of top coins to display (default 15)."),
  }),
  execute: async function ({ limit = 15 }) {
    console.log("Fetching heatmap via CoinGecko...");
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error("CoinGecko rate limit or error");
      }

      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heatmapData = data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        changePercent: coin.price_change_percentage_24h ?? 0, // Handle nulls safely
        shortName: coin.name,
      }));

      return { coins: heatmapData };
    } catch (error) {
      console.error("Heatmap Error:", error);
      return { coins: [], error: "Failed to load heatmap data." };
    }
  },
});

export const currencyConverterTool = tool({
  description:
    "Convert a specific amount of money from one currency to another (e.g., 100 USD to EUR).",
  inputSchema: z.object({
    from: z.string().describe("Source currency code (e.g., USD, EUR, INR)"),
    to: z.string().describe("Target currency code (e.g., JPY, GBP, CAD)"),
    amount: z.number().describe("The amount to convert"),
  }),
  execute: async function ({ from, to, amount }) {
    try {
      const base = from.toUpperCase();
      const target = to.toUpperCase();

      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${target}`
      );
      const data = await response.json();

      return {
        from: base,
        to: target,
        amount: amount,
        convertedAmount: data.rates[target],
        date: data.date,
      };
    } catch {
      return { error: "Failed to convert currency" };
    }
  },
});

export const companyProfileTool = tool({
  description:
    "Get key fundamental data (PE Ratio, Market Cap, Description, Sector) for a stock.",
  inputSchema: z.object({
    symbol: z.string().describe("Stock symbol (e.g., AAPL, NVDA, TSLA)."),
  }),
  execute: async function ({ symbol }) {
    console.log("Fetching profile from FMP (Stable) for:", symbol);

    const API_KEY = process.env.FMP_API_KEY || "";

    try {
      // UPDATED ENDPOINT: Uses /stable/ instead of /api/v3/
      const response = await fetch(
        `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No data found for this symbol");
      }

      const profile = data[0];

      return {
        symbol: profile.symbol,
        name: profile.companyName,
        price: profile.price,
        currency: profile.currency,
        marketCap: profile.mktCap,
        peRatio: profile.lastDiv, // Using lastDiv as proxy if pe not explicit in this endpoint
        beta: profile.beta,
        volume: profile.volAvg,
        sector: profile.sector,
        industry: profile.industry,
        website: profile.website,
        description: profile.description,
        ceo: profile.ceo,
        logo: profile.image,
        exchange: profile.exchangeShortName,
      };
    } catch (error) {
      console.error("Error fetching company profile:", error);
      return {
        symbol: symbol.toUpperCase(),
        error: "Failed to load company fundamentals.",
      };
    }
  },
});

export const marketMoversTool = tool({
  description: "Get the top gaining or losing stocks in the market right now.",
  inputSchema: z.object({
    type: z
      .enum(["biggest-losers", "biggest-gainers"])
      .describe("Whether to fetch top 'gainers' or 'losers'."),
  }),
  execute: async function ({ type }) {
    console.log(`Fetching market ${type}...`);
    const API_KEY = process.env.FMP_API_KEY;

    try {
      const response = await fetch(
        `https://financialmodelingprep.com/stable/${type}?apikey=${API_KEY}`
      );
      const data = await response.json();

      // Take top 10 and format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const movers = data.slice(0, 5).map((item: any) => ({
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change: item.change,
        changePercent: item.changesPercentage,
      }));

      return { type, movers };
    } catch {
      return { type, movers: [], error: "Failed to fetch market data." };
    }
  },
});

// Export only the locally defined tools
export const localTools = {
  displayStockPrice: stockPriceTool,
  displayStockChart: stockChartTool,
  displayCryptoPrice: cryptoPriceTool,
  displayCryptoChart: cryptoChartTool,
  displayNews: newsTool,
  displayCryptoSentiment: sentimentTool,
  displayCryptoHeatmap: cryptoHeatmapTool,
  displayCurrencyConverted: currencyConverterTool,
  displayCompanyProfile: companyProfileTool,
  displayMarketMovers: marketMoversTool,
};
