const dotenv = require("dotenv");
const esbuild = require("esbuild");
const postcss = require("esbuild-postcss");

dotenv.config();

const define = {};

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

esbuild
  .build({
    entryPoints: ["src/index.tsx", "src/style.css"],
    bundle: true,
    minify: true,
    outdir: "dist",
    plugins: [postcss()],
    define,
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
