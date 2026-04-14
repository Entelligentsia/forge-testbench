import { Command } from "commander";
import chalk from "chalk";
import { load, addNode, link, exportMarkdown } from "./store/graph.js";

const program = new Command()
  .name("carto")
  .description("Terminal knowledge-map — link ideas, export to markdown")
  .version("0.1.0");

program
  .command("add <title>")
  .description("Add a new node to the map")
  .option("-b, --body <text>", "Node content", "")
  .option("-t, --tags <tags>", "Comma-separated tags", "")
  .action((title: string, opts: { body: string; tags: string }) => {
    const node = addNode(title, opts.body, opts.tags ? opts.tags.split(",") : []);
    console.log(chalk.green(`✓ Added: ${node.title} [${node.id.slice(0, 8)}]`));
  });

program
  .command("link <from> <to>")
  .description("Connect two nodes")
  .option("-l, --label <label>", "Edge label")
  .action((from: string, to: string, opts: { label?: string }) => {
    try {
      link(from, to, opts.label);
      console.log(chalk.cyan(`→ Linked "${from}" → "${to}"`));
    } catch (e) {
      console.error(chalk.red(String(e)));
    }
  });

program
  .command("list")
  .description("List all nodes")
  .action(() => {
    const { nodes } = load();
    if (!nodes.length) { console.log("No nodes yet. Try: carto add \"My first idea\""); return; }
    for (const n of nodes) {
      console.log(chalk.bold(n.title), chalk.gray(`[${n.id.slice(0, 8)}]`), n.tags.map((t) => chalk.yellow(`#${t}`)).join(" "));
    }
  });

program
  .command("export")
  .description("Export the map to markdown")
  .action(() => {
    console.log(exportMarkdown());
  });

program.parse();
