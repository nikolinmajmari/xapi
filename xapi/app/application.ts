import {
  serve,
  ServerRequest,
} from "https://deno.land/std@0.104.0/http/server.ts";
import { BaseContextHandlerAdapter } from "../router/router.ts";
import { RoutingContextInterface } from "../router/router.lib.ts";
import { FunctionHandler } from "../router/router.lib.ts";
import { RequestHandlerInterface } from "../router/router.lib.ts";
import { Context, Router } from "../framework.ts";
import { HttpContext, HttpContextInterface } from "../http/http.lib.ts";

export default class Application extends Router {
  private port?: number;
  constructor() {
    super();
  }

  _closeChain() {
    this.handler.setRoute();
    this.handler.setSuccessor(
      new FunctionHandler(
        (ctx: HttpContext, next: Function) => {
          ctx.request.respond({ status: 404, body: "route not found" });
        },
      ),
    );
  }

  async listen(port?: number): Promise<void> {
    this._closeChain();
    const server = serve({ port: port ?? 8080 });
    console.log(
      `HTTP webserver running.  Access it at:  http://localhost:8080/`,
    );
    for await (const request of server) {
      this.handler.handle(new Context(request));
    }
  }
}
