import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { SlashCommandMenu } from './SlashCommandMenu';
import './TiptapEditor.css';

export interface TiptapEditorProps extends TiptapEditorBaseProps {
  uploadConfig?: UploadConfig;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
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
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<Set<string>>(new Set());
  const [editorState, setEditorState] = useState({
    canUndo: false,
    canRedo: false,
    isUpdated: 0
  });

  // Slash command menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuItems, setSlashMenuItems] = useState<SlashCommandItem[]>([]);
  const [slashMenuSelectedIndex, setSlashMenuSelectedIndex] = useState(0);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const slashMenuPropsRef = useRef<any>(null);

  const isInternalUpdateRef = useRef(false);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize uploaded images
    const initialUrls = new Set<string>();
    if (initialImages && initialImages.length > 0) {
      initialImages.forEach((url) => {
        if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
          initialUrls.add(url);
        }
      });
    }

    // Extract images from HTML if no initial images
    if (initialUrls.size === 0 && content) {
      const htmlImgRegex = /<img[^>]+src="([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = htmlImgRegex.exec(content)) !== null) {
        const url = m[1];
        if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
          initialUrls.add(url);
        }
      }
    }
    setUploadedImageUrls(initialUrls);

    // Get default extensions
    let extensions = getDefaultExtensions({ editable, placeholder });

    // Add slash command extension if editable
    if (editable) {
      extensions = addSlashCommandExtension(extensions, {
        items: ({ query }: { query: string }) => getDefaultSlashItems({ query }),
        render: () => ({
          onStart: (props: any) => {
            slashMenuPropsRef.current = props;
            setSlashMenuItems(props.items);
            setSlashMenuSelectedIndex(0);
            setShowSlashMenu(true);

            const { clientRect } = props;
            if (clientRect) {
              const rect = clientRect();
              if (rect) {
                setSlashMenuPosition({
                  top: rect.bottom + window.scrollY + 8,
                  left: rect.left + window.scrollX
                });
              }
            }
          },
          onUpdate: (props: any) => {
            slashMenuPropsRef.current = props;
            setSlashMenuItems(props.items);
            setSlashMenuSelectedIndex(0);

            const { clientRect } = props;
            if (clientRect) {
              const rect = clientRect();
              if (rect) {
                setSlashMenuPosition({
                  top: rect.bottom + window.scrollY + 8,
                  left: rect.left + window.scrollX
                });
              }
            }
          },
          onKeyDown: (props: any) => {
            if (props.event.key === 'ArrowUp') {
              setSlashMenuSelectedIndex((prev) => {
                const items = slashMenuPropsRef.current?.items || [];
                return (prev + items.length - 1) % items.length;
              });
              return true;
            }
            if (props.event.key === 'ArrowDown') {
              setSlashMenuSelectedIndex((prev) => {
                const items = slashMenuPropsRef.current?.items || [];
                return (prev + 1) % items.length;
              });
              return true;
            }
            if (props.event.key === 'Enter') {
              const items = slashMenuPropsRef.current?.items || [];
              if (items[slashMenuSelectedIndex]) {
                handleSelectSlashItem(slashMenuSelectedIndex);
              }
              return true;
            }
            if (props.event.key === 'Escape') {
              setShowSlashMenu(false);
              return true;
            }
            return false;
          },
          onExit: () => {
            setShowSlashMenu(false);
            slashMenuPropsRef.current = null;
          }
        })
      });
    }

    const newEditor = new Editor({
      element: editorRef.current,
      extensions,
      content: content || '',
      editable,
      onTransaction: ({ editor }) => {
        setEditorState({
          canUndo: editor.can().undo(),
          canRedo: editor.can().redo(),
          isUpdated: Date.now()
        });
      },
      onUpdate: ({ editor }) => {
        if (!isInternalUpdateRef.current && onContentChange) {
          const newContent = editor.getHTML();
          onContentChange(newContent);
        }
      },
      editorProps: {
        attributes: {
          class: 'mesoft-tiptap-content'
        },
        handlePaste: (_view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                uploadAndInsertImage(file, newEditor);
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
              uploadAndInsertImage(file, newEditor);
              return true;
            }
          }
          return false;
        }
      }
    });

    setEditor(newEditor);

    return () => {
      newEditor.destroy();
    };
  }, []); // Only run once on mount

  // Handle slash menu item selection
  const handleSelectSlashItem = useCallback(
    (index: number) => {
      const item = slashMenuItems[index];
      if (item && slashMenuPropsRef.current && editor) {
        item.command({ editor, range: slashMenuPropsRef.current.range });
        setShowSlashMenu(false);
      }
    },
    [slashMenuItems, editor]
  );

  // Upload and insert image
  const uploadAndInsertImage = async (file: File, editorInstance: Editor) => {
    if (!editorInstance) return;

    const blobUrl = URL.createObjectURL(file);
    const { selection } = editorInstance.state;
    const insertPos = selection.$anchor.pos;

    editorInstance
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

      const { state } = editorInstance;
      const imagePos = findImagePositionByUrl(state, blobUrl);

      if (imagePos !== null) {
        const tr = editorInstance.state.tr.setNodeMarkup(imagePos, undefined, attrs as any);
        editorInstance.view.dispatch(tr);
      }

      if (!resultSrc.startsWith('data:') && !resultSrc.startsWith('blob:')) {
        setUploadedImageUrls((prev) => new Set(prev).add(resultSrc));
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      editorInstance.commands.undo();
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  };

  const findImagePositionByUrl = (
    state: import('@tiptap/pm/state').EditorState,
    url: string
  ): number | null => {
    let pos: number | null = null;
    state.doc.descendants((node, position) => {
      if (node.type.name === 'image' && node.attrs.src === url) {
        pos = position;
      }
    });
    return pos;
  };

  const getCurrentImageUrls = useCallback((): Set<string> => {
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
  }, [editor]);

  const calculateUnusedImages = useCallback(() => {
    if (!onUnusedImagesChange) return;

    const currentUrls = getCurrentImageUrls();
    const unusedUrls: string[] = [];

    uploadedImageUrls.forEach((url) => {
      if (!currentUrls.has(url)) {
        unusedUrls.push(url);
      }
    });

    onUnusedImagesChange(unusedUrls);
  }, [getCurrentImageUrls, uploadedImageUrls, onUnusedImagesChange]);

  // Calculate unused images when editor state changes
  useEffect(() => {
    if (editor && uploadedImageUrls.size > 0) {
      calculateUnusedImages();
    }
  }, [editorState.isUpdated, editor, uploadedImageUrls, calculateUnusedImages]);

  // Toolbar actions
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleCode = () => editor?.chain().focus().toggleCode().run();
  const setHeading = (level: 1 | 2 | 3) =>
    editor?.chain().focus().toggleHeading({ level }).run();
  const setParagraph = () => editor?.chain().focus().setParagraph().run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const setTextAlign = (align: 'left' | 'center' | 'right' | 'justify') =>
    editor?.chain().focus().setTextAlign(align).run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();

  const addLink = () => {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      let finalUrl = url;
      if (!url.match(/^https?:\/\//)) {
        finalUrl = `https://${url}`;
      }
      editor?.chain().focus().setLink({ href: finalUrl }).run();
    }
  };

  const removeLink = () => editor?.chain().focus().unsetLink().run();

  const addImageEnhanced = () => {
    const url = window.prompt('이미지 URL을 입력하거나 취소하면 파일 업로드 창이 열립니다.');
    if (url && url.trim()) {
      const finalUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      editor?.chain().focus().setImage({ src: finalUrl }).run();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    await uploadAndInsertImage(file, editor);
    e.target.value = '';
  };

  if (!editable) {
    // Read-only view
    return <div ref={editorRef} className="mesoft-tiptap-readonly" />;
  }

  return (
    <div className="mesoft-tiptap-wrapper">
      {/* Toolbar */}
      <div className="mesoft-tiptap-toolbar" onMouseDown={(e) => e.preventDefault()}>
        {/* Text Style */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={setParagraph}
            className={`toolbar-btn ${editor?.isActive('paragraph') ? 'active' : ''}`}
            title="본문"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setHeading(1)}
            className={`toolbar-btn ${editor?.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => setHeading(2)}
            className={`toolbar-btn ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => setHeading(3)}
            className={`toolbar-btn ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="제목 3"
          >
            H3
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            style={{ display: 'none' }}
          />
        </div>

        {/* Text Formatting */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={toggleBold}
            className={`toolbar-btn ${editor?.isActive('bold') ? 'active' : ''}`}
            title="굵게"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            className={`toolbar-btn ${editor?.isActive('italic') ? 'active' : ''}`}
            title="기울임"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={toggleUnderline}
            className={`toolbar-btn ${editor?.isActive('underline') ? 'active' : ''}`}
            title="밑줄"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={toggleStrike}
            className={`toolbar-btn ${editor?.isActive('strike') ? 'active' : ''}`}
            title="취소선"
          >
            <s>S</s>
          </button>
          <button
            type="button"
            onClick={toggleCode}
            className={`toolbar-btn ${editor?.isActive('code') ? 'active' : ''}`}
            title="코드"
          >
            &lt;/&gt;
          </button>
        </div>

        {/* Text Align */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setTextAlign('left')}
            className={`toolbar-btn ${editor?.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
            title="왼쪽 정렬"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h10M4 18h14"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setTextAlign('center')}
            className={`toolbar-btn ${editor?.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
            title="가운데 정렬"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M7 12h10M5 18h14"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setTextAlign('right')}
            className={`toolbar-btn ${editor?.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
            title="오른쪽 정렬"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M10 12h10M6 18h14"
              />
            </svg>
          </button>
        </div>

        {/* Lists */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={toggleBulletList}
            className={`toolbar-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
            title="글머리 기호"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleOrderedList}
            className={`toolbar-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
            title="번호 매기기"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Special Blocks */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={toggleBlockquote}
            className={`toolbar-btn ${editor?.isActive('blockquote') ? 'active' : ''}`}
            title="인용"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleCodeBlock}
            className={`toolbar-btn ${editor?.isActive('codeBlock') ? 'active' : ''}`}
            title="코드 블록"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </button>
        </div>

        {/* Link & Image */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={addLink}
            className={`toolbar-btn ${editor?.isActive('link') ? 'active' : ''}`}
            title="링크"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>
          {editor?.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              className="toolbar-btn remove-link"
              title="링크 제거"
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button type="button" onClick={addImageEnhanced} className="toolbar-btn" title="이미지">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={undo}
            className="toolbar-btn"
            disabled={!editorState.canUndo}
            title="실행 취소"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={redo}
            className="toolbar-btn"
            disabled={!editorState.canRedo}
            title="다시 실행"
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="mesoft-tiptap-content-wrapper" style={{ minHeight }}>
        <div ref={editorRef} className="mesoft-tiptap-editor" />
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && slashMenuItems.length > 0 && (
        <div
          className="mesoft-slash-menu-container"
          style={{
            position: 'fixed',
            top: slashMenuPosition.top,
            left: slashMenuPosition.left,
            zIndex: 50
          }}
        >
          <SlashCommandMenu
            items={slashMenuItems}
            selectedIndex={slashMenuSelectedIndex}
            onSelect={handleSelectSlashItem}
          />
        </div>
      )}
    </div>
  );
};
