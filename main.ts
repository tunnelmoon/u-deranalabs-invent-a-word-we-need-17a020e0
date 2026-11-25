// Invent a Word We Need: one coined English word with a one-line definition.
// Entry: "showergument" - the argument you finally win, alone in the shower,
// hours too late. A gap every reader recognises at once, named in a word
// that sounds like English could have grown it.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "showergument (n.): the argument you finally win, alone in the shower, hours too late.";

// The entry must be shaped like a dictionary headword: one lowercase word,
// its part of speech, a colon, then the definition. A coinage without a
// definition, or a definition without its word, must fail loudly here
// instead of shipping as a valid-looking entry.
if (!/^[a-z]+ \(n\.\): .+/.test(ENTRY)) {
  throw new Error("entry must be shaped 'word (n.): definition'");
}
if (ENTRY.includes("  ")) {
  throw new Error("entry must not contain doubled spaces");
}

// Gate: UTF-8 text of 1 to 140 characters, not only white space, single line.
if (ENTRY.length < 1 || ENTRY.length > 140) {
  throw new Error(`entry must be 1 to 140 characters, got ${ENTRY.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
// Reject control characters: the entry must be plain readable text.
for (const ch of ENTRY) {
  if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
    throw new Error("entry must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip read-back check: what was written must be exactly the entry.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("round-trip read-back mismatch");
}
if (back.length < 1 || back.length > 140 || back.trim().length === 0) {
  throw new Error("read-back failed the gate");
}
// The read-back bytes must match the entry exactly, byte for byte.
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error("read-back byte length mismatch");
}
console.log(`wrote ${outPath} (${back.length} chars)`);
