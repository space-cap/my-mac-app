import { MouseEvent, useMemo, useState } from 'react'
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

const watchRows = [
  ['005930', '삼성전자', '79,600', '+1.14%'],
  ['000660', 'SK하이닉스', '186,200', '+2.42%'],
  ['035420', 'NAVER', '214,500', '-0.70%'],
  ['035720', '카카오', '58,100', '+0.35%'],
  ['207940', '삼성바이오', '832,000', '-1.07%'],
  ['068270', '셀트리온', '184,300', '+0.88%'],
]

const orderRows = [
  ['79,900', '5,210', 'ask'],
  ['79,800', '8,020', 'ask'],
  ['79,700', '11,432', 'ask'],
  ['79,600', '14,820', 'now'],
  ['79,500', '7,384', 'bid'],
  ['79,400', '10,692', 'bid'],
  ['79,300', '6,905', 'bid'],
]

const newsItems = [
  '반도체 대형주 강세, 외국인 순매수 확대',
  '환율 1,320원대 초반 등락, 수출주 변동성 확대',
  'AI 서버 투자 기대감에 장중 고점 재시도',
  '오후장 기관 매수세 유입 종목 선별 필요',
]

function App() {
  const [panels, setPanels] = useState(initialPanels)
  const [dragState, setDragState] = useState<DragState | null>(null)

  const maxZ = useMemo(() => Math.max(...panels.map((panel) => panel.z)), [panels])

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
          <span>KOSPI 2,731.42 ▲ 0.84%</span>
          <span>USD/KRW 1,326.20 ▼ 0.18%</span>
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
            {!panel.minimized && <div className="panel-body">{renderPanel(panel.id)}</div>}
          </article>
        ))}
      </section>
    </main>
  )
}

function renderPanel(id: PanelId) {
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
            {watchRows.map(([code, name, price, change]) => (
              <tr key={code}>
                <td>{code}</td>
                <td>{name}</td>
                <td>{price}</td>
                <td className={change.startsWith('+') ? 'up' : 'down'}>{change}</td>
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
            {Array.from({ length: 18 }).map((_, index) => (
              <i
                className={index % 3 === 0 ? 'candle down-candle' : 'candle up-candle'}
                key={index}
                style={{ height: 42 + ((index * 17) % 84) }}
              />
            ))}
          </div>
        </div>
      )
    case 'orderbook':
      return (
        <div className="orderbook">
          {orderRows.map(([price, volume, type]) => (
            <div className={`quote-row ${type}`} key={`${price}-${type}`}>
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
            <input value="005930 삼성전자" readOnly />
          </label>
          <label>
            수량
            <input value="10" readOnly />
          </label>
          <label>
            가격
            <input value="79,600" readOnly />
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
          {newsItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'account':
      return (
        <div className="account">
          <dl>
            <div>
              <dt>총평가</dt>
              <dd>42,810,000</dd>
            </div>
            <div>
              <dt>평가손익</dt>
              <dd className="up">+1,284,000</dd>
            </div>
            <div>
              <dt>주문가능</dt>
              <dd>8,500,000</dd>
            </div>
          </dl>
        </div>
      )
  }
}

export default App
