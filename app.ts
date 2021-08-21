import { Router } from "./xapi/router/router.ts";
import Application from "./xapi/app/application.ts";
import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";
import { HttpContext } from "./xapi/http/http.lib.ts";

const app = new Application();

const usersRouter = new Router();

usersRouter.use((ctx: HttpContext, next: Function) => {
  console.log("users auth middleware");
  next();
});
usersRouter.get("/", (ctx: HttpContext, next: Function) => {
  ctx.response.send("this is users router");
});
usersRouter.get("/new", (ctx: HttpContext, next: Function) => {
  ctx.response.send("users new router");
});
usersRouter.get("/new/more", (ctx: HttpContext, next: Function) => {
  ctx.response.send("users/new/more route");
});
usersRouter.get("/delete", (ctx: HttpContext, next: Function) => {
  ctx.response.send("users/delete route");
});

const docsRouter = new Router();

docsRouter.use((ctx: HttpContext, next: Function) => {
  console.log("main doc auth middleware" + ctx.request.method);
  next();
});

docsRouter.get((ctx: HttpContext, next: Function) => {
  console.log("called first doc get");
  next();
});

docsRouter.post((ctx: HttpContext, next: Function) => {
  console.log("called first doc post");
  next();
});

docsRouter.use((ctx: HttpContext, next: Function) => {
  console.log("called second doc auth middleware");
  next();
});

docsRouter.get((ctx: HttpContext, next: Function) => {
  console.log("called second doc get");
  next();
});

docsRouter.use((ctx: HttpContext, next: Function) => {
  console.log("called third doc auth middleware");
  next();
});

docsRouter.post((ctx: HttpContext, next: Function) => {
  console.log("called second doc post");
  next();
});

docsRouter.use((ctx: HttpContext, next: Function) => {
  console.log("called last doc middleware");
  next();
});

app.use((ctx: HttpContext, next: Function) => {
  console.log("session middlwware");
  next();
});
app.use((ctx: HttpContext, next: Function) => {
  console.log("static middleware");
  next();
});
app.use((ctx: HttpContext, next: Function) => {
  console.log("authentication middleware");
  next();
});

app.get("/login", (ctx: HttpContext, next: Function) => {
  ctx.response.send("this is login path");
});

app.use("/users", usersRouter);
app.use("/docs", docsRouter);
app.get("/forms", (ctx: HttpContext, next: Function) => {
  ctx.response.send("this is /forms path");
});

app.listen();
