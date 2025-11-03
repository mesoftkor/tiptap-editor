import { jsx as e, jsxs as c } from "react/jsx-runtime";
const o = ({
  items: t,
  selectedIndex: n,
  onSelect: a
}) => /* @__PURE__ */ e("div", { className: "mesoft-slash-menu", children: t.length === 0 ? /* @__PURE__ */ e("div", { className: "mesoft-slash-menu-empty", children: "명령어가 없습니다" }) : t.map((s, l) => /* @__PURE__ */ c(
  "button",
  {
    type: "button",
    className: `mesoft-slash-menu-item ${l === n ? "selected" : ""}`,
    onClick: () => a(l),
    children: [
      /* @__PURE__ */ e("span", { className: "icon", children: s.icon }),
      /* @__PURE__ */ e("div", { className: "content", children: /* @__PURE__ */ e("div", { className: "title", children: s.title }) })
    ]
  },
  `${s.title}-${l}`
)) });
export {
  o as SlashCommandMenu
};
//# sourceMappingURL=SlashCommandMenu.js.map
