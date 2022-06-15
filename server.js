const Koa = require("koa");
const Router = require("koa-router");

const cors = require("@koa/cors");
const compress = require("koa-compress");
const serve = require("koa-static");
const mount = require("koa-mount");

const fs = require("fs");
const zlib = require("zlib");

const app = new Koa();

// CORS
app.use(cors());

// Compression
app.use(
  compress({
    threshold: 2048,
    gzip: {
      flush: zlib.constants.Z_SYNC_FLUSH,
    },
    deflate: {
      flush: zlib.constants.Z_SYNC_FLUSH,
    },
    br: false, // disable brotli
  })
);

// Static files
app.use(mount("/static", serve("./dist")));

// Serve index.html
const router = new Router();

router.get("/(.*)", (ctx) => {
  ctx.set("Content-Type", "text/html");
  ctx.body = fs.readFileSync(__dirname + "/dist/index.html");
});

app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`React app listening on port ${port}`);
});
