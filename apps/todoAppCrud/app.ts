import { Router as XapiRouter } from "../../xapi/router/router.ts";
import Application from "../../xapi/app/application.ts";
import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";
import { HttpContext } from "../../xapi/http/http.lib.ts";
import Session from "../../xapi/session/session.ts";
import { FileSessionAdapter } from "../../xapi/session/adapter.ts";
import { SessionContextInterface } from "../../xapi/session/session.ts";
import { InMemorySessionAdapter } from "../../xapi/session/adapter.ts";
import BodyParser from "../../xapi/parser/bodyparser.ts";
import QueryParser from "../../xapi/parser/queryparser.ts";
import notesRouter from "./routes/notes.ts";
import { HttpContextInterface } from "../../xapi/http/http.lib.ts";
const app = new Application();

app.use(BodyParser);
app.get("/", (ctx: HttpContextInterface, next: Function) => {
  ctx.response.send("this is index");
});
app.use("/notes", notesRouter);

app.listen();
