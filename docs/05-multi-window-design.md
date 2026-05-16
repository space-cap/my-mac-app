# 5. 멀티 윈도우 설계

HTS의 "여러 창"은 두 가지 방식으로 설계할 수 있다.

## 1단계: 단일 BrowserWindow 내부의 가상 패널

현재 MVP 방식이다. 하나의 Electron 창 안에서 React 컴포넌트를 창처럼 배치한다.

장점:

- 구현 속도가 빠르다.
- 패널 간 상태 공유가 쉽다.
- 레이아웃 저장과 복원이 단순하다.
- 하나의 화면에서 HTS 느낌을 빠르게 검증할 수 있다.

단점:

- OS 레벨의 독립 창이 아니다.
- 다중 모니터로 패널을 따로 빼는 기능이 제한된다.
- 패널별 프로세스 격리가 없다.

적합한 범위:

- MVP
- 데모
- 단일 모니터 중심 사용
- 빠른 UI 검증

## 2단계: Electron BrowserWindow 기반 실제 멀티 윈도우

패널 일부를 OS 창으로 분리한다. 예를 들어 차트, 호가, 주문 창을 각각 별도 BrowserWindow로 띄울 수 있다.

장점:

- macOS 창 관리 기능을 그대로 활용할 수 있다.
- 다중 모니터 배치가 가능하다.
- 창 단위 성능 격리와 복구가 가능하다.
- 전문 HTS 사용자 경험에 더 가깝다.

단점:

- 창 간 상태 동기화가 복잡하다.
- IPC 설계가 필수다.
- 레이아웃 저장/복원 난도가 올라간다.
- 창 수가 늘면 리소스 관리가 중요해진다.

적합한 범위:

- MVP 이후
- 전문 사용자 모드
- 다중 모니터 지원
- 고급 차트/호가 분리

## 권장 설계

처음부터 모든 패널을 실제 BrowserWindow로 만들 필요는 없다. 30년차 개발자 관점에서 보면, 초기 제품의 위험은 기술 부족보다 "경계가 너무 빨리 복잡해지는 것"이다.

권장 순서:

1. React 내부 가상 패널로 화면 UX를 완성한다.
2. 패널 상태 모델을 독립적으로 정리한다.
3. 데이터 흐름을 중앙 Store 또는 서비스 계층으로 분리한다.
4. 차트/호가처럼 독립성이 높은 패널부터 실제 BrowserWindow 분리를 실험한다.
5. 창 위치와 크기를 로컬 설정으로 저장한다.
6. 마지막에 다중 모니터, 창 그룹, 워크스페이스 프리셋을 붙인다.

## 패널 상태 모델

각 패널은 최소한 다음 상태를 가진다.

```ts
type PanelState = {
  id: string
  type: 'watchlist' | 'chart' | 'orderbook' | 'order' | 'news' | 'account'
  title: string
  x: number
  y: number
  width: number
  height: number
  z: number
  minimized: boolean
  detached: boolean
}
```

`detached`가 `false`이면 React 내부 패널, `true`이면 Electron BrowserWindow로 분리된 창으로 볼 수 있다.
