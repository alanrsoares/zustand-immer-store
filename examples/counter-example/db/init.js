const path = require("path");
const fs = require("fs/promises");

async function main() {
  const file = await fs.readFile(path.resolve(__dirname, "wordlist.txt"), "utf-8");

  const rows = file.split("\n");

  const filtered = rows.filter((r) => r.trim().length === 5);

  console.log({ length: filtered.length, rows: rows.length });
}

main();
