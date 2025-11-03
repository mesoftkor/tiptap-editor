import "../node_modules/svelte/src/internal/disclose-version.js";
import { pop as m, push as h } from "../node_modules/svelte/src/internal/client/context.js";
import { prop as t } from "../node_modules/svelte/src/internal/client/reactivity/props.js";
import C from "./TiptapEditor.svelte.js";
function U(a, e) {
  h(e, !0);
  let n = t(e, "value", 15, ""), i = t(e, "placeholder", 3, "내용을 입력하세요..."), o = t(e, "editable", 3, !0), g = t(e, "minHeight", 3, "200px"), r = t(e, "uploadCategory", 3, "notice"), l = t(e, "initialImages", 19, () => []);
  function u(d) {
    n(d);
  }
  C(a, {
    get content() {
      return n();
    },
    get placeholder() {
      return i();
    },
    get editable() {
      return o();
    },
    get minHeight() {
      return g();
    },
    get uploadCategory() {
      return r();
    },
    get initialImages() {
      return l();
    },
    onContentChange: u,
    get onUnusedImagesChange() {
      return e.onUnusedImagesChange;
    },
    get onImageUpload() {
      return e.onImageUpload;
    },
    get uploadConfig() {
      return e.uploadConfig;
    }
  }), m();
}
export {
  U as default
};
//# sourceMappingURL=RichTextEditor.svelte.js.map
