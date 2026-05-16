# Mac HTS Workspace

macOS 데스크톱에서 동작하는 HTS(Home Trading System) 스타일의 멀티 패널 워크스페이스 앱입니다.

Electron, Vite, React, TypeScript를 기반으로 하며, 하나의 앱 화면 안에서 관심종목, 차트, 호가, 주문, 뉴스, 계좌/잔고 같은 업무 패널을 동시에 다루는 구조를 목표로 합니다.

## 현재 상태

이 프로젝트는 MVP 단계입니다. 실제 증권사 API나 실거래 주문 기능은 아직 포함하지 않습니다. 현재는 HTS형 화면 구조와 Electron 앱 실행/빌드 기반을 잡는 데 초점을 둡니다.

현재 구현된 기능:

- macOS Electron 앱 실행 및 패키징
- HTS 스타일의 다중 패널 워크스페이스
- 관심종목, 차트, 호가, 주문, 뉴스, 계좌/잔고 패널
- 패널 드래그 이동
- 패널 최소화
- 패널 앞으로 가져오기
- 레이아웃 초기화
- 데모 시세/호가/뉴스/계좌 데이터 표시

## 기술 스택

- Electron 30
- Vite 5
- React 18
- TypeScript
- electron-builder

## 시작하기

### 요구 사항

- Node.js
- npm
- macOS

### 설치

```bash
npm install
```

### 개발 실행

```bash
npm run dev
```

개발 서버는 기본적으로 Vite를 통해 실행됩니다.

### 빌드

```bash
npm run build
```

빌드가 완료되면 macOS 패키징 산출물이 `release/` 아래에 생성됩니다.

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```text
.
├── docs/
├── electron/
│   ├── main.ts
│   └── preload.ts
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── electron-builder.json5
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 문서

프로젝트 문서는 `docs/` 폴더에 주제별로 나누어져 있습니다.

- [문서 인덱스](./docs/project-plan.md)
- [프로젝트 개요](./docs/01-project-overview.md)
- [MVP 범위](./docs/02-mvp-scope.md)
- [주요 화면 목록](./docs/03-screens.md)
- [Electron 프로세스 구조](./docs/04-electron-process-architecture.md)
- [멀티 윈도우 설계](./docs/05-multi-window-design.md)
- [데이터 흐름](./docs/06-data-flow.md)
- [폴더 구조](./docs/07-folder-structure.md)
- [개발 단계별 로드맵](./docs/08-development-roadmap.md)

## 설계 방향

MVP에서는 하나의 Electron `BrowserWindow` 안에서 React 컴포넌트를 창처럼 배치합니다. 이 방식은 초기 화면 UX를 빠르게 검증하고, 패널 간 상태 공유를 단순하게 유지할 수 있습니다.

향후에는 차트, 호가, 주문 같은 일부 패널을 실제 Electron `BrowserWindow`로 분리해 다중 모니터와 전문 HTS 사용자 경험을 지원하는 방향으로 확장합니다.

권장 확장 순서:

1. React 내부 가상 패널 UX 안정화
2. 패널 상태와 레이아웃 저장 구조 분리
3. Mock 데이터 서비스 도입
4. Electron IPC와 Preload API 정리
5. 일부 패널의 실제 멀티 윈도우 분리
6. 실시간 시세와 주문 흐름 연동

## 개발 원칙

- Renderer에서 외부 API 키나 민감 권한을 직접 다루지 않습니다.
- Main Process와 Preload Script를 통해 권한 경계를 유지합니다.
- UI와 실제 주문 실행 계층은 분리합니다.
- MVP에서는 화면 구조와 데이터 흐름의 경계를 먼저 안정화합니다.
- 문서와 구현이 어긋나면 관련 문서를 함께 갱신합니다.

## 주의 사항

- 현재 데이터는 데모 데이터입니다.
- 실제 주문 기능은 구현되어 있지 않습니다.
- macOS 코드 서명과 앱 아이콘은 아직 제품 배포 수준으로 정리되지 않았습니다.
- `release/`, `dist/`, `dist-electron/`, `node_modules/`는 Git 추적 대상이 아닙니다.
