# @mesoft/tiptap-editor

React, Next.js, Svelte를 지원하는 S3 사전 서명 URL 업로드 기능이 포함된 범용 Tiptap 에디터 컴포넌트입니다.

## 주요 기능

-   🎨 **리치 텍스트 편집** - Tiptap으로 구동되는 완전한 기능의 WYSIWYG 에디터
-   📤 **S3 업로드 지원** - Data URL로 자동 폴백되는 내장 S3 사전 서명 URL 업로드
-   ⚡ **프레임워크 독립적** - React, Next.js, Svelte에서 작동
-   🎯 **TypeScript** - 타입 정의가 포함된 완전한 TypeScript 지원
-   🎭 **슬래시 명령어** - 키보드 단축키로 빠른 서식 지정
-   🌙 **다크 모드** - 자동 다크 모드 지원
-   📱 **반응형** - 모바일 친화적인 툴바 및 에디터
-   🔧 **커스터마이징 가능** - 커스텀 업로드 핸들러 및 설정으로 확장 가능

## 설치

### npm 레지스트리에서 설치 (npm에 발행된 경우)

```bash
npm install @mesoft/tiptap-editor
```

### GitHub에서 직접 설치

npm 레지스트리에 발행되지 않은 경우, GitHub 저장소에서 직접 설치할 수 있습니다:

```bash
npm install github:mesoftkor/tiptap-editor
```

또는 package.json에 직접 추가:

```json
{
  "dependencies": {
    "@mesoft/tiptap-editor": "github:mesoftkor/tiptap-editor"
  }
}
```

## 사용법

### Svelte / SvelteKit

```svelte
<script lang="ts">
  import { RichTextEditor, type UploadConfig } from '@mesoft/tiptap-editor/svelte';

  let content = $state('');

  // S3 업로드 설정
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
      const data = await response.json();
      return {
        uploadUrl: data.upload_url,
        publicUrl: data.file_url
      };
    },
    token: 'your-auth-token' // 선택사항
  };
</script>

<RichTextEditor
  bind:value={content}
  uploadCategory="notice"
  minHeight="400px"
  {uploadConfig}
/>
```

### React

```tsx
import React, { useState } from "react";
import { RichTextEditor, type UploadConfig } from "@mesoft/tiptap-editor/react";

function MyComponent() {
    const [content, setContent] = useState("");

    // S3 업로드 설정
    const uploadConfig: UploadConfig = {
        getPresignedUrl: async (filename, contentType, category, token) => {
            const response = await fetch("/api/uploads/presign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ filename, contentType, category }),
            });
            const data = await response.json();
            return {
                uploadUrl: data.upload_url,
                publicUrl: data.file_url,
            };
        },
        token: "your-auth-token", // 선택사항
    };

    return (
        <RichTextEditor
            value={content}
            onChange={setContent}
            uploadCategory="notice"
            minHeight="400px"
            uploadConfig={uploadConfig}
        />
    );
}
```

### Next.js (App Router)

```tsx
"use client";

import { useState } from "react";
import { RichTextEditor, type UploadConfig } from "@mesoft/tiptap-editor/react";

export default function EditorPage() {
    const [content, setContent] = useState("");

    // S3 업로드 설정
    const uploadConfig: UploadConfig = {
        getPresignedUrl: async (filename, contentType, category) => {
            const response = await fetch("/api/uploads/presign", {
                method: "POST",
                body: JSON.stringify({ filename, contentType, category }),
            });
            const data = await response.json();
            return {
                uploadUrl: data.upload_url,
                publicUrl: data.file_url,
            };
        },
    };

    return (
        <div>
            <h1>My Editor</h1>
            <RichTextEditor value={content} onChange={setContent} uploadConfig={uploadConfig} />
        </div>
    );
}
```

## API Reference

### Props

#### `RichTextEditor` / `TiptapEditor`

| Prop                           | Type                                            | Default                  | 설명                          |
| ------------------------------ | ----------------------------------------------- | ------------------------ | ----------------------------- |
| `value` / `content`            | `string`                                        | `''`                     | 에디터 내용 (HTML)            |
| `onChange` / `onContentChange` | `(content: string) => void`                     | -                        | 내용 변경 시 콜백             |
| `placeholder`                  | `string`                                        | `'내용을 입력하세요...'` | 플레이스홀더 텍스트           |
| `editable`                     | `boolean`                                       | `true`                   | 편집 활성화/비활성화          |
| `minHeight`                    | `string`                                        | `'200px'`                | 에디터 최소 높이              |
| `uploadCategory`               | `UploadCategory`                                | `'temp'`                 | S3 업로드 카테고리            |
| `uploadConfig`                 | `UploadConfig`                                  | -                        | S3 업로드 설정                |
| `initialImages`                | `string[]`                                      | `[]`                     | 초기 이미지 URL (편집 모드용) |
| `onUnusedImagesChange`         | `(urls: string[]) => void`                      | -                        | 사용하지 않는 이미지 콜백     |
| `onImageUpload`                | `(file: File) => Promise<string \| ImageAttrs>` | -                        | 커스텀 이미지 업로드 핸들러   |

### Types

#### `UploadCategory`

```typescript
type UploadCategory = "profile" | "product" | "temp" | "document" | "notice";
```

#### `UploadConfig`

```typescript
interface UploadConfig {
    getPresignedUrl: (
        filename: string,
        contentType: string,
        category: UploadCategory,
        token?: string
    ) => Promise<{
        uploadUrl: string;
        publicUrl: string;
        headers?: Record<string, string>;
    }>;
    deleteImages?: (
        imageUrls: string[],
        token?: string
    ) => Promise<{
        success: boolean;
        deletedCount: number;
        message?: string;
    }>;
    token?: string;
    convertToCustomDomain?: (s3Url: string) => string;
}
```

## 고급 사용법

### 커스텀 이미지 업로드 핸들러

```tsx
const customUploadHandler = async (file: File) => {
    // 커스텀 업로드 로직
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    const { url } = await response.json();

    return url; // 또는 return { src: url, alt: 'description' }
};

<RichTextEditor value={content} onChange={setContent} onImageUpload={customUploadHandler} />;
```

### 사용하지 않는 이미지 추적

```tsx
const [unusedImages, setUnusedImages] = useState<string[]>([]);

<RichTextEditor value={content} onChange={setContent} initialImages={existingImageUrls} onUnusedImagesChange={setUnusedImages} />;

// 저장 시 사용하지 않는 이미지 삭제
const handleSave = async () => {
    if (unusedImages.length > 0) {
        await deleteImagesFromS3(unusedImages);
    }
    // 내용 저장...
};
```

### 읽기 전용 모드

```tsx
<RichTextEditor value={content} onChange={() => {}} editable={false} />
```

## 키보드 단축키

-   **굵게**: `Ctrl/Cmd + B`
-   **기울임**: `Ctrl/Cmd + I`
-   **밑줄**: `Ctrl/Cmd + U`
-   **취소선**: `Ctrl/Cmd + Shift + X`
-   **코드**: `Ctrl/Cmd + E`
-   **실행 취소**: `Ctrl/Cmd + Z`
-   **다시 실행**: `Ctrl/Cmd + Shift + Z`
-   **슬래시 명령어**: `/` 입력하여 명령 메뉴 열기

## 슬래시 명령어

에디터에서 `/`를 입력하면 명령 메뉴가 열립니다:

-   `/` → 제목 1, 2, 3
-   `/` → 단락
-   `/` → 글머리 기호 목록
-   `/` → 번호 매기기 목록
-   `/` → 인용문
-   `/` → 코드 블록
-   `/` → 구분선

## 백엔드 API 예제

S3 사전 서명 URL 생성을 위한 백엔드 엔드포인트 예제입니다:

```typescript
// API Route: /api/uploads/presign
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    const { filename, contentType, category } = await request.json();

    const key = `${category}/${Date.now()}-${filename}`;
    const bucket = "your-bucket-name";

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
    });

    const fileUrl = `https://${bucket}.s3.ap-northeast-2.amazonaws.com/${key}`;

    return Response.json({
        upload_url: uploadUrl,
        file_url: fileUrl,
        key,
        bucket,
    });
}
```

## 스타일링

에디터는 기본 스타일이 포함되어 있습니다. 커스터마이징하려면 다음 방법을 사용할 수 있습니다:

1. **CSS 변수 덮어쓰기** (권장):

```css
:root {
    --mesoft-editor-border: #e2e8f0;
    --mesoft-editor-bg: white;
    --mesoft-editor-text: #1e293b;
}
```

2. **스타일 가져오기 및 확장**:

```css
@import "@mesoft/tiptap-editor/styles.css";

.mesoft-tiptap-wrapper {
    /* 커스텀 스타일 */
}
```

## 브라우저 지원

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## 버전 관리

이 프로젝트는 [Semantic Versioning](https://semver.org/)을 따릅니다. 버전 관리 및 릴리즈 프로세스는 [VERSIONING.md](./VERSIONING.md)를 참조하세요.

변경사항은 [CHANGELOG.md](./CHANGELOG.md)에서 확인할 수 있습니다.

## 라이선스

MIT

## 기여하기

기여자를 환영합니다! 이슈를 열거나 풀 리퀘스트를 제출해 주세요.

## 지원

문제나 질문이 있으시면 다음을 방문해 주세요:

-   GitHub Issues: [mesoft/tiptap-editor/issues]
-   문서: [docs.mesoft.kr]

## 크레딧

구현 기술:

-   [Tiptap](https://tiptap.dev/) - 헤드리스 에디터 프레임워크
-   [ProseMirror](https://prosemirror.net/) - 에디터 툴킷
-   [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) - S3 통합
