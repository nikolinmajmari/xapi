import {ContextHandlerInterface} from "../deps.ts";
import {Router} from "./router.ts";
interface StaticMiddlewareConfigParamsInterface {
  path: string;
  urlMapper: (str: string) => string | undefined | null;
}

/**
 *
 * @param path the url of the file to access
 * @returns
 * clears .. from url to prevent access of files out of the directory
 */
function clearPath(path: string): string {
  path = path.replaceAll("/../", "/");
  path = path.replaceAll("/./", "/");
  if (path.startsWith("./")) {
    path = path.replace("./", "/");
  }
  if (path.startsWith("../")) {
    path = path.replace("../", "/");
  }
  return path;
}

export default function staticMiddleware(
  params: StaticMiddlewareConfigParamsInterface = {
    urlMapper: (e) => e,
    path: "/assets",
  }
): ContextHandlerInterface {
  const router = new Router();
  router.use(params.path, async (ctx, next) => {
    const url = new URL(ctx.req.url);
    const path = clearPath(url.pathname);
    const fullpath = `${Deno.cwd()}${params.path}${params.urlMapper(path)}`;
    try {
      const fp = await Deno.open(fullpath, {read: true, write: false});
      if (!(await fp.stat()).isFile) {
        return await next();
      }
      const ext = fullpath.split(".").pop() ?? "";
      if (["JPEG", "png", "gif", "pdf", "json"].includes(ext)) {
        ctx.res.headers({"content-type": `application/${ext}`});
      } else if (["html", "css", "map", "js"].includes(ext)) {
        ctx.res.headers({"content-type": `text/${ext}`});
      } else if (await fp.statSync()) {
        ctx.res.headers({"content-type": "text/plain"});
      }
      await ctx.res.body(fp.readable).statusOk().sent();
    } catch (e) {
      next();
    }
  });
  return router;
}
