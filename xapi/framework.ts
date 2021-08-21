import { HttpContext, HttpMethod } from "./http/http.lib.ts";
import {
  Router as BaseRouter,
  RoutingContextHandlerAdapter,
} from "./router/router.ts";
import { RoutingContextInterface } from "./router/router.lib.ts";
import { ContextHandlerInterface } from "./router/router.lib.ts";

export class Context extends HttpContext implements RoutingContextInterface {
  getRequestMethod(): string {
    return this.request.method;
  }
  getRequestUrl(): string {
    return this.request.url;
  }
}

export class ContextHandlerAdapter extends RoutingContextHandlerAdapter {
  constructor(handler: Function) {
    super(handler);
  }

  handle(context: Context): void {
    this.handler(context, () => this.invokeSuccessor(context));
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.successor = successor;
  }
  invokeSuccessor(context: Context) {
    if (this.successor) {
      this.successor.handle(context);
    }
  }
}

export class Router extends BaseRouter<ContextHandlerAdapter> {}
export type Method = HttpMethod;
