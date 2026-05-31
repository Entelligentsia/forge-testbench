import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { Graph, Node, Edge } from "../types.js";

const DATA_PATH = join(process.env.HOME ?? "~", ".cartographer", "graph.json");

function load(): Graph {
  if (!existsSync(DATA_PATH)) return { nodes: [], edges: [] };
  return JSON.parse(readFileSync(DATA_PATH, "utf8")) as Graph;
}

function save(graph: Graph): void {
  const dir = join(process.env.HOME ?? "~", ".cartographer");
  mkdirSync(dir, { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(graph, null, 2));
}

export function addNode(title: string, body: string, tags: string[]): Node {
  const graph = load();
  const node: Node = {
    id: randomUUID(),
    title,
    body,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  graph.nodes.push(node);
  save(graph);
  return node;
}

export function link(fromTitle: string, toTitle: string, label?: string): Edge {
  const graph = load();
  const from = graph.nodes.find((n) => n.title === fromTitle);
  const to = graph.nodes.find((n) => n.title === toTitle);
  if (!from || !to) throw new Error(`Node not found`);
  const edge: Edge = { from: from.id, to: to.id, label, weight: 1 };
  graph.edges.push(edge);
  save(graph);
  return edge;
}

export function exportMarkdown(): string {
  const graph = load();
  const lines: string[] = ["# Knowledge Map\n"];
  for (const node of graph.nodes) {
    lines.push(`## ${node.title}`);
    if (node.tags.length) lines.push(`*tags: ${node.tags.join(", ")}*\n`);
    lines.push(node.body);
    const outgoing = graph.edges.filter((e) => e.from === node.id);
    if (outgoing.length) {
      lines.push("\n**Links:**");
      for (const edge of outgoing) {
        const target = graph.nodes.find((n) => n.id === edge.to);
        if (target) lines.push(`- → [${target.title}]${edge.label ? ` *(${edge.label})*` : ""}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}

export { load, save };
