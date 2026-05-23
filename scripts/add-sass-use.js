import fs from "fs";
import { glob } from "glob";

const files = await glob("src/**/*.scss");

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");

  // Already present? skip
  if (content.startsWith('@use "sass:color"')) {
    console.log("Skipped:", file);
    return;
  }

  // Add at top
  fs.writeFileSync(file, `@use "sass:color";\n${content}`);
  console.log("Updated:", file);
});
