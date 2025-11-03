import "../node_modules/svelte/src/internal/disclose-version.js";
import { get as d } from "../node_modules/svelte/src/internal/client/runtime.js";
import { pop as q, push as w } from "../node_modules/svelte/src/internal/client/context.js";
import { child as o, first_child as z, sibling as A } from "../node_modules/svelte/src/internal/client/dom/operations.js";
import { template_effect as B } from "../node_modules/svelte/src/internal/client/reactivity/effects.js";
import { proxy as D } from "../node_modules/svelte/src/internal/client/proxy.js";
import { set_text as p } from "../node_modules/svelte/src/internal/client/render.js";
import { from_html as s, append as i, comment as E } from "../node_modules/svelte/src/internal/client/dom/template.js";
import { if_block as F } from "../node_modules/svelte/src/internal/client/dom/blocks/if.js";
import { each as G, index as H } from "../node_modules/svelte/src/internal/client/dom/blocks/each.js";
import { delegate as J } from "../node_modules/svelte/src/internal/client/dom/elements/events.js";
import { set_class as K } from "../node_modules/svelte/src/internal/client/dom/elements/class.js";
import { prop as _ } from "../node_modules/svelte/src/internal/client/reactivity/props.js";
/* empty css                         */
var L = s('<div class="mesoft-slash-menu-empty svelte-mvtf40">명령어가 없습니다</div>'), N = s('<button type="button"><span class="icon svelte-mvtf40"> </span> <div class="content svelte-mvtf40"><div class="title svelte-mvtf40"> </div></div></button>'), O = s('<div class="mesoft-slash-menu svelte-mvtf40"><!></div>');
function mt(u, e) {
  w(e, !0);
  let l = _(e, "items", 27, () => D([])), h = _(e, "selectedIndex", 11, 0);
  function x(t) {
    e.onSelect && e.onSelect(t);
  }
  var v = O(), b = o(v);
  {
    var g = (t) => {
      var m = L();
      i(t, m);
    }, k = (t) => {
      var m = E(), y = z(m);
      G(y, 17, l, H, (I, a, f) => {
        var r = N();
        let n;
        r.__click = () => x(f);
        var c = o(r), S = o(c), C = A(c, 2), M = o(C), j = o(M);
        B(() => {
          n = K(r, 1, "mesoft-slash-menu-item svelte-mvtf40", null, n, { selected: f === h() }), p(S, d(a).icon), p(j, d(a).title);
        }), i(I, r);
      }), i(t, m);
    };
    F(b, (t) => {
      l().length === 0 ? t(g) : t(k, !1);
    });
  }
  i(u, v), q();
}
J(["click"]);
export {
  mt as default
};
//# sourceMappingURL=SlashCommandMenu.svelte.js.map
