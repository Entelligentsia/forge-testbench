import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import { join } from "path";
import { save, addNode, link, load, exportMarkdown, mostConnectedNode } from "../store/graph.js";

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

  it("returns Edge with correct from/to IDs when both nodes exist", () => {
    const handcrafted = {
      nodes: [
        { id: "id-a", title: "Node A", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Node B", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(handcrafted));

    const edge = link("Node A", "Node B");
    expect(edge.from).toBe("id-a");
    expect(edge.to).toBe("id-b");
    expect(edge.from).not.toBe(edge.to);
  });

  it("returns edge without label having label undefined and weight 1", () => {
    const handcrafted = {
      nodes: [
        { id: "id-a", title: "Node A", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Node B", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(handcrafted));

    const edge = link("Node A", "Node B");
    expect(edge.label).toBeUndefined();
    expect(edge.weight).toBe(1);
  });

  it("returns edge with label carrying the label string", () => {
    const handcrafted = {
      nodes: [
        { id: "id-a", title: "Node A", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Node B", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(handcrafted));

    const edge = link("Node A", "Node B", "depends on");
    expect(edge.label).toBe("depends on");
    expect(edge.weight).toBe(1);
  });
});

describe("load()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty graph when file does not exist", () => {
    const mockedFs = vi.mocked(fs);
    mockedFs.existsSync.mockReturnValueOnce(false);

    const graph = load();
    expect(graph).toEqual({ nodes: [], edges: [] });
  });

  it("returns populated Graph when file exists with valid JSON", () => {
    const populated = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "Body A", tags: ["t1"], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Beta", body: "Body B", tags: ["t2", "t3"], createdAt: "2025-01-02T00:00:00.000Z", updatedAt: "2025-01-02T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-a", to: "id-b", label: "related", weight: 1 },
      ],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(populated));

    const graph = load();
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toHaveLength(1);
    expect(graph.edges[0].from).toBe("id-a");
    expect(graph.edges[0].to).toBe("id-b");
  });
});

describe("exportMarkdown()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("produces '# Knowledge Map' header as first line", () => {
    vi.mocked(fs).readFileSync.mockReturnValueOnce(
      JSON.stringify({ nodes: [], edges: [] }),
    );
    const md = exportMarkdown();
    expect(md.split("\n")[0]).toBe("# Knowledge Map");
  });

  it("renders each node with title, tags, and body", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "Body text", tags: ["t1", "t2"], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(graph));
    const md = exportMarkdown();
    expect(md).toContain("## Alpha");
    expect(md).toContain("*tags: t1, t2*");
    expect(md).toContain("Body text");
  });

  it("renders outgoing links when edges exist", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "A body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Beta", body: "B body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-a", to: "id-b", label: undefined, weight: 1 },
      ],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(graph));
    const md = exportMarkdown();
    expect(md).toContain("**Links:**");
    expect(md).toContain("→ [Beta]");
  });

  it("omits links section when node has no outgoing edges", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "A body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(graph));
    const md = exportMarkdown();
    expect(md).not.toContain("**Links:**");
  });

  it("renders edge label when provided", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "A body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Beta", body: "B body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-a", to: "id-b", label: "depends on", weight: 1 },
      ],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(graph));
    const md = exportMarkdown();
    expect(md).toContain("*(depends on)*");
    expect(md).toContain("→ [Beta]");
  });

  it("renders edge without label as plain link", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "A body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Beta", body: "B body", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-a", to: "id-b", label: undefined, weight: 1 },
      ],
    };
    vi.mocked(fs).readFileSync.mockReturnValueOnce(JSON.stringify(graph));
    const md = exportMarkdown();
    const linkLine = md.split("\n").find((l) => l.includes("→ [Beta]"));
    expect(linkLine).toBeDefined();
    // Plain link: no label parenthetical after the target title
    expect(linkLine).not.toContain("*(");
  });
});

describe("save() content verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes JSON stringified graph containing nodes and edges arrays", () => {
    const graph = {
      nodes: [
        { id: "id-x", title: "X", body: "Body X", tags: ["t1"], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-x", to: "id-y", label: "ref", weight: 1 },
      ],
    };
    save(graph);
    const written = vi.mocked(fs).writeFileSync.mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    expect(parsed).toHaveProperty("nodes");
    expect(parsed).toHaveProperty("edges");
    expect(parsed.nodes).toHaveLength(1);
    expect(parsed.edges).toHaveLength(1);
  });

  it("serialized graph contains correct node fields", () => {
    const node = {
      id: "id-1",
      title: "TestNode",
      body: "Some body",
      tags: ["a", "b"],
      createdAt: "2025-06-01T00:00:00.000Z",
      updatedAt: "2025-06-01T00:00:00.000Z",
    };
    const graph = { nodes: [node], edges: [] };
    save(graph);
    const written = vi.mocked(fs).writeFileSync.mock.calls[0][1] as string;
    const parsed = JSON.parse(written);
    const savedNode = parsed.nodes[0];
    expect(savedNode.id).toBe("id-1");
    expect(savedNode.title).toBe("TestNode");
    expect(savedNode.body).toBe("Some body");
    expect(savedNode.tags).toEqual(["a", "b"]);
    expect(savedNode.createdAt).toBe("2025-06-01T00:00:00.000Z");
    expect(savedNode.updatedAt).toBe("2025-06-01T00:00:00.000Z");
  });
});


describe("mostConnectedNode()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns { node: null, degree: 0 } for a graph with no edges", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "Alpha", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Beta", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [],
    };
    const result = mostConnectedNode(graph);
    expect(result).toEqual({ node: null, degree: 0 });
  });

  it("returns the node with highest degree (bidirectional) and its title", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "A", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "B", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-c", title: "C", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-a", to: "id-b", label: undefined, weight: 1 },
        { from: "id-b", to: "id-a", label: undefined, weight: 1 },
      ],
    };
    // A: 1 out + 1 in = 2
    // B: 1 out + 1 in = 2
    // C: 0 = 0
    // Tie-break: first encountered (A) wins
    const result = mostConnectedNode(graph);
    expect(result).toEqual({ node: graph.nodes[0], degree: 2 });
  });

  it("returns first-encountered node when there is a tie in degree", () => {
    const graph = {
      nodes: [
        { id: "id-a", title: "X", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-b", title: "Y", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
        { id: "id-c", title: "Z", body: "", tags: [], createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
      ],
      edges: [
        { from: "id-a", to: "id-b", label: undefined, weight: 1 },
        { from: "id-c", to: "id-b", label: undefined, weight: 1 },
      ],
    };
    // A: 1 out = 1
    // B: 1 in from A + 1 in from C = 2
    // C: 1 out = 1
    // B has highest degree (2)
    const result = mostConnectedNode(graph);
    expect(result).toEqual({ node: graph.nodes[1], degree: 2 });
  });

  it("handles an empty graph (no nodes, no edges)", () => {
    const graph = { nodes: [], edges: [] };
    const result = mostConnectedNode(graph);
    expect(result).toEqual({ node: null, degree: 0 });
  });
});
