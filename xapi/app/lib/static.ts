import {FunctionHandler} from "./router.ts";
import {exists} from "https://deno.land/std/fs/mod.ts";
interface StaticMiddlewareConfigParamsInterface {
  path: string;
}

export default function staticMiddleware(
  params: StaticMiddlewareConfigParamsInterface
): FunctionHandler {
  const root = params.path;
  return async (ctx, next) => {
    console.log("in static middleware");
    const url = new URL(ctx.req.url);
    const path = url.pathname;
    const fullpath = `${Deno.cwd()}${root}${path}`;
    console.log("halting", fullpath);
    try {
      const fp = await Deno.open(fullpath, {read: true, write: false});
      const ext = fullpath.split(".").pop() ?? "";
      if (["JPEG", "png", "gif", "pdf", "json"].includes(ext)) {
        ctx.res.headers({"content-type": `application/${ext}`});
      } else if (["html", "css", "map", "js"].includes(ext)) {
        ctx.res.headers({"content-type": `text/${ext}`});
      } else {
        ctx.res.headers({"content-type": "text/plain"});
      }
      await ctx.res.body(fp.readable).ok().end();
    } catch (e) {
      next();
    }
  };
}
