import { Extension as i } from "@tiptap/core";
import c from "@tiptap/suggestion";
const r = i.create({
  name: "slashCommand",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: !1,
        command: ({ editor: n, range: o, props: e }) => {
          e.command({ editor: n, range: o });
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      c({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
function d({ query: n }) {
  return [
    {
      title: "제목 1",
      description: "큰 제목",
      icon: "H1",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).setHeading({ level: 1 }).run();
      }
    },
    {
      title: "제목 2",
      description: "중간 제목",
      icon: "H2",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).setHeading({ level: 2 }).run();
      }
    },
    {
      title: "제목 3",
      description: "작은 제목",
      icon: "H3",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).setHeading({ level: 3 }).run();
      }
    },
    {
      title: "본문",
      description: "일반 텍스트",
      icon: "¶",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).setParagraph().run();
      }
    },
    {
      title: "글머리 기호",
      description: "글머리 기호 목록",
      icon: "•",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).toggleBulletList().run();
      }
    },
    {
      title: "번호 매기기",
      description: "번호 매기기 목록",
      icon: "1.",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).toggleOrderedList().run();
      }
    },
    {
      title: "인용",
      description: "인용 블록",
      icon: "❝",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).toggleBlockquote().run();
      }
    },
    {
      title: "코드 블록",
      description: "코드 블록",
      icon: "</>",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).toggleCodeBlock().run();
      }
    },
    {
      title: "구분선",
      description: "수평 구분선",
      icon: "―",
      command: ({ editor: e, range: t }) => {
        e.chain().focus().deleteRange(t).setHorizontalRule().run();
      }
    }
  ].filter(
    (e) => e.title.toLowerCase().includes(n.toLowerCase())
  );
}
export {
  r as SlashCommand,
  d as getDefaultSlashItems
};
//# sourceMappingURL=slash-command.js.map
