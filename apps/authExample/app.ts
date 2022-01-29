import Application from "../../xapi/app/application.ts";
import { HttpContextInterface } from "../../xapi/http/http.lib.ts";
import Authentication from "../../xapi/auth/authentication.ts";
import createSession from "../../xapi/session/session.ts";
import { InMemorySessionAdapter } from "../../xapi/session/adapter.ts";
const app = new Application();
const manager = Authentication.sessionStrategy({ key: "session_main" });
app.use(createSession<InMemorySessionAdapter>({
  secret: "secret",
  adapter: new InMemorySessionAdapter(),
  lifetime: 2000,
}));
app.use(manager.middleware());
app.use((ctx: HttpContextInterface, next: Function) => {
  console.log("middleware called", ctx.request.url);
  next();
});

app.use((ctx: HttpContextInterface, _next: Function) => {
  ctx.response.send("hey boss");
});

app.listen(9000);
