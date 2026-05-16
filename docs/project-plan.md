# Mac HTS Workspace Documents

이 문서는 프로젝트 문서의 진입점이다. 세부 내용은 주제별 문서로 분리한다.

## 문서 목록

1. [프로젝트 개요](./01-project-overview.md)
2. [MVP 범위](./02-mvp-scope.md)
3. [주요 화면 목록](./03-screens.md)
4. [Electron 프로세스 구조](./04-electron-process-architecture.md)
5. [멀티 윈도우 설계](./05-multi-window-design.md)
6. [데이터 흐름](./06-data-flow.md)
7. [폴더 구조](./07-folder-structure.md)
8. [개발 단계별 로드맵](./08-development-roadmap.md)

## 문서 운영 원칙

- 하나의 문서는 하나의 의사결정 영역만 다룬다.
- 구현이 바뀌면 관련 문서도 같이 갱신한다.
- MVP 문서와 장기 설계 문서를 섞지 않는다.
- 화면, 프로세스, 데이터, 폴더 구조는 서로 연결되지만 독립적으로 리뷰할 수 있어야 한다.

## 현재 기준

- 앱 유형: macOS Electron 데스크톱 앱
- 프론트엔드: React + TypeScript + Vite
- UI 방향: HTS 스타일의 다중 패널 워크스페이스
- MVP 전략: 단일 Electron 창 내부의 가상 패널 우선
- 확장 전략: 이후 일부 패널을 실제 Electron BrowserWindow로 분리
