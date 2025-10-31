# Mesoft Tiptap Editor - Next.js Example

Next.js 15 (App Router)를 사용한 Mesoft Tiptap Editor 예제입니다.

## 설치

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000을 엽니다.

## 빌드

```bash
npm run build
npm start
```

## 주요 기능

- ✅ Next.js 15 (App Router)
- ✅ TypeScript
- ✅ RichTextEditor 컴포넌트 사용 (클라이언트 컴포넌트)
- ✅ Mock S3 업로드 설정
- ✅ 사용하지 않는 이미지 추적
- ✅ HTML 출력 미리보기
- ✅ CSS Modules

## 실제 프로젝트에 적용하기

### API Routes 추가

```typescript
// app/api/uploads/presign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(request: NextRequest) {
  const { filename, contentType, category } = await request.json();

  const key = `${category}/${Date.now()}-${filename}`;
  const bucket = process.env.S3_BUCKET_NAME!;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600
  });

  const fileUrl = `https://${bucket}.s3.ap-northeast-2.amazonaws.com/${key}`;

  return NextResponse.json({
    upload_url: uploadUrl,
    file_url: fileUrl,
    key,
    bucket
  });
}
```

### 환경 변수 설정

`.env.local` 파일 생성:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
```

### 클라이언트 컴포넌트에서 사용

```typescript
'use client';

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

## 참고사항

- **'use client' 필수**: RichTextEditor는 클라이언트 컴포넌트에서만 사용 가능
- **API Routes**: S3 업로드는 서버 측 API Routes를 통해 처리
- **환경 변수**: AWS 자격 증명은 환경 변수로 관리
