# 7. 폴더 구조

## 현재 폴더 구조

```text
.
├── docs/
├── electron/
│   ├── electron-env.d.ts
│   ├── main.ts
│   └── preload.ts
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── electron-builder.json5
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## MVP 이후 권장 구조

```text
.
├── docs/
│   ├── project-plan.md
│   ├── 01-project-overview.md
│   ├── 02-mvp-scope.md
│   ├── 03-screens.md
│   ├── 04-electron-process-architecture.md
│   ├── 05-multi-window-design.md
│   ├── 06-data-flow.md
│   ├── 07-folder-structure.md
│   └── 08-development-roadmap.md
├── electron/
│   ├── ipc/
│   │   ├── channels.ts
│   │   └── handlers.ts
│   ├── services/
│   │   ├── market-data-service.ts
│   │   ├── account-service.ts
│   │   └── layout-service.ts
│   ├── windows/
│   │   ├── create-main-window.ts
│   │   └── create-panel-window.ts
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── workspace-store.ts
│   ├── components/
│   │   ├── panel-frame/
│   │   └── topbar/
│   ├── features/
│   │   ├── account/
│   │   ├── chart/
│   │   ├── news/
│   │   ├── order/
│   │   ├── orderbook/
│   │   └── watchlist/
│   ├── shared/
│   │   ├── types/
│   │   └── utils/
│   ├── styles/
│   └── main.tsx
├── public/
├── package.json
└── vite.config.ts
```

## 구조 분리 원칙

- `electron/`은 OS 창, IPC, 네이티브 권한, 외부 연결을 담당한다.
- `src/features/`는 업무 도메인별 화면과 상태를 담당한다.
- `src/components/`는 도메인과 무관한 공통 UI를 담당한다.
- `src/app/`은 앱 조립과 전역 상태를 담당한다.
- `src/shared/`는 타입, 유틸리티, 상수를 담당한다.

처음부터 이 구조를 모두 만들 필요는 없다. 기능이 생기는 시점에 옮겨야 한다. 다만 도메인 경계는 이 구조를 기준으로 잡는 것이 좋다.

## 분리 기준

파일이 커졌기 때문이 아니라 책임이 갈라졌을 때 쪼개야 한다.

- 차트가 자체 상태와 데이터 요청을 갖기 시작하면 `features/chart`로 분리한다.
- IPC가 두 개 이상 생기면 `electron/ipc`를 만든다.
- 서비스가 실제 API를 감싸기 시작하면 `electron/services`를 만든다.
- 여러 화면에서 재사용되는 UI가 생기면 `src/components`로 이동한다.
