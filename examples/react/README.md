# Mesoft Tiptap Editor - React Example

Vite + React를 사용한 Mesoft Tiptap Editor 예제입니다.

## 설치

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173을 엽니다.

## 빌드

```bash
npm run build
```

## 주요 기능

- ✅ React 18
- ✅ TypeScript
- ✅ RichTextEditor 컴포넌트 사용
- ✅ Mock S3 업로드 설정
- ✅ 사용하지 않는 이미지 추적
- ✅ HTML 출력 미리보기

## 실제 프로젝트에 적용하기

1. **uploadConfig 설정**: Mock 함수를 실제 백엔드 API 호출로 변경
2. **인증 토큰**: uploadConfig에 token 추가
3. **이미지 정리**: 저장 시 사용하지 않는 이미지 삭제

```typescript
const uploadConfig: UploadConfig = {
  getPresignedUrl: async (filename, contentType, category, token) => {
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
