import { describe, it, expect, vi, beforeEach } from "vitest";

// CART-B01: save() must call mkdirSync before writeFileSync.
// Before the fix, graph.ts uses `await import("fs")` in a non-async function,
// which is a TS1308 compile error and means mkdirSync is never called.

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    mkdirSync: vi.fn(actual.mkdirSync),    // spy, but still call through
    writeFileSync: vi.fn(actual.writeFileSync),
    readFileSync: actual.readFileSync,
    existsSync: actual.existsSync,
  };
});

describe("graph — CART-B01: mkdirSync called before writeFileSync in save()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("addNode() calls mkdirSync before writeFileSync (regression guard for save() bug)", async () => {
    const fs = await import("fs");
    const mkdirSyncSpy = vi.mocked(fs.mkdirSync);
    const writeFileSyncSpy = vi.mocked(fs.writeFileSync);

    const { addNode } = await import("./graph.js");

    addNode("Test Idea", "body text", ["tag1"]);

    // mkdirSync must have been called
    expect(mkdirSyncSpy).toHaveBeenCalled();

    // mkdirSync must have been called BEFORE writeFileSync
    const mkdirOrder = mkdirSyncSpy.mock.invocationCallOrder[0];
    const writeOrder = writeFileSyncSpy.mock.invocationCallOrder[0];
    expect(mkdirOrder).toBeLessThan(writeOrder);
  });
});
