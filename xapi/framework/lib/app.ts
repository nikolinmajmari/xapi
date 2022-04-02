import {
  Router,
  defaultAdapterCreater,
  RoutingContextFactory,
} from "./router.ts";
import {Context} from "./context.ts";

export class Application extends Router {
  private port?: number;
  constructor() {
    super();
  }

  async listen(port?: number): Promise<void> {
    this.completeMiddlewareWith(async (ctx, next) => {
      await ctx.response.withStatusCode(404).withBody("Not found").end();
    });
    const routingContextFactory = new RoutingContextFactory();
    const server = Deno.listen({port: port ?? 8000});
    console.log(
      `HTTP webserver running.  Access it at:  http://localhost:${port}/`
    );
    for await (const conn of server) {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        this.handler
          .handle(
            routingContextFactory.createRoutingContextFrom(
              new Context(requestEvent)
            )
          )
          .catch((reason) => {
            console.log(reason);
          });
      }
    }
  }
}
