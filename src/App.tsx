import { MouseEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

type PanelId = 'watchlist' | 'chart' | 'orderbook' | 'order' | 'news' | 'account'

type Panel = {
  id: PanelId
  title: string
  x: number
  y: number
  width: number
  height: number
  z: number
  minimized: boolean
}

type DragState = {
  id: PanelId
  offsetX: number
  offsetY: number
}

const initialPanels: Panel[] = [
  { id: 'watchlist', title: '관심종목', x: 18, y: 70, width: 250, height: 350, z: 1, minimized: false },
  { id: 'chart', title: '실시간 차트', x: 286, y: 70, width: 540, height: 350, z: 2, minimized: false },
  { id: 'orderbook', title: '호가', x: 844, y: 70, width: 310, height: 350, z: 3, minimized: false },
  { id: 'order', title: '주문', x: 18, y: 440, width: 390, height: 250, z: 4, minimized: false },
  { id: 'news', title: '뉴스', x: 426, y: 440, width: 400, height: 250, z: 5, minimized: false },
  { id: 'account', title: '계좌/잔고', x: 844, y: 440, width: 310, height: 250, z: 6, minimized: false },
]

function App() {
  const [panels, setPanels] = useState(initialPanels)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [marketSnapshot, setMarketSnapshot] = useState<MarketSnapshot | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)

  const maxZ = useMemo(() => Math.max(...panels.map((panel) => panel.z)), [panels])

  useEffect(() => {
    let active = true

    async function loadMarketSnapshot() {
      if (!window.marketApi) {
        setDataError('Electron Preload API를 찾을 수 없습니다.')
        return
      }

      try {
        const snapshot = await window.marketApi.getSnapshot()
        if (active) {
          setMarketSnapshot(snapshot)
          setDataError(null)
        }
      } catch {
        if (active) {
          setDataError('Main Process mock 데이터를 불러오지 못했습니다.')
        }
      }
    }

    loadMarketSnapshot()

    return () => {
      active = false
    }
  }, [])

  const focusPanel = (id: PanelId) => {
    setPanels((current) =>
      current.map((panel) => (panel.id === id ? { ...panel, z: maxZ + 1 } : panel)),
    )
  }

  const startDrag = (event: MouseEvent<HTMLElement>, panel: Panel) => {
    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    focusPanel(panel.id)
    setDragState({
      id: panel.id,
      offsetX: event.clientX - panel.x,
      offsetY: event.clientY - panel.y,
    })
  }

  const dragPanel = (event: MouseEvent<HTMLElement>) => {
    if (!dragState) {
      return
    }

    setPanels((current) =>
      current.map((panel) =>
        panel.id === dragState.id
          ? {
              ...panel,
              x: Math.max(8, event.clientX - dragState.offsetX),
              y: Math.max(52, event.clientY - dragState.offsetY),
            }
          : panel,
      ),
    )
  }

  const toggleMinimize = (id: PanelId) => {
    setPanels((current) =>
      current.map((panel) =>
        panel.id === id ? { ...panel, minimized: !panel.minimized, z: maxZ + 1 } : panel,
      ),
    )
  }

  const resetLayout = () => {
    setPanels(initialPanels)
  }

  return (
    <main
      className="terminal"
      onMouseMove={dragPanel}
      onMouseUp={() => setDragState(null)}
      onMouseLeave={() => setDragState(null)}
    >
      <header className="topbar">
        <div>
          <strong>Mac HTS Workspace</strong>
          {marketSnapshot ? (
            <>
              <span>
                KOSPI {marketSnapshot.marketSummary.kospi} ▲{' '}
                {marketSnapshot.marketSummary.kospiChange.replace('+', '')}
              </span>
              <span>
                USD/KRW {marketSnapshot.marketSummary.usdKrw} ▼{' '}
                {marketSnapshot.marketSummary.usdKrwChange.replace('-', '')}
              </span>
            </>
          ) : (
            <span>{dataError ?? 'Main Process 데이터 로딩 중'}</span>
          )}
        </div>
        <button className="ghost-button" onClick={resetLayout}>
          레이아웃 초기화
        </button>
      </header>

      <section className="workspace" aria-label="HTS 다중 창 작업영역">
        {panels.map((panel) => (
          <article
            className={`panel ${panel.minimized ? 'is-minimized' : ''}`}
            key={panel.id}
            style={{
              left: panel.x,
              top: panel.y,
              width: panel.width,
              height: panel.minimized ? 42 : panel.height,
              zIndex: panel.z,
            }}
            onMouseDown={() => focusPanel(panel.id)}
          >
            <header className="panel-titlebar" onMouseDown={(event) => startDrag(event, panel)}>
              <span>{panel.title}</span>
              <div className="window-controls">
                <button aria-label={`${panel.title} 최소화`} onClick={() => toggleMinimize(panel.id)}>
                  _
                </button>
                <button aria-label={`${panel.title} 앞으로 가져오기`} onClick={() => focusPanel(panel.id)}>
                  □
                </button>
              </div>
            </header>
            {!panel.minimized && <div className="panel-body">{renderPanel(panel.id, marketSnapshot, dataError)}</div>}
          </article>
        ))}
      </section>
    </main>
  )
}

function renderPanel(id: PanelId, marketSnapshot: MarketSnapshot | null, dataError: string | null) {
  if (!marketSnapshot) {
    return <p className="empty-state">{dataError ?? 'Main Process에서 mock 데이터를 불러오는 중입니다.'}</p>
  }

  switch (id) {
    case 'watchlist':
      return (
        <table className="market-table">
          <thead>
            <tr>
              <th>코드</th>
              <th>종목</th>
              <th>현재가</th>
              <th>등락</th>
            </tr>
          </thead>
          <tbody>
            {marketSnapshot.watchlist.map(({ code, name, price, changeRate }) => (
              <tr key={code}>
                <td>{code}</td>
                <td>{name}</td>
                <td>{price}</td>
                <td className={changeRate.startsWith('+') ? 'up' : 'down'}>{changeRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'chart':
      return (
        <div className="chart-panel">
          <div className="chart-toolbar">
            <button>1분</button>
            <button>5분</button>
            <button>일봉</button>
            <button>주봉</button>
          </div>
          <div className="chart-grid">
            <div className="chart-line" />
            {marketSnapshot.chartCandles.map((candle) => (
              <i
                className={candle.direction === 'up' ? 'candle up-candle' : 'candle down-candle'}
                key={candle.id}
                style={{ height: candle.height }}
              />
            ))}
          </div>
        </div>
      )
    case 'orderbook':
      return (
        <div className="orderbook">
          {marketSnapshot.orderbook.map(({ price, volume, side }) => (
            <div className={`quote-row ${side}`} key={`${price}-${side}`}>
              <span>{price}</span>
              <strong>{volume}</strong>
            </div>
          ))}
        </div>
      )
    case 'order':
      return (
        <form className="order-form">
          <label>
            종목
            <input value={`${marketSnapshot.selectedSymbol.code} ${marketSnapshot.selectedSymbol.name}`} readOnly />
          </label>
          <label>
            수량
            <input value="10" readOnly />
          </label>
          <label>
            가격
            <input value={marketSnapshot.selectedSymbol.price} readOnly />
          </label>
          <div className="order-actions">
            <button type="button" className="buy">
              매수
            </button>
            <button type="button" className="sell">
              매도
            </button>
          </div>
        </form>
      )
    case 'news':
      return (
        <ul className="news-list">
          {marketSnapshot.news.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )
    case 'account':
      return (
        <div className="account">
          <dl>
            <div>
              <dt>총평가</dt>
              <dd>{marketSnapshot.account.totalValue}</dd>
            </div>
            <div>
              <dt>평가손익</dt>
              <dd className="up">{marketSnapshot.account.profitLoss}</dd>
            </div>
            <div>
              <dt>주문가능</dt>
              <dd>{marketSnapshot.account.orderableCash}</dd>
            </div>
          </dl>
        </div>
      )
  }
}

export default App
