import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import type { SuggestionOptions } from '@tiptap/suggestion';
import type { SlashCommandItem } from '../types';

export { type SlashCommandItem };

/**
 * 슬래시 명령 확장
 */
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        }
      } as Partial<SuggestionOptions>
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});

/**
 * 기본 슬래시 명령 아이템 목록
 */
export function getDefaultSlashItems({ query }: { query: string }): SlashCommandItem[] {
  const items: SlashCommandItem[] = [
    {
      title: '제목 1',
      description: '큰 제목',
      icon: 'H1',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
      }
    },
    {
      title: '제목 2',
      description: '중간 제목',
      icon: 'H2',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
      }
    },
    {
      title: '제목 3',
      description: '작은 제목',
      icon: 'H3',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
      }
    },
    {
      title: '본문',
      description: '일반 텍스트',
      icon: '¶',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setParagraph().run();
      }
    },
    {
      title: '글머리 기호',
      description: '글머리 기호 목록',
      icon: '•',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      }
    },
    {
      title: '번호 매기기',
      description: '번호 매기기 목록',
      icon: '1.',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      }
    },
    {
      title: '인용',
      description: '인용 블록',
      icon: '❝',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      }
    },
    {
      title: '코드 블록',
      description: '코드 블록',
      icon: '</>',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      }
    },
    {
      title: '구분선',
      description: '수평 구분선',
      icon: '―',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      }
    }
  ];

  return items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}
