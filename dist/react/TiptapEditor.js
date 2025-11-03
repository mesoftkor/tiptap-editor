import { jsx as e, jsxs as h } from "react/jsx-runtime";
import { useRef as L, useState as f, useEffect as z, useCallback as B } from "react";
import { Editor as mt } from "@tiptap/core";
import { uploadImageToS3 as pt, fileToDataUrl as bt } from "../core/upload.js";
import { getDefaultExtensions as gt, addSlashCommandExtension as kt } from "../core/editor-config.js";
import { getDefaultSlashItems as vt } from "../core/extensions/slash-command.js";
import { SlashCommandMenu as wt } from "./SlashCommandMenu.js";
/* empty css                 */
const At = ({
  content: N = "",
  placeholder: q = "내용을 입력하세요...",
  editable: p = !0,
  minHeight: F = "200px",
  uploadCategory: X = "notice",
  initialImages: y = [],
  onImageUpload: W,
  onUnusedImagesChange: C,
  onContentChange: R,
  uploadConfig: Y
}) => {
  const b = L(null), $ = L(null), [t, _] = f(null), [g, j] = f(/* @__PURE__ */ new Set()), [M, K] = f({
    canUndo: !1,
    canRedo: !1,
    isUpdated: 0
  }), [V, k] = f(!1), [v, E] = f([]), [x, w] = f(0), [I, D] = f({ top: 0, left: 0 }), d = L(null), G = L(!1);
  z(() => {
    if (!b.current) return;
    const n = /* @__PURE__ */ new Set();
    if (y && y.length > 0 && y.forEach((s) => {
      s && !s.startsWith("data:") && !s.startsWith("blob:") && n.add(s);
    }), n.size === 0 && N) {
      const s = /<img[^>]+src="([^"]+)"/g;
      let r;
      for (; (r = s.exec(N)) !== null; ) {
        const o = r[1];
        o && !o.startsWith("data:") && !o.startsWith("blob:") && n.add(o);
      }
    }
    j(n);
    let l = gt({ editable: p, placeholder: q });
    p && (l = kt(l, {
      items: ({ query: s }) => vt({ query: s }),
      render: () => ({
        onStart: (s) => {
          d.current = s, E(s.items), w(0), k(!0);
          const { clientRect: r } = s;
          if (r) {
            const o = r();
            o && D({
              top: o.bottom + window.scrollY + 8,
              left: o.left + window.scrollX
            });
          }
        },
        onUpdate: (s) => {
          d.current = s, E(s.items), w(0);
          const { clientRect: r } = s;
          if (r) {
            const o = r();
            o && D({
              top: o.bottom + window.scrollY + 8,
              left: o.left + window.scrollX
            });
          }
        },
        onKeyDown: (s) => {
          var r;
          return s.event.key === "ArrowUp" ? (w((o) => {
            var i;
            const a = ((i = d.current) == null ? void 0 : i.items) || [];
            return (o + a.length - 1) % a.length;
          }), !0) : s.event.key === "ArrowDown" ? (w((o) => {
            var i;
            const a = ((i = d.current) == null ? void 0 : i.items) || [];
            return (o + 1) % a.length;
          }), !0) : s.event.key === "Enter" ? ((((r = d.current) == null ? void 0 : r.items) || [])[x] && P(x), !0) : s.event.key === "Escape" ? (k(!1), !0) : !1;
        },
        onExit: () => {
          k(!1), d.current = null;
        }
      })
    }));
    const c = new mt({
      element: b.current,
      extensions: l,
      content: N || "",
      editable: p,
      onTransaction: ({ editor: s }) => {
        K({
          canUndo: s.can().undo(),
          canRedo: s.can().redo(),
          isUpdated: Date.now()
        });
      },
      onUpdate: ({ editor: s }) => {
        if (!G.current && R) {
          const r = s.getHTML();
          R(r);
        }
      },
      editorProps: {
        attributes: {
          class: "mesoft-tiptap-content"
        },
        handlePaste: (s, r) => {
          var a;
          const o = (a = r.clipboardData) == null ? void 0 : a.items;
          if (!o) return !1;
          for (const i of Array.from(o))
            if (i.type.startsWith("image/")) {
              const m = i.getAsFile();
              if (m)
                return S(m, c), !0;
            }
          return !1;
        },
        handleDrop: (s, r) => {
          var a;
          const o = r.dataTransfer;
          if (!o || !((a = o.files) != null && a.length)) return !1;
          for (const i of Array.from(o.files))
            if (i.type.startsWith("image/"))
              return S(i, c), !0;
          return !1;
        }
      }
    });
    return _(c), () => {
      c.destroy();
    };
  }, []);
  const P = B(
    (n) => {
      const l = v[n];
      l && d.current && t && (l.command({ editor: t, range: d.current.range }), k(!1));
    },
    [v, t]
  ), S = async (n, l) => {
    if (!l) return;
    const c = URL.createObjectURL(n), { selection: s } = l.state, r = s.$anchor.pos;
    l.chain().insertContentAt(r, {
      type: "image",
      attrs: { src: c }
    }).run();
    try {
      let o, a;
      if (W) {
        const u = await W(n);
        typeof u == "string" ? (o = u, a = { src: o }) : (a = u, o = u.src);
      } else
        try {
          o = await pt(n, X, Y), a = { src: o };
        } catch (u) {
          const O = u instanceof Error ? u.message : String(u);
          O.includes("CORS") ? (console.warn("⚠️ S3 CORS 설정 필요:", O), console.warn("→ Data URL로 폴백됩니다.")) : console.error("S3 업로드 실패, Data URL로 폴백:", u), o = await bt(n), a = { src: o };
        }
      const { state: i } = l, m = J(i, c);
      if (m !== null) {
        const u = l.state.tr.setNodeMarkup(m, void 0, a);
        l.view.dispatch(u);
      }
      !o.startsWith("data:") && !o.startsWith("blob:") && j((u) => new Set(u).add(o));
    } catch (o) {
      console.error("이미지 업로드 실패:", o), l.commands.undo();
    } finally {
      URL.revokeObjectURL(c);
    }
  }, J = (n, l) => {
    let c = null;
    return n.doc.descendants((s, r) => {
      s.type.name === "image" && s.attrs.src === l && (c = r);
    }), c;
  }, T = B(() => {
    const n = /* @__PURE__ */ new Set();
    return t && t.state.doc.descendants((l) => {
      if (l.type.name === "image" && l.attrs.src) {
        const c = l.attrs.src;
        !c.startsWith("data:") && !c.startsWith("blob:") && n.add(c);
      }
    }), n;
  }, [t]), H = B(() => {
    if (!C) return;
    const n = T(), l = [];
    g.forEach((c) => {
      n.has(c) || l.push(c);
    }), C(l);
  }, [T, g, C]);
  z(() => {
    t && g.size > 0 && H();
  }, [M.isUpdated, t, g, H]);
  const Q = () => t == null ? void 0 : t.chain().focus().toggleBold().run(), Z = () => t == null ? void 0 : t.chain().focus().toggleItalic().run(), tt = () => t == null ? void 0 : t.chain().focus().toggleUnderline().run(), et = () => t == null ? void 0 : t.chain().focus().toggleStrike().run(), nt = () => t == null ? void 0 : t.chain().focus().toggleCode().run(), U = (n) => t == null ? void 0 : t.chain().focus().toggleHeading({ level: n }).run(), ot = () => t == null ? void 0 : t.chain().focus().setParagraph().run(), st = () => t == null ? void 0 : t.chain().focus().toggleBulletList().run(), lt = () => t == null ? void 0 : t.chain().focus().toggleOrderedList().run(), ct = () => t == null ? void 0 : t.chain().focus().toggleCodeBlock().run(), rt = () => t == null ? void 0 : t.chain().focus().toggleBlockquote().run(), A = (n) => t == null ? void 0 : t.chain().focus().setTextAlign(n).run(), at = () => t == null ? void 0 : t.chain().focus().undo().run(), it = () => t == null ? void 0 : t.chain().focus().redo().run(), ut = () => {
    const n = window.prompt("URL을 입력하세요:");
    if (n) {
      let l = n;
      n.match(/^https?:\/\//) || (l = `https://${n}`), t == null || t.chain().focus().setLink({ href: l }).run();
    }
  }, ht = () => t == null ? void 0 : t.chain().focus().unsetLink().run(), dt = () => {
    var l;
    const n = window.prompt("이미지 URL을 입력하거나 취소하면 파일 업로드 창이 열립니다.");
    if (n && n.trim()) {
      const c = n.match(/^https?:\/\//) ? n : `https://${n}`;
      t == null || t.chain().focus().setImage({ src: c }).run();
      return;
    }
    (l = $.current) == null || l.click();
  }, ft = async (n) => {
    var c;
    const l = (c = n.target.files) == null ? void 0 : c[0];
    !l || !t || (await S(l, t), n.target.value = "");
  };
  return p ? /* @__PURE__ */ h("div", { className: "mesoft-tiptap-wrapper", children: [
    /* @__PURE__ */ h("div", { className: "mesoft-tiptap-toolbar", onMouseDown: (n) => n.preventDefault(), children: [
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: ot,
            className: `toolbar-btn ${t != null && t.isActive("paragraph") ? "active" : ""}`,
            title: "본문",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M4 6h16M4 12h16M4 18h16"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => U(1),
            className: `toolbar-btn ${t != null && t.isActive("heading", { level: 1 }) ? "active" : ""}`,
            title: "제목 1",
            children: "H1"
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => U(2),
            className: `toolbar-btn ${t != null && t.isActive("heading", { level: 2 }) ? "active" : ""}`,
            title: "제목 2",
            children: "H2"
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => U(3),
            className: `toolbar-btn ${t != null && t.isActive("heading", { level: 3 }) ? "active" : ""}`,
            title: "제목 3",
            children: "H3"
          }
        ),
        /* @__PURE__ */ e(
          "input",
          {
            ref: $,
            type: "file",
            accept: "image/*",
            onChange: ft,
            style: { display: "none" }
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: Q,
            className: `toolbar-btn ${t != null && t.isActive("bold") ? "active" : ""}`,
            title: "굵게",
            children: /* @__PURE__ */ e("strong", { children: "B" })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: Z,
            className: `toolbar-btn ${t != null && t.isActive("italic") ? "active" : ""}`,
            title: "기울임",
            children: /* @__PURE__ */ e("em", { children: "I" })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: tt,
            className: `toolbar-btn ${t != null && t.isActive("underline") ? "active" : ""}`,
            title: "밑줄",
            children: /* @__PURE__ */ e("u", { children: "U" })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: et,
            className: `toolbar-btn ${t != null && t.isActive("strike") ? "active" : ""}`,
            title: "취소선",
            children: /* @__PURE__ */ e("s", { children: "S" })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: nt,
            className: `toolbar-btn ${t != null && t.isActive("code") ? "active" : ""}`,
            title: "코드",
            children: "</>"
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => A("left"),
            className: `toolbar-btn ${t != null && t.isActive({ textAlign: "left" }) ? "active" : ""}`,
            title: "왼쪽 정렬",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M4 6h16M4 12h10M4 18h14"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => A("center"),
            className: `toolbar-btn ${t != null && t.isActive({ textAlign: "center" }) ? "active" : ""}`,
            title: "가운데 정렬",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M4 6h16M7 12h10M5 18h14"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => A("right"),
            className: `toolbar-btn ${t != null && t.isActive({ textAlign: "right" }) ? "active" : ""}`,
            title: "오른쪽 정렬",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M4 6h16M10 12h10M6 18h14"
              }
            ) })
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: st,
            className: `toolbar-btn ${t != null && t.isActive("bulletList") ? "active" : ""}`,
            title: "글머리 기호",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M4 6h16M4 12h16M4 18h16"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: lt,
            className: `toolbar-btn ${t != null && t.isActive("orderedList") ? "active" : ""}`,
            title: "번호 매기기",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M9 5l7 7-7 7"
              }
            ) })
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: rt,
            className: `toolbar-btn ${t != null && t.isActive("blockquote") ? "active" : ""}`,
            title: "인용",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: ct,
            className: `toolbar-btn ${t != null && t.isActive("codeBlock") ? "active" : ""}`,
            title: "코드 블록",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              }
            ) })
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: ut,
            className: `toolbar-btn ${t != null && t.isActive("link") ? "active" : ""}`,
            title: "링크",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              }
            ) })
          }
        ),
        (t == null ? void 0 : t.isActive("link")) && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: ht,
            className: "toolbar-btn remove-link",
            title: "링크 제거",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M6 18L18 6M6 6l12 12"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", onClick: dt, className: "toolbar-btn", title: "이미지", children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          }
        ) }) })
      ] }),
      /* @__PURE__ */ h("div", { className: "toolbar-group", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: at,
            className: "toolbar-btn",
            disabled: !M.canUndo,
            title: "실행 취소",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              }
            ) })
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: it,
            className: "toolbar-btn",
            disabled: !M.canRedo,
            title: "다시 실행",
            children: /* @__PURE__ */ e("svg", { className: "icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
              }
            ) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "mesoft-tiptap-content-wrapper", style: { minHeight: F }, children: /* @__PURE__ */ e("div", { ref: b, className: "mesoft-tiptap-editor" }) }),
    V && v.length > 0 && /* @__PURE__ */ e(
      "div",
      {
        className: "mesoft-slash-menu-container",
        style: {
          position: "fixed",
          top: I.top,
          left: I.left,
          zIndex: 50
        },
        children: /* @__PURE__ */ e(
          wt,
          {
            items: v,
            selectedIndex: x,
            onSelect: P
          }
        )
      }
    )
  ] }) : /* @__PURE__ */ e("div", { ref: b, className: "mesoft-tiptap-readonly" });
};
export {
  At as TiptapEditor
};
//# sourceMappingURL=TiptapEditor.js.map
