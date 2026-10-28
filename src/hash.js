// Huella de un texto base (igual en build y en la app): FNV-1a de zh + traducción.
function textHash(zh, es) {
  const s = zh + '\u0001' + JSON.stringify(es || null);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}
if (typeof module !== 'undefined') module.exports = { textHash };
