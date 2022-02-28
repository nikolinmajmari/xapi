import {HttpContext, HttpMethod} from "./http/http.lib.ts";
import {
  Router as BaseRouter,
  RoutingContext,
  ContextHandelerAdapter,
  ContextHandlerInterface,
} from "./router/mod.ts";
import {HttpContextInterface} from "./http/http.lib.ts";

export type FunctionMiddlewareHandler = (
  ctx: HttpContextInterface,
  next: () => void
) => void;

export function createRoutingContext(ctx: HttpContextInterface) {
  let method;
  switch (ctx.request.method) {
    case "get":
    case "Get":
    case "GET":
      method = HttpMethod.GET;
      break;
    case "post":
    case "Post":
    case "POST":
      method = HttpMethod.POST;
      break;
    case "put":
    case "PUT":
    case "Put":
      method = HttpMethod.PUT;
      break;
    case "Patch":
    case "patch":
    case "PATCH":
      method = HttpMethod.PATCH;
      break;
    case "delete":
    case "DELETE":
    case "Delete":
      method = HttpMethod.DELETE;
      break;
    default:
      throw "Unknown http method";
  }
  console.log(ctx.request.url);
  let url = new URL(ctx.request.requestEvent.request.url);
  return new RoutingContext<HttpContextInterface>(ctx, url, method);
}

export class Router extends BaseRouter<HttpContextInterface> {}
export {ContextHandelerAdapter};
export type Method = HttpMethod;
