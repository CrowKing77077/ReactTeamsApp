# React Teams App (Vite + React + MSAL)

Microsoft Entra ID(Microsoft ID 플랫폼) 기반 인증을 `@azure/msal-react`로 통합할 수 있도록 준비된 Vite + React 템플릿입니다. Microsoft Teams 탭 앱으로 확장할 수 있도록 구성 가이드를 포함합니다.

## 특징

- **Vite + React 19**: 빠른 HMR과 최신 React 환경
- **MSAL React 준비**: `@azure/msal-browser`, `@azure/msal-react` 기반 SPA 인증 가이드 제공
- **Teams 확장 가능**: `@microsoft/teams-js`를 이용한 탭/웹앱 통합 방법 안내

## 요구 사항

- Node.js 18+ (LTS 권장)
- Microsoft Entra ID에서 SPA 애플리케이션 등록 권한

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본: http://localhost:5173)
npm run dev

# 린트
npm run lint

# 프로덕션 빌드 / 로컬 미리보기
npm run build
npm run preview
```

## 프로젝트 구조(요약)

```
ReactTeamsApp/
  ├─ src/
  │  ├─ App.tsx
  │  ├─ main.tsx
  │  ├─ index.css
  │  └─ assets/
  ├─ public/
  ├─ index.html
  ├─ package.json
  └─ vite.config.ts
```

## Microsoft Entra ID 앱 등록

MSAL을 사용하려면 Entra ID에 SPA 애플리케이션을 등록해야 합니다.

1. Entra 관리 센터에서 애플리케이션 등록

- 플랫폼: Single-page application(SPA)
- Redirect URI(개발): `http://localhost:5173`

2. 값 확보

- 애플리케이션(클라이언트) ID → `clientId`
- 디렉터리(테넌트) ID → `tenantId` (또는 `common` 사용 가능)

3. 권한/범위(Optional)

- Microsoft Graph 예시: `User.Read`

## 환경 변수 설정

Vite에서는 `import.meta.env`로 주입되는 `VITE_` 프리픽스 변수를 사용합니다. 루트에 `.env.local`(커밋 제외 권장)을 생성하고 값들을 설정하세요.

```bash
# .env
VITE_ENTRA_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_ENTRA_TENANT_ID=common
VITE_REDIRECT_URI=http://localhost:5173
```

```ts
import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

export function useTeamsInit() {
  useEffect(() => {
    microsoftTeams.app.initialize().catch(() => {});
  }, []);
}
```

- 앱 등록 시 탭용 Redirect URI를 추가해야 합니다(프로덕션 도메인 기반 HTTPS 권장).
- 탭 구성 페이지/콘텐츠 페이지 모두 동일 또는 별도 URI를 사용할 수 있습니다.

## NPM 스크립트

- `npm run dev`: 개발 서버 시작
- `npm run build`: 타입체크 후 프로덕션 빌드
- `npm run preview`: 빌드 산출물 로컬 미리보기
- `npm run lint`: ESLint 검사

## 참고 자료(레퍼런스)

- MSAL 개요(공식 문서): [MSAL(Microsoft 인증 라이브러리) 개요](https://learn.microsoft.com/ko-kr/entra/identity-platform/msal-overview)
- MSAL React GitHub: [@azure/msal-react](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)

본 프로젝트의 인증 가이드는 위 문서를 참고하여 작성되었습니다.
