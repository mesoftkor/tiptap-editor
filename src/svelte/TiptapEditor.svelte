<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { Editor } from '@tiptap/core';
  import {
    getDefaultExtensions,
    addSlashCommandExtension,
    getDefaultSlashItems,
    uploadImageToS3,
    fileToDataUrl,
    type TiptapEditorBaseProps,
    type UploadConfig,
    type SlashCommandItem
  } from '../core';
  import SlashCommandMenu from './SlashCommandMenu.svelte';

  let {
    content = '',
    placeholder = '내용을 입력하세요...',
    editable = true,
    minHeight = '200px',
    uploadCategory = 'notice',
    initialImages = [],
    onImageUpload,
    onUnusedImagesChange,
    onContentChange,
    uploadConfig
  }: TiptapEditorBaseProps & { uploadConfig?: UploadConfig } = $props();

  let editor: Editor | null = null;
  let element: HTMLElement;
  let isActive = $state(false);
  let fileInput: HTMLInputElement | null = null;

  // 업로드된 모든 이미지 URL 추적
  let uploadedImageUrls = $state(new Set<string>());

  // 에디터 상태
  let editorState = $state({
    canUndo: false,
    canRedo: false,
    isUpdated: 0
  });

  // 슬래시 명령 메뉴 상태
  let showSlashMenu = $state(false);
  let slashMenuItems = $state<SlashCommandItem[]>([]);
  let slashMenuSelectedIndex = $state(0);
  let slashMenuPosition = $state({ top: 0, left: 0 });
  let slashMenuProps: any = null;

  let isInternalUpdate = false;

  onMount(async () => {
    await tick();

    // 초기 이미지 추가
    if (initialImages && initialImages.length > 0) {
      initialImages.forEach((url) => {
        if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
          uploadedImageUrls.add(url);
        }
      });
    }

    // 초기 이미지가 없으면 HTML에서 추출
    if (uploadedImageUrls.size === 0 && content) {
      const htmlImgRegex = /<img[^>]+src="([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = htmlImgRegex.exec(content)) !== null) {
        const url = m[1];
        if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
          uploadedImageUrls.add(url);
        }
      }
    }

    // 기본 확장 가져오기
    let extensions = getDefaultExtensions({ editable, placeholder });

    // editable 모드에서 슬래시 명령 추가
    if (editable) {
      extensions = addSlashCommandExtension(extensions, {
        items: ({ query }: { query: string }) => getDefaultSlashItems({ query }),
        render: () => ({
          onStart: (props: any) => {
            slashMenuProps = props;
            slashMenuItems = props.items;
            slashMenuSelectedIndex = 0;
            showSlashMenu = true;

            const { clientRect } = props;
            if (clientRect) {
              const rect = clientRect();
              if (rect) {
                slashMenuPosition = {
                  top: rect.bottom + window.scrollY + 8,
                  left: rect.left + window.scrollX
                };
              }
            }
          },
          onUpdate: (props: any) => {
            slashMenuProps = props;
            slashMenuItems = props.items;
            slashMenuSelectedIndex = 0;

            const { clientRect } = props;
            if (clientRect) {
              const rect = clientRect();
              if (rect) {
                slashMenuPosition = {
                  top: rect.bottom + window.scrollY + 8,
                  left: rect.left + window.scrollX
                };
              }
            }
          },
          onKeyDown: (props: any) => {
            if (props.event.key === 'ArrowUp') {
              slashMenuSelectedIndex =
                (slashMenuSelectedIndex + slashMenuItems.length - 1) % slashMenuItems.length;
              return true;
            }
            if (props.event.key === 'ArrowDown') {
              slashMenuSelectedIndex = (slashMenuSelectedIndex + 1) % slashMenuItems.length;
              return true;
            }
            if (props.event.key === 'Enter') {
              if (slashMenuItems[slashMenuSelectedIndex]) {
                selectSlashItem(slashMenuSelectedIndex);
              }
              return true;
            }
            if (props.event.key === 'Escape') {
              showSlashMenu = false;
              return true;
            }
            return false;
          },
          onExit: () => {
            showSlashMenu = false;
            slashMenuProps = null;
          }
        })
      });
    }

    editor = new Editor({
      element: element,
      extensions,
      content: content || '',
      editable,
      onTransaction: ({ editor }) => {
        editorState.canUndo = editor.can().undo();
        editorState.canRedo = editor.can().redo();
        editorState.isUpdated++;
      },
      onUpdate: ({ editor }) => {
        if (!isInternalUpdate && onContentChange) {
          const newContent = editor.getHTML();
          onContentChange(newContent);
        }
      },
      onFocus: () => {
        isActive = true;
      },
      onBlur: () => {
        isActive = false;
      },
      editorProps: {
        attributes: {
          class: 'mesoft-tiptap-content'
        },
        handlePaste: (_view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                uploadAndInsertImage(file);
                return true;
              }
            }
          }
          return false;
        },
        handleDrop: (_view, event) => {
          const dt = event.dataTransfer;
          if (!dt || !dt.files?.length) return false;
          for (const file of Array.from(dt.files)) {
            if (file.type.startsWith('image/')) {
              uploadAndInsertImage(file);
              return true;
            }
          }
          return false;
        }
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  function selectSlashItem(index: number) {
    const item = slashMenuItems[index];
    if (item && slashMenuProps && editor) {
      item.command({ editor, range: slashMenuProps.range });
      showSlashMenu = false;
    }
  }

  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function toggleUnderline() {
    editor?.chain().focus().toggleUnderline().run();
  }

  function toggleStrike() {
    editor?.chain().focus().toggleStrike().run();
  }

  function toggleCode() {
    editor?.chain().focus().toggleCode().run();
  }

  function setHeading(level: 1 | 2 | 3) {
    editor?.chain().focus().toggleHeading({ level }).run();
  }

  function setParagraph() {
    editor?.chain().focus().setParagraph().run();
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function toggleCodeBlock() {
    editor?.chain().focus().toggleCodeBlock().run();
  }

  function toggleBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }

  function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
    editor?.chain().focus().setTextAlign(align).run();
  }

  function addLink() {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      let finalUrl = url;
      if (!url.match(/^https?:\/\//)) {
        finalUrl = `https://${url}`;
      }
      editor?.chain().focus().setLink({ href: finalUrl }).run();
    }
  }

  function removeLink() {
    editor?.chain().focus().unsetLink().run();
  }

  async function addImageEnhanced() {
    const url = window.prompt('이미지 URL을 입력하거나 취소하면 파일 업로드 창이 열립니다.');
    if (url && url.trim()) {
      const finalUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      editor?.chain().focus().setImage({ src: finalUrl }).run();
      return;
    }
    fileInput?.click();
  }

  async function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    await uploadAndInsertImage(file);
    input.value = '';
  }

  async function uploadAndInsertImage(file: File) {
    if (!editor) return;

    const blobUrl = URL.createObjectURL(file);
    const { selection } = editor.state;
    const insertPos = selection.$anchor.pos;

    editor
      .chain()
      .insertContentAt(insertPos, {
        type: 'image',
        attrs: { src: blobUrl }
      })
      .run();

    try {
      let resultSrc: string;
      let attrs: { src: string; alt?: string; title?: string };

      if (onImageUpload) {
        const res = await onImageUpload(file);
        if (typeof res === 'string') {
          resultSrc = res;
          attrs = { src: resultSrc };
        } else {
          attrs = res;
          resultSrc = res.src;
        }
      } else {
        try {
          resultSrc = await uploadImageToS3(file, uploadCategory, uploadConfig);
          attrs = { src: resultSrc };
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);

          if (errorMessage.includes('CORS')) {
            console.warn('⚠️ S3 CORS 설정 필요:', errorMessage);
            console.warn('→ Data URL로 폴백됩니다.');
          } else {
            console.error('S3 업로드 실패, Data URL로 폴백:', e);
          }

          resultSrc = await fileToDataUrl(file);
          attrs = { src: resultSrc };
        }
      }

      const { state } = editor;
      const imagePos = findImagePositionByUrl(state, blobUrl);

      if (imagePos !== null) {
        const tr = editor.state.tr.setNodeMarkup(imagePos, undefined, attrs as any);
        editor.view.dispatch(tr);
      }

      if (!resultSrc.startsWith('data:') && !resultSrc.startsWith('blob:')) {
        uploadedImageUrls.add(resultSrc);
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      editor.commands.undo();
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  function findImagePositionByUrl(
    state: import('@tiptap/pm/state').EditorState,
    url: string
  ): number | null {
    let pos: number | null = null;
    state.doc.descendants((node, position) => {
      if (node.type.name === 'image' && node.attrs.src === url) {
        pos = position;
      }
    });
    return pos;
  }

  function getCurrentImageUrls(): Set<string> {
    const urls = new Set<string>();
    if (!editor) return urls;

    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image' && node.attrs.src) {
        const src = node.attrs.src;
        if (!src.startsWith('data:') && !src.startsWith('blob:')) {
          urls.add(src);
        }
      }
    });

    return urls;
  }

  function calculateUnusedImages() {
    if (!onUnusedImagesChange) return;

    const currentUrls = getCurrentImageUrls();
    const unusedUrls: string[] = [];

    uploadedImageUrls.forEach((url) => {
      if (!currentUrls.has(url)) {
        unusedUrls.push(url);
      }
    });

    onUnusedImagesChange(unusedUrls);
  }

  $effect(() => {
    const currentUpdate = editorState.isUpdated;

    if (editor && uploadedImageUrls.size > 0) {
      calculateUnusedImages();
    }
  });

  function undo() {
    editor?.chain().focus().undo().run();
  }

  function redo() {
    editor?.chain().focus().redo().run();
  }
</script>

{#if editable}
  <div class="mesoft-tiptap-wrapper">
    <!-- Toolbar -->
    <div class="mesoft-tiptap-toolbar" onmousedown={(e) => e.preventDefault()}>
      <!-- Text Style -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={setParagraph}
          class="toolbar-btn"
          class:active={editorState.isUpdated >= 0 && editor?.isActive('paragraph')}
          title="본문"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onclick={() => setHeading(1)}
          class="toolbar-btn"
          class:active={editorState.isUpdated >= 0 && editor?.isActive('heading', { level: 1 })}
          title="제목 1"
        >
          H1
        </button>
        <button
          type="button"
          onclick={() => setHeading(2)}
          class="toolbar-btn"
          class:active={editorState.isUpdated >= 0 && editor?.isActive('heading', { level: 2 })}
          title="제목 2"
        >
          H2
        </button>
        <button
          type="button"
          onclick={() => setHeading(3)}
          class="toolbar-btn"
          class:active={editorState.isUpdated >= 0 && editor?.isActive('heading', { level: 3 })}
          title="제목 3"
        >
          H3
        </button>
        <input bind:this={fileInput} type="file" accept="image/*" onchange={onFileSelected} style="display: none;" />
      </div>

      <!-- Text Formatting -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={toggleBold}
          class="toolbar-btn"
          class:active={editor?.isActive('bold')}
          title="굵게"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onclick={toggleItalic}
          class="toolbar-btn"
          class:active={editor?.isActive('italic')}
          title="기울임"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onclick={toggleUnderline}
          class="toolbar-btn"
          class:active={editor?.isActive('underline')}
          title="밑줄"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onclick={toggleStrike}
          class="toolbar-btn"
          class:active={editor?.isActive('strike')}
          title="취소선"
        >
          <s>S</s>
        </button>
        <button
          type="button"
          onclick={toggleCode}
          class="toolbar-btn"
          class:active={editor?.isActive('code')}
          title="코드"
        >
          &lt;/&gt;
        </button>
      </div>

      <!-- Text Align -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={() => setTextAlign('left')}
          class="toolbar-btn"
          class:active={editor?.isActive({ textAlign: 'left' })}
          title="왼쪽 정렬"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onclick={() => setTextAlign('center')}
          class="toolbar-btn"
          class:active={editor?.isActive({ textAlign: 'center' })}
          title="가운데 정렬"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onclick={() => setTextAlign('right')}
          class="toolbar-btn"
          class:active={editor?.isActive({ textAlign: 'right' })}
          title="오른쪽 정렬"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </button>
      </div>

      <!-- Lists -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={toggleBulletList}
          class="toolbar-btn"
          class:active={editor?.isActive('bulletList')}
          title="글머리 기호"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onclick={toggleOrderedList}
          class="toolbar-btn"
          class:active={editor?.isActive('orderedList')}
          title="번호 매기기"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Special Blocks -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={toggleBlockquote}
          class="toolbar-btn"
          class:active={editor?.isActive('blockquote')}
          title="인용"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button
          type="button"
          onclick={toggleCodeBlock}
          class="toolbar-btn"
          class:active={editor?.isActive('codeBlock')}
          title="코드 블록"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      <!-- Link & Image -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={addLink}
          class="toolbar-btn"
          class:active={editor?.isActive('link')}
          title="링크"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        {#if editor?.isActive('link')}
          <button
            type="button"
            onclick={removeLink}
            class="toolbar-btn remove-link"
            title="링크 제거"
          >
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
        <button
          type="button"
          onclick={addImageEnhanced}
          class="toolbar-btn"
          title="이미지"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <!-- Undo/Redo -->
      <div class="toolbar-group">
        <button
          type="button"
          onclick={undo}
          class="toolbar-btn"
          disabled={!editorState.canUndo}
          title="실행 취소"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          type="button"
          onclick={redo}
          class="toolbar-btn"
          disabled={!editorState.canRedo}
          title="다시 실행"
        >
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="mesoft-tiptap-content-wrapper" style="min-height: {minHeight};">
      <div bind:this={element} class="mesoft-tiptap-editor"></div>
    </div>
  </div>

  <!-- Slash Command Menu -->
  {#if showSlashMenu && slashMenuItems.length > 0}
    <div
      class="mesoft-slash-menu-container"
      style="position: fixed; top: {slashMenuPosition.top}px; left: {slashMenuPosition.left}px; z-index: 50;"
    >
      <SlashCommandMenu
        items={slashMenuItems}
        selectedIndex={slashMenuSelectedIndex}
        onSelect={selectSlashItem}
      />
    </div>
  {/if}
{:else}
  <!-- Read-only view -->
  <div bind:this={element} class="mesoft-tiptap-readonly"></div>
{/if}

<style>
  .mesoft-tiptap-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background: white;
  }

  .mesoft-tiptap-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    border-bottom: 1px solid #e2e8f0;
    padding: 0.5rem;
  }

  .toolbar-group {
    display: flex;
    gap: 0.125rem;
    border-right: 1px solid #e2e8f0;
    padding-right: 0.5rem;
  }

  .toolbar-group:last-child {
    border-right: none;
  }

  .toolbar-btn {
    padding: 0.375rem;
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.15s;
    font-size: 0.875rem;
    color: #1e293b;
  }

  .toolbar-btn:hover {
    background-color: #f1f5f9;
  }

  .toolbar-btn.active {
    background-color: #e2e8f0;
  }

  .toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toolbar-btn.remove-link {
    color: #dc2626;
  }

  .toolbar-btn.remove-link:hover {
    background-color: #fee2e2;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }

  .mesoft-tiptap-content-wrapper {
    padding: 1rem;
  }

  .mesoft-tiptap-readonly {
    padding: 1rem;
    line-height: 1.6;
    color: #1e293b;
  }

  .mesoft-slash-menu-container {
    animation: fadeIn 0.15s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .mesoft-tiptap-wrapper {
      background: #1e293b;
      border-color: #334155;
    }

    .mesoft-tiptap-toolbar {
      border-color: #334155;
    }

    .toolbar-group {
      border-color: #334155;
    }

    .toolbar-btn {
      color: #f1f5f9;
    }

    .toolbar-btn:hover {
      background-color: #334155;
    }

    .toolbar-btn.active {
      background-color: #475569;
    }

    .mesoft-tiptap-readonly {
      color: #f1f5f9;
    }
  }
</style>
