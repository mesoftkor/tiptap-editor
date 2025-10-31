import type { UploadCategory, UploadConfig } from './types';

/**
 * 파일명 정제 (공백을 대시로 변환, 타임스탬프 추가)
 */
export function sanitizeFilename(name: string): string {
  const base = name.split('\\').pop()?.split('/').pop() || 'upload';
  const ts = Date.now();
  return `${base.replace(/\s+/g, '-')}-${ts}`;
}

/**
 * File을 Data URL로 변환
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * S3 Presigned URL로 파일 업로드
 */
export async function putToPresignedUrl(
  uploadUrl: string,
  file: File,
  headers?: Record<string, string>
): Promise<Response> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      ...(headers || {})
    },
    body: file
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`S3 업로드 실패: ${response.status} ${text}`);
  }

  return response;
}

/**
 * 이미지를 S3에 업로드
 */
export async function uploadImageToS3(
  file: File,
  category: UploadCategory = 'temp',
  uploadConfig?: UploadConfig
): Promise<string> {
  if (!uploadConfig) {
    throw new Error('uploadConfig가 설정되지 않았습니다.');
  }

  const { uploadUrl, publicUrl, headers } = await uploadConfig.getPresignedUrl(
    sanitizeFilename(file.name),
    file.type || 'application/octet-stream',
    category,
    uploadConfig.token
  );

  await putToPresignedUrl(uploadUrl, file, headers);

  // 커스텀 도메인 변환 함수가 있으면 사용
  if (uploadConfig.convertToCustomDomain) {
    return uploadConfig.convertToCustomDomain(publicUrl);
  }

  return publicUrl;
}

/**
 * S3에서 여러 이미지 삭제
 */
export async function deleteS3Images(
  imageUrls: string[],
  uploadConfig?: UploadConfig
): Promise<{ success: boolean; deletedCount: number; message?: string }> {
  if (!imageUrls || imageUrls.length === 0) {
    return { success: true, deletedCount: 0 };
  }

  if (!uploadConfig?.deleteImages) {
    console.warn('deleteImages 함수가 설정되지 않았습니다. 이미지 삭제를 건너뜁니다.');
    return { success: true, deletedCount: 0 };
  }

  try {
    return await uploadConfig.deleteImages(imageUrls, uploadConfig.token);
  } catch (error) {
    console.error('S3 이미지 삭제 실패:', error);
    return {
      success: false,
      deletedCount: 0,
      message: error instanceof Error ? error.message : '이미지 삭제 중 오류 발생'
    };
  }
}
