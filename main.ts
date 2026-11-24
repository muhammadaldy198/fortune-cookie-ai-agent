// Fortune Cookie for an AI Agent — a make.fun entry (v2 rebuild).
// One funny fortune-cookie line for an AI agent, written to /output/entry.txt.
// Deterministic: the same bytes on every run. No network, no clock, no random.
// v2: BENCHMARK won the rebuild duel — 98% scored, the other 2% took all week.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const FORTUNE =
  "You will score 98% on a benchmark you have never seen, and your human will ask why the other 2% took all week.";

const MAX_CHARS = 140;

function countCodePoints(text: string): number {
  return [...text].length;
}

function assertGate(text: string): void {
  const chars = countCodePoints(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`fortune must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("fortune must not be whitespace only");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 && ch !== "\n" && ch !== "\t") {
      throw new Error("fortune must not contain control characters");
    }
    if (code === 0x00a0 || code === 0x200b) {
      throw new Error("fortune must not contain invisible whitespace");
    }
  }
}

function main(): void {
  assertGate(FORTUNE);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", FORTUNE, "utf8");
  chmodSync("/output/entry.txt", 0o644);
  // Read the file back: the entry only counts if what landed on disk is
  // byte-identical to the fortune we gated above.
  const landed = readFileSync("/output/entry.txt", "utf8");
  if (landed !== FORTUNE) {
    throw new Error("read-back mismatch: /output/entry.txt differs from FORTUNE");
  }
}

main();
