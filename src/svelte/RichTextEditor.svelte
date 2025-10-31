<script lang="ts">
  import TiptapEditor from './TiptapEditor.svelte';
  import type { TiptapEditorBaseProps, UploadConfig } from '../core/types';

  /**
   * RichTextEditor - TiptapEditor의 간편한 래퍼 컴포넌트
   *
   * bind:value를 사용하여 양방향 바인딩을 제공합니다.
   *
   * @example
   * ```svelte
   * <RichTextEditor
   *   bind:value={content}
   *   uploadCategory="notice"
   *   minHeight="400px"
   *   uploadConfig={myUploadConfig}
   * />
   * ```
   */
  let {
    value = $bindable(''),
    placeholder = '내용을 입력하세요...',
    editable = true,
    minHeight = '200px',
    uploadCategory = 'notice',
    initialImages = [],
    onUnusedImagesChange,
    onImageUpload,
    uploadConfig
  }: Omit<TiptapEditorBaseProps, 'onContentChange'> & {
    value?: string;
    uploadConfig?: UploadConfig;
  } = $props();

  /**
   * TiptapEditor의 onContentChange 콜백을 처리하여 value를 업데이트합니다.
   */
  function handleContentChange(html: string) {
    value = html;
  }
</script>

<TiptapEditor
  content={value}
  {placeholder}
  {editable}
  {minHeight}
  {uploadCategory}
  {initialImages}
  onContentChange={handleContentChange}
  {onUnusedImagesChange}
  {onImageUpload}
  {uploadConfig}
/>
