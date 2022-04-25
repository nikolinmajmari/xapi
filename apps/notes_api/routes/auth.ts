// deno-lint-ignore-file
import {Router} from "../deps.ts";

const router = new Router();

router.get("/login", async (ctx, next) => {
  return await ctx.response
    .withBody(
      `
    <html>
        <head><title>Example</title></head>
        <body>
            <form action="/auth/login" method="post" style="display:flex;flex-direction:column">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" value=""/>
                <label for="password">Password</label>
                <input type="text" name="password" id="password" value=""/>
                <button type="submit">Login</button>
            </form>
        </body>
    </html>
    `
    )
    .withHeaders({
      "content-type": "text/html",
    })
    .end();
});

router.post("/login", [
  async (ctx, next) => {
    await ctx.request.body.parseForm();
    next();
  },
  async (ctx, next) => {
    const form = ctx.request.body.form;
    console.log(form.get("username"));
    ctx.response.send("200");
  },
]);

export default router;
