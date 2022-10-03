const next = require("next");
const dotenv = require("dotenv");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app.prepare().then(() => {
  const koa = require("./server/koa")(app.getRequestHandler());

  koa.listen(port, () => {
    console.log(`[KOA] > Koa Server is ready on http://localhost:${port}`);
  });
});