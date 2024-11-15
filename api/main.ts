import "jsr:@std/dotenv/load";
// import { Buffer } from "node:buffer";
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { routeStaticFilesFrom } from "./middleware/index.ts";

const NODE_URL = Deno.env.get("NODE_URL") as string;
const NODE_PASSWORD = Deno.env.get("NODE_PASSWORD") as string;

const ws = new WebSocket(`${NODE_URL}/websocket`, [
  "Authorization",
  NODE_PASSWORD,
]);

ws.addEventListener("open", () => {
  console.log("HIT");
});

ws.addEventListener("message", (event) => {
  console.log(event.data);
});

ws.addEventListener("error", () => {
  console.log("ERROR");
});

const router = new Router();

router.get("/websocket", (ctx) => {
  if (!ctx.isUpgradable) {
    ctx.throw(501);
  }

  const ws = ctx.upgrade();

  ws.onopen = () => {
    console.log("Connected to client");
    ws.send("Hello from server!");
  };

  ws.onmessage = (m) => {
    console.log("Got message from client: ", m.data);
    ws.send(m.data as string);
    ws.close();
  };

  ws.onclose = () => console.log("Disconncted from client");
});

router.get("/api/test", (ctx) => {
  ctx.response.type = "application/json";
  ctx.response.body = {
    error: false,
    message: "This is the response",
  };
});

// (async () => {
//   const result = await fetch(`${NODE_URL}/payments/incoming`, {
//     method: "GET",
//     headers: {
//       Authorization:
//         "Basic " + Buffer.from(":" + NODE_PASSWORD).toString("base64"),
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });

//   const json = await result.json();
//   console.log(json);
// })();

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([`${Deno.cwd()}/dist`, `${Deno.cwd()}/public`]));

await app.listen({ port: 8000 });
