// deno-lint-ignore-file
import {Router} from "../deps.ts";

const router = new Router();

router.get("/login", async (ctx, next) => {
  return await ctx.res.render("./login.eta");
});

router.post("/login", [
  async (ctx, next) => {
    await ctx.req.body.parseForm();
    next();
  },
  async (ctx, next) => {
    const form = ctx.req.body.form;
    console.log(form.get("username"));
    ctx.res.text("200");
  },
]);

export default router;
