/**
 * Core utilities and types for Mesoft Tiptap Editor
 *
 * This module provides framework-agnostic utilities for working with Tiptap editor.
 */

// Types
export type {
  UploadCategory,
  S3PresignedURLResponse,
  UploadConfig,
  TiptapEditorBaseProps,
  SlashCommandItem
} from './types';

// Upload utilities
export {
  sanitizeFilename,
  fileToDataUrl,
  putToPresignedUrl,
  uploadImageToS3,
  deleteS3Images
} from './upload';

// Editor configuration
export {
  getDefaultExtensions,
  addSlashCommandExtension
} from './editor-config';

// Extensions
export {
  SlashCommand,
  getDefaultSlashItems
} from './extensions/slash-command';
