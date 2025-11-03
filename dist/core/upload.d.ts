import type { UploadCategory, UploadConfig } from './types';
/**
 * 파일명 정제 (공백을 대시로 변환, 타임스탬프 추가)
 */
export declare function sanitizeFilename(name: string): string;
/**
 * File을 Data URL로 변환
 */
export declare function fileToDataUrl(file: File): Promise<string>;
/**
 * S3 Presigned URL로 파일 업로드
 */
export declare function putToPresignedUrl(uploadUrl: string, file: File, headers?: Record<string, string>): Promise<Response>;
/**
 * 이미지를 S3에 업로드
 */
export declare function uploadImageToS3(file: File, category?: UploadCategory, uploadConfig?: UploadConfig): Promise<string>;
/**
 * S3에서 여러 이미지 삭제
 */
export declare function deleteS3Images(imageUrls: string[], uploadConfig?: UploadConfig): Promise<{
    success: boolean;
    deletedCount: number;
    message?: string;
}>;
//# sourceMappingURL=upload.d.ts.map