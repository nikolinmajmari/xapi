import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
import { Context, ContextHandlerAdapter, Router } from "../framework.ts";
import { Request } from "../http/http.lib.ts";
import { HttpContext, HttpContextInterface } from "../http/http.lib.ts";
import QueryParser from "../parser/queryparser.ts";

export default class Application extends Router {
  private port?: number;
  constructor() {
    super();
    this.use(QueryParser); // used to parse query url , since router works only with url without query parameters
  }

  _closeChain() {
    this.handler.setRoute();
    this.handler.setSuccessor(
      new ContextHandlerAdapter(
        (ctx: HttpContext, next: Function) => {
          console.log(ctx.request.body);
          ctx.response.send("route not found");
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
