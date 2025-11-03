import "../node_modules/svelte/src/internal/disclose-version.js";
import { get as u } from "../node_modules/svelte/src/internal/client/runtime.js";
import { pop as Ce, push as xe } from "../node_modules/svelte/src/internal/client/context.js";
import { first_child as Lt, child as m, sibling as a } from "../node_modules/svelte/src/internal/client/dom/operations.js";
import { state as B, set as f } from "../node_modules/svelte/src/internal/client/reactivity/sources.js";
import { user_effect as Ae, template_effect as St } from "../node_modules/svelte/src/internal/client/reactivity/effects.js";
import { delegate as Be } from "../node_modules/svelte/src/internal/client/dom/elements/events.js";
import { comment as Ie, append as I, from_html as j } from "../node_modules/svelte/src/internal/client/dom/template.js";
import { if_block as Q } from "../node_modules/svelte/src/internal/client/dom/blocks/if.js";
import { set_class as i } from "../node_modules/svelte/src/internal/client/dom/elements/class.js";
import { set_style as Rt } from "../node_modules/svelte/src/internal/client/dom/elements/style.js";
import { proxy as R } from "../node_modules/svelte/src/internal/client/proxy.js";
import { bind_this as Z } from "../node_modules/svelte/src/internal/client/dom/elements/bindings/this.js";
import { prop as M } from "../node_modules/svelte/src/internal/client/reactivity/props.js";
import { onMount as Le, tick as Se, onDestroy as Re } from "svelte";
import { Editor as je } from "@tiptap/core";
import { uploadImageToS3 as De, fileToDataUrl as Ee } from "../core/upload.js";
import { getDefaultExtensions as We, addSlashCommandExtension as He } from "../core/editor-config.js";
import { getDefaultSlashItems as Pe } from "../core/extensions/slash-command.js";
import Te from "./SlashCommandMenu.svelte.js";
/* empty css                     */
var Oe = j('<button type="button" class="toolbar-btn remove-link svelte-1p817ma" title="링크 제거"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>'), ze = j('<div class="mesoft-slash-menu-container svelte-1p817ma"><!></div>'), qe = j('<div class="mesoft-tiptap-wrapper svelte-1p817ma"><div class="mesoft-tiptap-toolbar svelte-1p817ma"><div class="toolbar-group svelte-1p817ma"><button type="button" title="본문"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button> <button type="button" title="제목 1">H1</button> <button type="button" title="제목 2">H2</button> <button type="button" title="제목 3">H3</button> <input type="file" accept="image/*" style="display: none;"/></div> <div class="toolbar-group svelte-1p817ma"><button type="button" title="굵게"><strong>B</strong></button> <button type="button" title="기울임"><em>I</em></button> <button type="button" title="밑줄"><u>U</u></button> <button type="button" title="취소선"><s>S</s></button> <button type="button" title="코드">&lt;/&gt;</button></div> <div class="toolbar-group svelte-1p817ma"><button type="button" title="왼쪽 정렬"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14"></path></svg></button> <button type="button" title="가운데 정렬"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14"></path></svg></button> <button type="button" title="오른쪽 정렬"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14"></path></svg></button></div> <div class="toolbar-group svelte-1p817ma"><button type="button" title="글머리 기호"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button> <button type="button" title="번호 매기기"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div> <div class="toolbar-group svelte-1p817ma"><button type="button" title="인용"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></button> <button type="button" title="코드 블록"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></button></div> <div class="toolbar-group svelte-1p817ma"><button type="button" title="링크"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></button> <!> <button type="button" class="toolbar-btn svelte-1p817ma" title="이미지"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button></div> <div class="toolbar-group svelte-1p817ma"><button type="button" class="toolbar-btn svelte-1p817ma" title="실행 취소"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg></button> <button type="button" class="toolbar-btn svelte-1p817ma" title="다시 실행"><svg class="icon svelte-1p817ma" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path></svg></button></div></div> <div class="mesoft-tiptap-content-wrapper svelte-1p817ma"><div class="mesoft-tiptap-editor"></div></div></div> <!>', 1), Fe = j('<div class="mesoft-tiptap-readonly svelte-1p817ma"></div>');
function pn(jt, v) {
  xe(v, !0);
  let D = M(v, "content", 3, ""), Dt = M(v, "placeholder", 3, "내용을 입력하세요..."), L = M(v, "editable", 3, !0), Et = M(v, "minHeight", 3, "200px"), Wt = M(v, "uploadCategory", 3, "notice"), E = M(v, "initialImages", 19, () => []), t = null, U, $ = B(!1), C = null, k = R(/* @__PURE__ */ new Set()), d = R({ canUndo: !1, canRedo: !1, isUpdated: 0 }), x = B(!1), b = B(R([])), h = B(0), S = B(R({ top: 0, left: 0 })), A = null;
  Le(async () => {
    if (await Se(), E() && E().length > 0 && E().forEach((e) => {
      e && !e.startsWith("data:") && !e.startsWith("blob:") && k.add(e);
    }), k.size === 0 && D()) {
      const e = /<img[^>]+src="([^"]+)"/g;
      let o;
      for (; (o = e.exec(D())) !== null; ) {
        const l = o[1];
        l && !l.startsWith("data:") && !l.startsWith("blob:") && k.add(l);
      }
    }
    let n = We({ editable: L(), placeholder: Dt() });
    L() && (n = He(n, {
      items: ({ query: e }) => Pe({ query: e }),
      render: () => ({
        onStart: (e) => {
          A = e, f(b, e.items, !0), f(h, 0), f(x, !0);
          const { clientRect: o } = e;
          if (o) {
            const l = o();
            l && f(
              S,
              {
                top: l.bottom + window.scrollY + 8,
                left: l.left + window.scrollX
              },
              !0
            );
          }
        },
        onUpdate: (e) => {
          A = e, f(b, e.items, !0), f(h, 0);
          const { clientRect: o } = e;
          if (o) {
            const l = o();
            l && f(
              S,
              {
                top: l.bottom + window.scrollY + 8,
                left: l.left + window.scrollX
              },
              !0
            );
          }
        },
        onKeyDown: (e) => e.event.key === "ArrowUp" ? (f(h, (u(h) + u(b).length - 1) % u(b).length), !0) : e.event.key === "ArrowDown" ? (f(h, (u(h) + 1) % u(b).length), !0) : e.event.key === "Enter" ? (u(b)[u(h)] && tt(u(h)), !0) : e.event.key === "Escape" ? (f(x, !1), !0) : !1,
        onExit: () => {
          f(x, !1), A = null;
        }
      })
    })), t = new je({
      element: U,
      extensions: n,
      content: D() || "",
      editable: L(),
      onTransaction: ({ editor: e }) => {
        d.canUndo = e.can().undo(), d.canRedo = e.can().redo(), d.isUpdated++;
      },
      onUpdate: ({ editor: e }) => {
        if (v.onContentChange) {
          const o = e.getHTML();
          v.onContentChange(o);
        }
      },
      onFocus: () => {
        f($, !0);
      },
      onBlur: () => {
        f($, !1);
      },
      editorProps: {
        attributes: { class: "mesoft-tiptap-content" },
        handlePaste: (e, o) => {
          var s;
          const l = (s = o.clipboardData) == null ? void 0 : s.items;
          if (!l) return !1;
          for (const r of l)
            if (r.type.startsWith("image/")) {
              const _ = r.getAsFile();
              if (_)
                return P(_), !0;
            }
          return !1;
        },
        handleDrop: (e, o) => {
          var s;
          const l = o.dataTransfer;
          if (!l || !((s = l.files) != null && s.length)) return !1;
          for (const r of Array.from(l.files))
            if (r.type.startsWith("image/"))
              return P(r), !0;
          return !1;
        }
      }
    });
  }), Re(() => {
    t && t.destroy();
  });
  function tt(n) {
    const e = u(b)[n];
    e && A && t && (e.command({ editor: t, range: A.range }), f(x, !1));
  }
  function Ht() {
    t == null || t.chain().focus().toggleBold().run();
  }
  function Pt() {
    t == null || t.chain().focus().toggleItalic().run();
  }
  function Tt() {
    t == null || t.chain().focus().toggleUnderline().run();
  }
  function Ot() {
    t == null || t.chain().focus().toggleStrike().run();
  }
  function zt() {
    t == null || t.chain().focus().toggleCode().run();
  }
  function W(n) {
    t == null || t.chain().focus().toggleHeading({ level: n }).run();
  }
  function qt() {
    t == null || t.chain().focus().setParagraph().run();
  }
  function Ft() {
    t == null || t.chain().focus().toggleBulletList().run();
  }
  function Xt() {
    t == null || t.chain().focus().toggleOrderedList().run();
  }
  function Yt() {
    t == null || t.chain().focus().toggleCodeBlock().run();
  }
  function Kt() {
    t == null || t.chain().focus().toggleBlockquote().run();
  }
  function H(n) {
    t == null || t.chain().focus().setTextAlign(n).run();
  }
  function Nt() {
    const n = window.prompt("URL을 입력하세요:");
    if (n) {
      let e = n;
      n.match(/^https?:\/\//) || (e = `https://${n}`), t == null || t.chain().focus().setLink({ href: e }).run();
    }
  }
  function Vt() {
    t == null || t.chain().focus().unsetLink().run();
  }
  async function Gt() {
    const n = window.prompt("이미지 URL을 입력하거나 취소하면 파일 업로드 창이 열립니다.");
    if (n && n.trim()) {
      const e = n.match(/^https?:\/\//) ? n : `https://${n}`;
      t == null || t.chain().focus().setImage({ src: e }).run();
      return;
    }
    C == null || C.click();
  }
  async function Jt(n) {
    const e = n.target;
    if (!e.files || e.files.length === 0) return;
    const o = e.files[0];
    await P(o), e.value = "";
  }
  async function P(n) {
    if (!t) return;
    const e = URL.createObjectURL(n), { selection: o } = t.state, l = o.$anchor.pos;
    t.chain().insertContentAt(l, { type: "image", attrs: { src: e } }).run();
    try {
      let s, r;
      if (v.onImageUpload) {
        const p = await v.onImageUpload(n);
        typeof p == "string" ? (s = p, r = { src: s }) : (r = p, s = p.src);
      } else
        try {
          s = await De(n, Wt(), v.uploadConfig), r = { src: s };
        } catch (p) {
          const y = p instanceof Error ? p.message : String(p);
          y.includes("CORS") ? (console.warn("⚠️ S3 CORS 설정 필요:", y), console.warn("→ Data URL로 폴백됩니다.")) : console.error("S3 업로드 실패, Data URL로 폴백:", p), s = await Ee(n), r = { src: s };
        }
      const { state: _ } = t, w = Qt(_, e);
      if (w !== null) {
        const p = t.state.tr.setNodeMarkup(w, void 0, r);
        t.view.dispatch(p);
      }
      !s.startsWith("data:") && !s.startsWith("blob:") && k.add(s);
    } catch (s) {
      console.error("이미지 업로드 실패:", s), t.commands.undo();
    } finally {
      URL.revokeObjectURL(e);
    }
  }
  function Qt(n, e) {
    let o = null;
    return n.doc.descendants((l, s) => {
      l.type.name === "image" && l.attrs.src === e && (o = s);
    }), o;
  }
  function Zt() {
    const n = /* @__PURE__ */ new Set();
    return t && t.state.doc.descendants((e) => {
      if (e.type.name === "image" && e.attrs.src) {
        const o = e.attrs.src;
        !o.startsWith("data:") && !o.startsWith("blob:") && n.add(o);
      }
    }), n;
  }
  function $t() {
    if (!v.onUnusedImagesChange) return;
    const n = Zt(), e = [];
    k.forEach((o) => {
      n.has(o) || e.push(o);
    }), v.onUnusedImagesChange(e);
  }
  Ae(() => {
    d.isUpdated, t && k.size > 0 && $t();
  });
  function te() {
    t == null || t.chain().focus().undo().run();
  }
  function ee() {
    t == null || t.chain().focus().redo().run();
  }
  var et = Ie(), ne = Lt(et);
  {
    var oe = (n) => {
      var e = qe(), o = Lt(e), l = m(o);
      l.__mousedown = (c) => c.preventDefault();
      var s = m(l), r = m(s);
      r.__click = qt;
      let _;
      var w = a(r, 2);
      w.__click = () => W(1);
      let p;
      var y = a(w, 2);
      y.__click = () => W(2);
      let nt;
      var T = a(y, 2);
      T.__click = () => W(3);
      let ot;
      var lt = a(T, 2);
      lt.__change = Jt, Z(lt, (c) => C = c, () => C);
      var st = a(s, 2), O = m(st);
      O.__click = Ht;
      let at;
      var z = a(O, 2);
      z.__click = Pt;
      let it;
      var q = a(z, 2);
      q.__click = Tt;
      let rt;
      var F = a(q, 2);
      F.__click = Ot;
      let ct;
      var ut = a(F, 2);
      ut.__click = zt;
      let vt;
      var pt = a(st, 2), X = m(pt);
      X.__click = () => H("left");
      let ft;
      var Y = a(X, 2);
      Y.__click = () => H("center");
      let mt;
      var dt = a(Y, 2);
      dt.__click = () => H("right");
      let bt;
      var ht = a(pt, 2), K = m(ht);
      K.__click = Ft;
      let gt;
      var _t = a(K, 2);
      _t.__click = Xt;
      let kt;
      var wt = a(ht, 2), N = m(wt);
      N.__click = Kt;
      let yt;
      var Mt = a(N, 2);
      Mt.__click = Yt;
      let Ut;
      var Ct = a(wt, 2), V = m(Ct);
      V.__click = Nt;
      let xt;
      var At = a(V, 2);
      {
        var se = (c) => {
          var g = Oe();
          g.__click = Vt, I(c, g);
        };
        Q(At, (c) => {
          t != null && t.isActive("link") && c(se);
        });
      }
      var ae = a(At, 2);
      ae.__click = Gt;
      var ie = a(Ct, 2), G = m(ie);
      G.__click = te;
      var Bt = a(G, 2);
      Bt.__click = ee;
      var It = a(l, 2), re = m(It);
      Z(re, (c) => U = c, () => U);
      var ce = a(o, 2);
      {
        var ue = (c) => {
          var g = ze(), J = m(g);
          Te(J, {
            get items() {
              return u(b);
            },
            get selectedIndex() {
              return u(h);
            },
            onSelect: tt
          }), St(() => Rt(g, `position: fixed; top: ${u(S).top ?? ""}px; left: ${u(S).left ?? ""}px; z-index: 50;`)), I(c, g);
        };
        Q(ce, (c) => {
          u(x) && u(b).length > 0 && c(ue);
        });
      }
      St(
        (c, g, J, ve, pe, fe, me, de, be, he, ge, _e, ke, we, ye, Me, Ue) => {
          _ = i(r, 1, "toolbar-btn svelte-1p817ma", null, _, c), p = i(w, 1, "toolbar-btn svelte-1p817ma", null, p, g), nt = i(y, 1, "toolbar-btn svelte-1p817ma", null, nt, J), ot = i(T, 1, "toolbar-btn svelte-1p817ma", null, ot, ve), at = i(O, 1, "toolbar-btn svelte-1p817ma", null, at, pe), it = i(z, 1, "toolbar-btn svelte-1p817ma", null, it, fe), rt = i(q, 1, "toolbar-btn svelte-1p817ma", null, rt, me), ct = i(F, 1, "toolbar-btn svelte-1p817ma", null, ct, de), vt = i(ut, 1, "toolbar-btn svelte-1p817ma", null, vt, be), ft = i(X, 1, "toolbar-btn svelte-1p817ma", null, ft, he), mt = i(Y, 1, "toolbar-btn svelte-1p817ma", null, mt, ge), bt = i(dt, 1, "toolbar-btn svelte-1p817ma", null, bt, _e), gt = i(K, 1, "toolbar-btn svelte-1p817ma", null, gt, ke), kt = i(_t, 1, "toolbar-btn svelte-1p817ma", null, kt, we), yt = i(N, 1, "toolbar-btn svelte-1p817ma", null, yt, ye), Ut = i(Mt, 1, "toolbar-btn svelte-1p817ma", null, Ut, Me), xt = i(V, 1, "toolbar-btn svelte-1p817ma", null, xt, Ue), G.disabled = !d.canUndo, Bt.disabled = !d.canRedo, Rt(It, `min-height: ${Et() ?? ""};`);
        },
        [
          () => ({
            active: d.isUpdated >= 0 && (t == null ? void 0 : t.isActive("paragraph"))
          }),
          () => ({
            active: d.isUpdated >= 0 && (t == null ? void 0 : t.isActive("heading", { level: 1 }))
          }),
          () => ({
            active: d.isUpdated >= 0 && (t == null ? void 0 : t.isActive("heading", { level: 2 }))
          }),
          () => ({
            active: d.isUpdated >= 0 && (t == null ? void 0 : t.isActive("heading", { level: 3 }))
          }),
          () => ({ active: t == null ? void 0 : t.isActive("bold") }),
          () => ({ active: t == null ? void 0 : t.isActive("italic") }),
          () => ({ active: t == null ? void 0 : t.isActive("underline") }),
          () => ({ active: t == null ? void 0 : t.isActive("strike") }),
          () => ({ active: t == null ? void 0 : t.isActive("code") }),
          () => ({ active: t == null ? void 0 : t.isActive({ textAlign: "left" }) }),
          () => ({ active: t == null ? void 0 : t.isActive({ textAlign: "center" }) }),
          () => ({ active: t == null ? void 0 : t.isActive({ textAlign: "right" }) }),
          () => ({ active: t == null ? void 0 : t.isActive("bulletList") }),
          () => ({ active: t == null ? void 0 : t.isActive("orderedList") }),
          () => ({ active: t == null ? void 0 : t.isActive("blockquote") }),
          () => ({ active: t == null ? void 0 : t.isActive("codeBlock") }),
          () => ({ active: t == null ? void 0 : t.isActive("link") })
        ]
      ), I(n, e);
    }, le = (n) => {
      var e = Fe();
      Z(e, (o) => U = o, () => U), I(n, e);
    };
    Q(ne, (n) => {
      L() ? n(oe) : n(le, !1);
    });
  }
  I(jt, et), Ce();
}
Be(["mousedown", "click", "change"]);
export {
  pn as default
};
//# sourceMappingURL=TiptapEditor.svelte.js.map
