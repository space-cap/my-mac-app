export type WatchlistItem = {
  code: string
  name: string
  price: string
  changeRate: string
}

export type OrderbookRow = {
  price: string
  volume: string
  side: 'ask' | 'bid' | 'now'
}

export type NewsItem = {
  id: string
  title: string
}

export type AccountSummary = {
  totalValue: string
  profitLoss: string
  orderableCash: string
}

export type ChartCandle = {
  id: string
  height: number
  direction: 'up' | 'down'
}

export type MarketSnapshot = {
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

const snapshot: MarketSnapshot = {
  marketSummary: {
    kospi: '2,731.42',
    kospiChange: '+0.84%',
    usdKrw: '1,326.20',
    usdKrwChange: '-0.18%',
  },
  watchlist: [
    { code: '005930', name: '삼성전자', price: '79,600', changeRate: '+1.14%' },
    { code: '000660', name: 'SK하이닉스', price: '186,200', changeRate: '+2.42%' },
    { code: '035420', name: 'NAVER', price: '214,500', changeRate: '-0.70%' },
    { code: '035720', name: '카카오', price: '58,100', changeRate: '+0.35%' },
    { code: '207940', name: '삼성바이오', price: '832,000', changeRate: '-1.07%' },
    { code: '068270', name: '셀트리온', price: '184,300', changeRate: '+0.88%' },
  ],
  orderbook: [
    { price: '79,900', volume: '5,210', side: 'ask' },
    { price: '79,800', volume: '8,020', side: 'ask' },
    { price: '79,700', volume: '11,432', side: 'ask' },
    { price: '79,600', volume: '14,820', side: 'now' },
    { price: '79,500', volume: '7,384', side: 'bid' },
    { price: '79,400', volume: '10,692', side: 'bid' },
    { price: '79,300', volume: '6,905', side: 'bid' },
  ],
  news: [
    { id: 'n1', title: '반도체 대형주 강세, 외국인 순매수 확대' },
    { id: 'n2', title: '환율 1,320원대 초반 등락, 수출주 변동성 확대' },
    { id: 'n3', title: 'AI 서버 투자 기대감에 장중 고점 재시도' },
    { id: 'n4', title: '오후장 기관 매수세 유입 종목 선별 필요' },
  ],
  account: {
    totalValue: '42,810,000',
    profitLoss: '+1,284,000',
    orderableCash: '8,500,000',
  },
  selectedSymbol: {
    code: '005930',
    name: '삼성전자',
    price: '79,600',
  },
  chartCandles: Array.from({ length: 18 }, (_, index) => ({
    id: `candle-${index}`,
    height: 42 + ((index * 17) % 84),
    direction: index % 3 === 0 ? 'down' : 'up',
  })),
}

export function getMarketSnapshot(): MarketSnapshot {
  return snapshot
}
