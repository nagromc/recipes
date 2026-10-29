import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = process.argv[2] ?? "_site";
const recipeFiles = (await readdir(outputDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && entry.name !== "index.html")
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

if (recipeFiles.length === 0) {
  throw new Error(`No recipe HTML files found in ${outputDirectory}`);
}

const links = recipeFiles.map((file) => {
  const label = file
    .slice(0, -".html".length)
    .replace(/[-_]+/g, " ")
    .replace(/^\p{L}/u, (character) => character.toLocaleUpperCase());
  return `\t\t<a href="${encodeURIComponent(file)}">${label}</a>`;
});

const index = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recipes</title>
</head>
<body>
  <h1>Recipes</h1>
  <nav aria-label="Recipes">
${links.join("\n")}
  </nav>
</body>
</html>
`;

await writeFile(join(outputDirectory, "index.html"), index);
