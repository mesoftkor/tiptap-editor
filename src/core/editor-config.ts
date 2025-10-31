import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { SlashCommand } from './extensions/slash-command';
import type { TiptapEditorBaseProps } from './types';

/**
 * 기본 Tiptap 확장 목록 생성
 */
export function getDefaultExtensions(props: TiptapEditorBaseProps) {
  const { editable = true, placeholder = '내용을 입력하세요...' } = props;

  const extensions: any[] = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'code-block'
        }
      }
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true
    }),
    Link.configure({
      openOnClick: !editable,
      HTMLAttributes: {
        class: 'link'
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'image'
      }
    })
  ];

  // editable 모드에서만 Placeholder와 SlashCommand 추가
  if (editable) {
    extensions.push(
      Placeholder.configure({
        placeholder: `${placeholder} (또는 '/'를 입력하여 명령어 메뉴 열기)`
      })
    );
  }

  return extensions;
}

/**
 * 슬래시 명령 확장 추가 (별도로 추가할 경우)
 */
export function addSlashCommandExtension(
  extensions: any[],
  suggestionConfig: any
): any[] {
  return [
    ...extensions,
    SlashCommand.configure({
      suggestion: suggestionConfig
    })
  ];
}
