# 6. 데이터 흐름

MVP의 데이터는 정적 데모 데이터다. 하지만 이후 실제 서비스를 붙이기 위해서는 화면과 데이터 소스를 지금부터 분리해서 생각해야 한다.

## MVP 데이터 흐름

```text
React 컴포넌트
  -> 로컬 데모 데이터
  -> 패널 UI 렌더링
```

현재는 `src/App.tsx` 안에 관심종목, 호가, 뉴스 데이터가 직접 들어 있다. 이는 MVP 화면 검증에는 충분하지만, 다음 단계에서는 분리해야 한다.

## 권장 데이터 흐름

```text
External API / Mock Server
  -> Main Process Service
  -> IPC
  -> Preload API
  -> Renderer Store
  -> Panel Components
```

## 계층별 책임

Main Process Service:

- 외부 API 연결
- 인증 토큰 관리
- WebSocket 연결 관리
- 로컬 저장소 접근
- 장애 복구 및 재연결

Preload API:

- Renderer에 허용된 기능만 노출
- IPC 호출 래핑
- 타입이 정해진 API 제공

Renderer Store:

- 화면 상태 관리
- 종목 선택 상태
- 패널 레이아웃 상태
- 최신 시세 스냅샷
- 주문 입력 상태

Panel Components:

- 데이터를 화면에 표현
- 사용자 입력을 Store 또는 Preload API로 전달
- 직접 외부 API를 호출하지 않음

## 이벤트 예시

종목 선택:

```text
관심종목 패널에서 삼성전자 클릭
  -> Renderer Store selectedSymbol 변경
  -> 차트 패널, 호가 패널, 주문 패널이 selectedSymbol 구독
  -> 관련 패널들이 같은 종목으로 갱신
```

실시간 시세:

```text
시세 WebSocket 수신
  -> Main Process가 메시지 파싱
  -> IPC로 Renderer에 전달
  -> Renderer Store가 종목별 가격 업데이트
  -> 관심종목/차트/호가 패널 리렌더링
```

주문 요청:

```text
주문 패널에서 매수 클릭
  -> Renderer에서 입력값 검증
  -> Preload API로 주문 요청
  -> Main Process에서 최종 검증
  -> 외부 주문 API 호출
  -> 결과를 IPC로 Renderer에 전달
  -> 주문 패널과 알림 UI 갱신
```
