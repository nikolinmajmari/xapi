import {Application} from "../../xapi/app/mod.ts";
import notesRouter from "./routes/notes.ts";

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
app.use("/notes", notesRouter);
app.use(async (ctx, next) => {
  console.log("not found");
  await ctx.response.send("not found");
});
app.listen(8000);
