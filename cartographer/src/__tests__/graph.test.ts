import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import { join } from "path";
import { save, addNode, link, load } from "../store/graph.js";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(() => JSON.stringify({ nodes: [], edges: [] })),
    existsSync: vi.fn(() => true),
  };
});

vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "test-uuid-00000000"),
}));

describe("save()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls mkdirSync before writeFileSync", () => {
    const graph = { nodes: [], edges: [] };
    save(graph);

    const mockedFs = vi.mocked(fs);
    expect(mockedFs.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining(".cartographer"),
      { recursive: true },
    );
    expect(mockedFs.writeFileSync).toHaveBeenCalled();
    // mkdirSync must be called before writeFileSync
    const mkdirCall = mockedFs.mkdirSync.mock.invocationCallOrder[0];
    const writeCall = mockedFs.writeFileSync.mock.invocationCallOrder[0];
    expect(mkdirCall).toBeLessThan(writeCall);
  });

  it("always calls mkdirSync even when directory exists", () => {
    const graph = { nodes: [], edges: [] };
    save(graph);

    const mockedFs = vi.mocked(fs);
    expect(mockedFs.mkdirSync).toHaveBeenCalledTimes(1);
  });

  it("calls mkdirSync with the correct directory path", () => {
    const graph = { nodes: [], edges: [] };
    save(graph);

    const mockedFs = vi.mocked(fs);
    expect(mockedFs.mkdirSync).toHaveBeenCalledWith(
      join(process.env.HOME ?? "~", ".cartographer"),
      { recursive: true },
    );
  });
});

describe("addNode()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a node with the given title and tags", () => {
    const node = addNode("Test Idea", "Some body", ["tag1"]);

    expect(node.title).toBe("Test Idea");
    expect(node.body).toBe("Some body");
    expect(node.tags).toEqual(["tag1"]);
    expect(node.id).toBe("test-uuid-00000000");
  });
});

describe("link()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when source node does not exist", () => {
    expect(() => link("Missing", "Also Missing")).toThrow("Node not found");
  });
});

describe("load()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty graph when file does not exist", () => {
    const mockedFs = vi.mocked(fs);
    mockedFs.existsSync.mockReturnValue(false);

    const graph = load();
    expect(graph).toEqual({ nodes: [], edges: [] });
  });
});