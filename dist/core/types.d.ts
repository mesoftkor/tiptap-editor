import type { Editor } from '@tiptap/core';
/**
 * S3 업로드 카테고리
 */
export type UploadCategory = 'profile' | 'product' | 'temp' | 'document' | 'notice';
/**
 * S3 Presigned URL 응답
 */
export interface S3PresignedURLResponse {
    upload_url: string;
    file_url: string;
    key: string;
    bucket: string;
    expires_in: number;
    uploaded_at: string;
}
/**
 * 업로드 설정
 */
export interface UploadConfig {
    /**
     * Presigned URL을 가져오는 함수
     * @param filename - 파일명
     * @param contentType - Content-Type
     * @param category - 업로드 카테고리
     * @param token - 인증 토큰
     */
    getPresignedUrl: (filename: string, contentType: string, category: UploadCategory, token?: string) => Promise<{
        uploadUrl: string;
        publicUrl: string;
        headers?: Record<string, string>;
    }>;
    /**
     * 이미지 삭제 함수 (선택사항)
     */
    deleteImages?: (imageUrls: string[], token?: string) => Promise<{
        success: boolean;
        deletedCount: number;
        message?: string;
    }>;
    /**
     * 인증 토큰
     */
    token?: string;
    /**
     * 커스텀 도메인 변환 함수 (선택사항)
     */
    convertToCustomDomain?: (s3Url: string) => string;
}
/**
 * 에디터 Props (공통)
 */
export interface TiptapEditorBaseProps {
    /**
     * 에디터 초기 콘텐츠 (HTML)
     */
    content?: string;
    /**
     * Placeholder 텍스트
     */
    placeholder?: string;
    /**
     * 편집 가능 여부
     */
    editable?: boolean;
    /**
     * 최소 높이
     */
    minHeight?: string;
    /**
     * 업로드 카테고리
     */
    uploadCategory?: UploadCategory;
    /**
     * 초기 이미지 URL 목록 (수정 모드 지원)
     */
    initialImages?: string[];
    /**
     * 콘텐츠 변경 콜백
     */
    onContentChange?: (content: string) => void;
    /**
     * 사용하지 않는 이미지 변경 콜백
     */
    onUnusedImagesChange?: (unusedUrls: string[]) => void;
    /**
     * 커스텀 이미지 업로드 함수
     */
    onImageUpload?: (file: File) => Promise<string | {
        src: string;
        alt?: string;
        title?: string;
    }>;
    /**
     * 업로드 설정 (전역 설정)
     */
    uploadConfig?: UploadConfig;
}
/**
 * 슬래시 명령 아이템
 */
export interface SlashCommandItem {
    title: string;
    description: string;
    icon: string;
    command: ({ editor, range }: {
        editor: Editor;
        range: any;
    }) => void;
}
//# sourceMappingURL=types.d.ts.map