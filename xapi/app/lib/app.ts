import {Router, RoutingContextFactory} from "./router.ts";
import {Context} from "./context.ts";
import {
  TemplateParams,
  TemplateRenderInterface,
} from "./template/render_engine.ts";

/**
 * Web application instance
 * holds configuration of the application like env variables port , hostname etc
 */
export class Application extends Router {
  private port?: number;
  private listener: Deno.Listener | undefined;
  #engine: TemplateRenderInterface | undefined;

  setViewEngine(engine: TemplateRenderInterface) {
    this.#engine = engine;
  }

  async renderView(path: string, params: TemplateParams): Promise<string> {
    return await this.#engine!.renderView(path, params);
  }

  /**
   *  constructor of the app
   */
  constructor() {
    super();
  }

  async listen(port?: number): Promise<void> {
    this.completeMiddlewareWith(async (ctx, next) => {
      await ctx.res.status(404).body("Not found").end();
    });

    const routingContextFactory = new RoutingContextFactory();
    const server = Deno.listen({port: port ?? 8000});
    console.log(
      `HTTP webserver running.  Access it at:  http://localhost:${port}/`
    );

    while (true) {
      try {
        const conn = await server.accept();
        (async () => {
          const httpConn = Deno.serveHttp(conn);
          while (true) {
            try {
              const requestEvent = await httpConn.nextRequest();
              if (requestEvent != null) {
                await this.handler.handle(
                  routingContextFactory.createRoutingContextFrom(
                    new Context(requestEvent, this)
                  )
                );
              }
            } catch (err) {
              // the connection has finished
              break;
            }
          }
        })();
      } catch (err) {
        // The listener has closed
        break;
      }
    }
    while (true) {
      const conn = await server.accept();
      (async () => {
        const httpConn = Deno.serveHttp(conn);
        for await (const requestEvent of httpConn) {
          this.handler
            .handle(
              routingContextFactory.createRoutingContextFrom(
                new Context(requestEvent, this)
              )
            )
            .catch((reason) => {
              console.log(reason);
            });
        }
      })();
    }
  }
}
