/**
 * Core utilities and types for Mesoft Tiptap Editor
 *
 * This module provides framework-agnostic utilities for working with Tiptap editor.
 */
export type { UploadCategory, S3PresignedURLResponse, UploadConfig, TiptapEditorBaseProps, SlashCommandItem } from './types';
export { sanitizeFilename, fileToDataUrl, putToPresignedUrl, uploadImageToS3, deleteS3Images } from './upload';
export { getDefaultExtensions, addSlashCommandExtension } from './editor-config';
export { SlashCommand, getDefaultSlashItems } from './extensions/slash-command';
//# sourceMappingURL=index.d.ts.map