import Router, {
  defaultAdapterCreater,
  RoutingContextFactory,
} from "./router.ts";
import {HttpContext} from "../../http/http.lib.ts";
import {Context} from "./context.ts";

export default class Application extends Router {
  private port?: number;
  constructor() {
    super();
  }

  _closeChain() {
    this.handler.setRoute();
    this.handler.setSuccessor(
      defaultAdapterCreater((ctx, next) => {
        ctx.event.respondWith(new Response("Not found"));
      })
    );
  }

  async listen(port?: number): Promise<void> {
    this._closeChain();
    const routingContextFactory = new RoutingContextFactory();
    const server = Deno.listen({port: port ?? 8000});
    console.log(
      `HTTP webserver running.  Access it at:  http://localhost:${port}/`
    );
    for await (const conn of server) {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        this.handler.handle(
          routingContextFactory.createRoutingContextFrom(
            new Context(requestEvent)
          )
        );
      }
    }
  }
}
