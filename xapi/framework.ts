import { HttpContext, HttpMethod } from "./http/http.lib.ts";
import {
  Router as BaseRouter,
} from "./router/router.ts";
import { ContextHandlerInterface } from "./router/router.lib.ts";
import { HttpContextInterface } from "./http/http.lib.ts";


export type FunctionMiddlewareHandler = (ctx:HttpContextInterface,next:()=>void)=>void;

export class ContextHandlerAdapter implements ContextHandlerInterface<HttpContextInterface> {
    protected successor?: ContextHandlerInterface<HttpContextInterface>;
    protected handler: FunctionMiddlewareHandler;
    constructor(handler: FunctionMiddlewareHandler) {
      this.handler = handler;
    }
  
    handle(context: HttpContextInterface): void {
      this.handler(context, () => this.invokeSuccessor(context));
    }
    setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>): void {
      this.successor = successor;
    }
    invokeSuccessor(context: HttpContextInterface) {
      if (this.successor) {
        this.successor.handle(context);
      }
    }
}

export class Router extends BaseRouter<ContextHandlerAdapter,FunctionMiddlewareHandler> {}
export type Method = HttpMethod;
