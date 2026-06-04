import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Node, Edge } from "../types.js";

// CART-B01: save() must call mkdirSync before writeFileSync.
// Before the fix, graph.ts uses `await import("fs")` in a non-async function,
// which is a TS1308 compile error and means mkdirSync is never called.

// Mutable graph state — updated after every writeFileSync so load() sees new state
let mockGraph = { nodes: [] as Node[], edges: [] as Edge[] };

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    mkdirSync: vi.fn(actual.mkdirSync),
    writeFileSync: vi.fn(actual.writeFileSync),
    readFileSync: () => JSON.stringify(mockGraph),
    existsSync: () => true,
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

describe("removeNode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGraph = { nodes: [], edges: [] };
  });

  it("returns null when the node is not found", async () => {
    const { removeNode } = await import("./graph.js");
    const result = removeNode("No Such Node");
    expect(result).toBeNull();
  });

  it("removes an orphan node (no edges) and returns {node, edgeCount:0}", async () => {
    const fs = await import("fs");
    const writeFileSyncSpy = vi.mocked(fs.writeFileSync);

    const calls: string[] = [];
    writeFileSyncSpy.mockImplementation((_path: unknown, data: unknown) => {
      if (typeof data === "string") {
        calls.push(data);
        mockGraph = JSON.parse(data) as typeof mockGraph;
      }
    });

    const { addNode, removeNode } = await import("./graph.js");

    const node = addNode("Orphan Node", "body", ["tag"]);
    const result = removeNode("Orphan Node");

    expect(result).not.toBeNull();
    expect(result!.node.id).toBe(node.id);
    expect(result!.edgeCount).toBe(0);

    const lastGraph = JSON.parse(calls[calls.length - 1]) as typeof mockGraph;
    expect(lastGraph.nodes.find((n) => n.id === node.id)).toBeUndefined();
  });

  it("cascade-deletes edges when the node is removed", async () => {
    const fs = await import("fs");
    const writeFileSyncSpy = vi.mocked(fs.writeFileSync);

    const calls: string[] = [];
    writeFileSyncSpy.mockImplementation((_path: unknown, data: unknown) => {
      if (typeof data === "string") {
        calls.push(data);
        mockGraph = JSON.parse(data) as typeof mockGraph;
      }
    });

    const { addNode, link, removeNode } = await import("./graph.js");

    const nodeA = addNode("Node A", "body", []);
    addNode("Node B", "body", []);
    link("Node A", "Node B", "connects");

    const result = removeNode("Node A");

    expect(result).not.toBeNull();
    expect(result!.node.id).toBe(nodeA.id);
    expect(result!.edgeCount).toBe(1);

    const lastGraph = JSON.parse(calls[calls.length - 1]) as typeof mockGraph;
    expect(lastGraph.nodes.find((n) => n.id === nodeA.id)).toBeUndefined();
    expect(lastGraph.edges.filter((e) => e.from === nodeA.id || e.to === nodeA.id)).toHaveLength(0);
  });
});