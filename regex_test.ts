import { Router } from "./xapi/router/router.ts";
import Application from "./xapi/app/application.ts";
import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";
import { HttpContext } from "./xapi/http/http.lib.ts";
import Session from "./xapi/session/session.ts";
import { FileSessionAdapter } from "./xapi/session/adapter.ts";
import { SessionContextInterface } from "./xapi/session/session.ts";
import { InMemorySessionAdapter } from "./xapi/session/adapter.ts";
import BodyParser from "./xapi/parser/bodyparser.ts";
import QueryParser from "./xapi/parser/queryparser.ts";
const app = new Application();
app.use(QueryParser);
app.get("/users", (ctx: HttpContext, next: Function) => {
  ctx.response.send("hey from users");
});
app.get(
  "/users/:id(\\d*)/prop/:property",
  (ctx: HttpContext, next: Function) => {
    let query: string = JSON.stringify(ctx.request.query);
    ctx.response.send(
      "hey from users" + ctx.request.params.id + " prop " +
        ctx.request.params.property + " query:" + query,
    );
  },
);

app.listen();
