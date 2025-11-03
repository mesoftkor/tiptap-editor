function o(n) {
  var r;
  const t = ((r = n.split("\\").pop()) == null ? void 0 : r.split("/").pop()) || "upload", e = Date.now();
  return `${t.replace(/\s+/g, "-")}-${e}`;
}
function u(n) {
  return new Promise((t, e) => {
    const r = new FileReader();
    r.onload = () => t(String(r.result)), r.onerror = e, r.readAsDataURL(n);
  });
}
async function c(n, t, e) {
  const r = await fetch(n, {
    method: "PUT",
    headers: {
      "Content-Type": t.type || "application/octet-stream",
      ...e || {}
    },
    body: t
  });
  if (!r.ok) {
    const s = await r.text().catch(() => "");
    throw new Error(`S3 업로드 실패: ${r.status} ${s}`);
  }
  return r;
}
async function i(n, t = "temp", e) {
  if (!e)
    throw new Error("uploadConfig가 설정되지 않았습니다.");
  const { uploadUrl: r, publicUrl: s, headers: a } = await e.getPresignedUrl(
    o(n.name),
    n.type || "application/octet-stream",
    t,
    e.token
  );
  return await c(r, n, a), e.convertToCustomDomain ? e.convertToCustomDomain(s) : s;
}
async function l(n, t) {
  if (!n || n.length === 0)
    return { success: !0, deletedCount: 0 };
  if (!(t != null && t.deleteImages))
    return console.warn("deleteImages 함수가 설정되지 않았습니다. 이미지 삭제를 건너뜁니다."), { success: !0, deletedCount: 0 };
  try {
    return await t.deleteImages(n, t.token);
  } catch (e) {
    return console.error("S3 이미지 삭제 실패:", e), {
      success: !1,
      deletedCount: 0,
      message: e instanceof Error ? e.message : "이미지 삭제 중 오류 발생"
    };
  }
}
export {
  l as deleteS3Images,
  u as fileToDataUrl,
  c as putToPresignedUrl,
  o as sanitizeFilename,
  i as uploadImageToS3
};
//# sourceMappingURL=upload.js.map
