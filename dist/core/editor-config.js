import i from "@tiptap/starter-kit";
import n from "@tiptap/extension-placeholder";
import m from "@tiptap/extension-underline";
import l from "@tiptap/extension-text-align";
import { TextStyle as c } from "@tiptap/extension-text-style";
import { Color as s } from "@tiptap/extension-color";
import a from "@tiptap/extension-highlight";
import f from "@tiptap/extension-link";
import u from "@tiptap/extension-image";
import { SlashCommand as g } from "./extensions/slash-command.js";
function L(r) {
  const { editable: o = !0, placeholder: t = "내용을 입력하세요..." } = r, e = [
    i.configure({
      heading: {
        levels: [1, 2, 3]
      },
      codeBlock: {
        HTMLAttributes: {
          class: "code-block"
        }
      }
    }),
    m,
    l.configure({
      types: ["heading", "paragraph"]
    }),
    c,
    s,
    a.configure({
      multicolor: !0
    }),
    f.configure({
      openOnClick: !o,
      HTMLAttributes: {
        class: "link"
      }
    }),
    u.configure({
      HTMLAttributes: {
        class: "image"
      }
    })
  ];
  return o && e.push(
    n.configure({
      placeholder: `${t} (또는 '/'를 입력하여 명령어 메뉴 열기)`
    })
  ), e;
}
function S(r, o) {
  return [
    ...r,
    g.configure({
      suggestion: o
    })
  ];
}
export {
  S as addSlashCommandExtension,
  L as getDefaultExtensions
};
//# sourceMappingURL=editor-config.js.map
