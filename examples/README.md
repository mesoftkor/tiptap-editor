# Mesoft Tiptap Editor - Examples

각 프레임워크별 실제 동작 예제입니다.

## 📁 폴더 구조

```
examples/
├── svelte/     # SvelteKit 예제
├── react/      # React (Vite) 예제
└── next/       # Next.js (App Router) 예제
```

## 🚀 빠른 시작

각 예제 폴더로 이동하여 실행:

### Svelte

```bash
cd svelte
npm install
npm run dev
```

http://localhost:5173

### React

```bash
cd react
npm install
npm run dev
```

http://localhost:5173

### Next.js

```bash
cd next
npm install
npm run dev
```

http://localhost:3000

## 📖 예제 내용

모든 예제는 다음 기능을 포함합니다:

- ✅ RichTextEditor 컴포넌트 사용
- ✅ Mock S3 업로드 설정 (실제 API 연동 예제 포함)
- ✅ 사용하지 않는 이미지 추적
- ✅ HTML 출력 미리보기
- ✅ 저장 기능 (콘솔 출력)

## 🔧 실제 프로젝트에 적용하기

### 1. 백엔드 API 구현

각 예제의 Mock 업로드 함수를 실제 백엔드 API로 교체하세요.

```typescript
const uploadConfig: UploadConfig = {
  getPresignedUrl: async (filename, contentType, category, token) => {
    // Mock 대신 실제 API 호출
    const response = await fetch('/api/uploads/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ filename, contentType, category })
    });
    return await response.json();
  },
  token: 'your-auth-token'
};
```

### 2. 이미지 정리

저장 시 사용하지 않는 이미지를 삭제하세요:

```typescript
const handleSave = async () => {
  // 사용하지 않는 이미지 삭제
  if (unusedImages.length > 0) {
    await uploadConfig.deleteImages?.(unusedImages);
  }

  // 콘텐츠 저장
  await fetch('/api/content', {
    method: 'POST',
    body: JSON.stringify({ content })
  });
};
```

### 3. 인증 토큰

사용자 세션에서 인증 토큰을 가져와 uploadConfig에 설정하세요:

```typescript
const token = getAuthToken(); // 세션에서 토큰 가져오기

const uploadConfig: UploadConfig = {
  getPresignedUrl: async (filename, contentType, category) => {
    // token은 uploadConfig에서 자동으로 전달됨
    // ...
  },
  token // 여기에 토큰 설정
};
```

## 📚 추가 문서

- [메인 README](../README.md) - 전체 라이브러리 문서
- [Svelte 예제](./svelte/README.md)
- [React 예제](./react/README.md)
- [Next.js 예제](./next/README.md)

## 💡 팁

1. **개발 환경**: 각 예제는 Mock 데이터를 사용하므로 백엔드 없이 바로 실행 가능
2. **프로덕션 환경**: 실제 S3 API 연동은 각 예제의 README 참고
3. **스타일링**: 각 예제는 독립적인 스타일을 사용하며, 프로젝트에 맞게 수정 가능
4. **디버깅**: 브라우저 콘솔에서 업로드 로그 및 이미지 추적 확인 가능

## 🐛 문제 해결

### 빌드 오류

```bash
# node_modules와 package-lock.json 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 타입 오류

```bash
# TypeScript 설정 확인
npm run typecheck  # (해당하는 경우)
```

### 포트 충돌

기본 포트가 사용 중인 경우 다른 포트로 실행:

```bash
# Vite (Svelte/React)
npm run dev -- --port 5174

# Next.js
npm run dev -- -p 3001
```
