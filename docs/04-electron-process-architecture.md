# 4. Electron 프로세스 구조

Electron 앱은 크게 Main Process, Renderer Process, Preload Script로 나뉜다.

## Main Process

파일 위치:

- `electron/main.ts`

역할:

- macOS 앱 생명주기 관리
- BrowserWindow 생성
- 앱 창 크기, 최소 크기, 타이틀 설정
- 개발 서버 또는 빌드된 HTML 로드
- 향후 네이티브 메뉴, IPC 라우팅, 다중 창 관리 담당

현재 Main Process는 하나의 메인 윈도우를 생성한다. MVP 이후 멀티 윈도우를 실제 OS 창 단위로 확장할 경우, 이 프로세스가 창 생성과 창 간 메시지 흐름의 중심이 된다.

## Renderer Process

파일 위치:

- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/index.css`

역할:

- React UI 렌더링
- HTS형 패널 상태 관리
- 사용자 입력 처리
- 화면 내부의 가상 창 이동/최소화/포커스 처리

MVP에서는 모든 업무 패널이 하나의 Renderer 안에서 동작한다. 이는 초기 개발 속도가 빠르고, 패널 간 상태 공유가 단순하다는 장점이 있다.

## Preload Script

파일 위치:

- `electron/preload.ts`

역할:

- Main Process와 Renderer Process 사이의 안전한 다리
- 향후 `contextBridge`를 통한 제한된 API 노출
- 파일 시스템, 로컬 설정, 네이티브 알림, IPC 호출을 Renderer에 안전하게 제공

현재는 기본 템플릿 수준이지만, 실제 데이터 연동이 들어오면 Preload를 통해 Renderer가 직접 Node/Electron 권한을 만지지 않게 해야 한다.

## 보안 원칙

- Renderer에서 Node API를 직접 열지 않는다.
- Main Process가 외부 API 키, 로컬 파일, 민감 설정을 관리한다.
- Preload는 필요한 기능만 좁은 API로 노출한다.
- IPC 메시지는 타입과 권한을 검증한다.
- 주문/계좌 기능은 UI 이벤트와 실제 실행 계층을 반드시 분리한다.
