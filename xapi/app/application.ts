import { Router } from "../framework.ts";
import { RoutingContextHandlerAdapter } from "../router/router.ts";
import { HttpContext } from "../http/http.lib.ts";
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
      new RoutingContextHandlerAdapter(
        (ctx: HttpContext, next: Function) => {
          console.log(ctx.request.body);
          ctx.response.send("route not found");
        },
      ),
    );
  }

  async listen(port?: number): Promise<void> {
    this._closeChain();
    const server = Deno.listen({ port: port??8000 });
    console.log(
      `HTTP webserver running.  Access it at:  http://localhost:${port}/`,
    );
    for await (const conn of server) {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        this.handler.handle(new HttpContext(requestEvent)); 
      }
    }
  }
}
