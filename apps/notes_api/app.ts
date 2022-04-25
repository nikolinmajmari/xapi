import {Application} from "./deps.ts";
import notesRouter from "./routes/notes.ts";
import authRouter from "./routes/auth.ts";

const app = new Application();
app.use((ctx, next) => {
  console.log(
    "request on ",
    ctx.request.url,
    " with method ",
    ctx.request.method
  );
  next();
});
app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use(async (ctx, next) => {
  console.log("not found");
  await ctx.response.send("not found");
});
app.listen(8000);
