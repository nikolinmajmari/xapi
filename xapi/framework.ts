import { HttpContext, HttpMethod } from "./http/http.lib.ts";
import {
  Router as BaseRouter,
  RoutingContextHandlerAdapter,
} from "./router/router.ts";
import { ContextHandlerInterface } from "./router/router.lib.ts";
import { HttpContextInterface } from "./http/http.lib.ts";
import {
  SessionContextInterface,
  SessionInterface,
} from "./session/session.ts";

export class ContextHandlerAdapter extends RoutingContextHandlerAdapter {
}

export class Router extends BaseRouter<ContextHandlerAdapter> {}
export type Method = HttpMethod;
