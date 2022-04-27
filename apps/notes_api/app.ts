import {Application} from "./deps.ts";
import notesRouter from "./routes/notes.ts";
import authRouter from "./routes/auth.ts";
import {engines, staticMiddleware} from "./deps.ts";

console.log("createt application");
const app = new Application();
app.use((ctx, next) => {
  console.log("logging :", ctx.req.url);
  next();
});

app.setViewEngine(engines.etaEngine.configure({cache: false}));
app.use(staticMiddleware({path: "/assets"}));
app.use((ctx, next) => {
  console.log("request on f f", ctx.req.url, " with method ", ctx.req.method);
  next();
});

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use(async (ctx, next) => {
  console.log("not found");
  await ctx.res.notFound().body("not found").end();
});
app.listen(8000);
