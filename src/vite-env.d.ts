/// <reference types="vite/client" />

type WatchlistItem = {
  code: string
  name: string
  price: string
  changeRate: string
}

type OrderbookRow = {
  price: string
  volume: string
  side: 'ask' | 'bid' | 'now'
}

type NewsItem = {
  id: string
  title: string
}

type AccountSummary = {
  totalValue: string
  profitLoss: string
  orderableCash: string
}

type ChartCandle = {
  id: string
  height: number
  direction: 'up' | 'down'
}

type MarketSnapshot = {
  marketSummary: {
    kospi: string
    kospiChange: string
    usdKrw: string
    usdKrwChange: string
  }
  watchlist: WatchlistItem[]
  orderbook: OrderbookRow[]
  news: NewsItem[]
  account: AccountSummary
  selectedSymbol: {
    code: string
    name: string
    price: string
  }
  chartCandles: ChartCandle[]
}

interface Window {
  marketApi?: {
    getSnapshot(): Promise<MarketSnapshot>
  }
}
