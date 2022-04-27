import {Application} from "./deps.ts";
import notesRouter from "./routes/notes.ts";
import authRouter from "./routes/auth.ts";
import {engines, staticMiddleware} from "./deps.ts";

console.log("createt application");
const app = new Application();
app.setViewEngine(engines.etaEngine.configure({cache: false}));
app.use(
  staticMiddleware({
    path: "/assets",
  })
);
app.use((ctx, next) => {
  console.log("request on f f", ctx.req.url, " with method ", ctx.req.method);
  next();
});

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use(async (ctx, next) => {
  console.log("not found");
  await ctx.res.text("not found");
});
console.log("before listen");
app.listen(8000);
