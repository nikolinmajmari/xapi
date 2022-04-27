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
    const url = new URL(ctx.req.url);
    const path = url.pathname;
    const fullpath = `${Deno.cwd()}${root}${path}`;
    try {
      const fp = await Deno.open(fullpath, {read: true, write: false});
      const ext = fullpath.split(".").pop() ?? "";
      if (ext in ["JPEG", "png", "gif", "pdf", "json", "js"]) {
        ctx.res.headers({"Content-type": `application/${ext}`});
      } else if (ext in ["html", "css", "map"]) {
        ctx.res.headers({"Content-type": `text/${ext}`});
      }
      return ctx.res.body(fp.readable).ok().end();
    } catch (e) {
      await next();
    }
  };
}
