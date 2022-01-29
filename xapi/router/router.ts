import { HttpContextInterface } from "../http/http.lib.ts";
import { HttpMethod } from "../http/http.lib.ts";
import { ContextHandlerInterface } from "./router.lib.ts";
import { LayerHandler } from "./router.lib.ts";

interface RouterInterface<
  T extends ContextHandlerInterface<HttpContextInterface>,
> {
  get(handler: Router<T> | Function): void;
  get(
    path: string | string[],
    handler: Router<T> | Function,
  ): void;
  get(
    path: string | string[],
    handler: (Router<T> | Function)[],
  ): void;
  post(handler: Router<T> | Function): void;
  post(
    path: string | string[],
    handler: Router<T> | Function,
  ): void;
  post(
    path: string | string[],
    handler: (Router<T> | Function)[],
  ): void;
  put(handler: Router<T> | Function): void;
  put(
    path: string | string[],
    handler: Router<T> | Function,
  ): void;
  put(
    path: string | string[],
    handler: (Router<T> | Function)[],
  ): void;
  patch(handler: Router<T> | Function): void;
  patch(
    path: string | string[],
    handler: Router<T> | Function,
  ): void;
  patch(
    path: string | string[],
    handler: (Router<T> | Function)[],
  ): void;
  delete(handler: Router<T> | Function): void;
  delete(
    path: string | string[],
    handler: Router<T> | Function,
  ): void;
  delete(
    path: string | string[],
    handler: (Router<T> | Function)[],
  ): void;
  use(handler: Router<T> | Function): void;
  use(
    path: string | string[],
    handler: Router<T> | Function,
  ): void;
  use(
    path: string | string[],
    handler: (Router<T> | Function)[],
  ): void;
}

/**
 * A wrapper around handler that defines a cleaner api to manage routes and middeware functions
 * accepts as param an RoutingContextHandlerAdapter which implements ContextHandlerInterface this
 * class defines how context is handled by middleware function
 */
export class Router<T extends ContextHandlerInterface<HttpContextInterface>>
  implements RouterInterface<T> {
  protected handler: LayerHandler = new LayerHandler();
  get(handler: Router<T> | Function): void;
  get(
    path: string | string[],
    handler: Function | Router<T>,
  ): void;
  get(
    path: string | string[],
    handler: (Function | Router<T>)[],
  ): void;
  get(
    ...params: (
      | string
      | string[]
      | Function
      | Router<T>
      | (Function | Router<T>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (Function | Router<T>), HttpMethod.GET);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | Function,
          HttpMethod.GET,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | Function)[],
          HttpMethod.GET,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  post(handler: Function | Router<T>): void;
  post(path: string | string[], handler: Function | Router<T>): void;
  post(path: string | string[], handler: (Function | Router<T>)[]): void;
  post(
    ...params:
      (string | string[] | Function | Router<T> | (Function | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (Function | Router<T>), HttpMethod.POST);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | Function,
          HttpMethod.POST,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | Function)[],
          HttpMethod.POST,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  put(handler: Function | Router<T>): void;
  put(path: string | string[], handler: Function | Router<T>): void;
  put(path: string | string[], handler: (Function | Router<T>)[]): void;
  put(
    ...params:
      (string | string[] | Function | Router<T> | (Function | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (Function | Router<T>), HttpMethod.PUT);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | Function,
          HttpMethod.PUT,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | Function)[],
          HttpMethod.PUT,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  patch(handler: Function | Router<T>): void;
  patch(path: string | string[], handler: Function | Router<T>): void;
  patch(path: string | string[], handler: (Function | Router<T>)[]): void;
  patch(
    ...params:
      (string | string[] | Function | Router<T> | (Function | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (Function | Router<T>), HttpMethod.PATCH);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | Function,
          HttpMethod.PATCH,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | Function)[],
          HttpMethod.PATCH,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  delete(handler: Function | Router<T>): void;
  delete(path: string | string[], handler: Function | Router<T>): void;
  delete(path: string | string[], handler: (Function | Router<T>)[]): void;
  delete(
    ...params:
      (string | string[] | Function | Router<T> | (Function | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (Function | Router<T>), HttpMethod.DELETE);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | Function,
          HttpMethod.DELETE,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | Function)[],
          HttpMethod.DELETE,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  use(handler: Function | Router<T>): void;
  use(path: string | string[], handler: Function | Router<T>): void;
  use(path: string | string[], handler: (Function | Router<T>)[]): void;
  use(
    ...params:
      (string | string[] | Function | Router<T> | (Function | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (Function | Router<T>), HttpMethod.ALL);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | Function,
          HttpMethod.ALL,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | Function)[],
          HttpMethod.ALL,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }

  private attach(
    handler: Function | Router<T>,
    method: HttpMethod,
  ): void;
  private attach(
    path: string | string[],
    handler: Function | Router<T>,
    method: HttpMethod,
  ): void;
  private attach(
    path: string | string[],
    handler: (Function | Router<T>)[],
    method: HttpMethod,
  ): void;
  private attach(
    ...params: (
      | string
      | string[]
      | Function
      | Router<T>
      | (Function | Router<T>)[]
      | HttpMethod
    )[]
  ) {
    if (params.length == 2) {
      if (params[0] instanceof Router) {
        this.handler.useMiddleware(
          "/",
          params[0].handler,
          params[1] as HttpMethod,
        );
      } else if (Array.isArray(params[0])) {
        (params[0] as (Router<T> | Function)[]).forEach(
          (
            item: Function | Router<T>,
            index: number,
          ) => {
            if (item instanceof Router) {
              this.handler.useMiddleware(
                "/",
                item.handler,
                params[1] as HttpMethod,
              );
            } else {
              this.handler.useMiddleware(
                "/",
                new RoutingContextHandlerAdapter(item),
                params[1] as HttpMethod,
              );
            }
          },
        );
      } else if (params[0] instanceof Function) {
        this.handler.useMiddleware(
          "/",
          new RoutingContextHandlerAdapter(params[0]),
          params[1] as HttpMethod,
        );
      }
    } else if (params.length == 3) {
      if (
        (params[0] instanceof String || typeof params[0] == "string") &&
        params[1] instanceof Router
      ) {
        this.handler.useMiddleware(
          params[0] as string,
          params[1].handler,
          params[2] as HttpMethod,
        );
      } else if (
        (params[0] instanceof String || typeof params[0] == "string") &&
        Array.isArray(params[1])
      ) {
        (params[1] as (Router<T> | Function)[]).forEach(
          (
            item: (Function | Router<T>),
            index: number,
          ) => {
            if (item instanceof Router) {
              this.handler.useMiddleware(
                params[0] as string,
                item.handler,
                params[2] as HttpMethod,
              );
            } else if (item instanceof Function) {
              this.handler.useMiddleware(
                params[0] as string,
                new RoutingContextHandlerAdapter(item),
                params[2] as HttpMethod,
              );
            } else {
              this.handler.useMiddleware(
                params[0] as string,
                item,
                params[2] as HttpMethod,
              );
            }
          },
        );
      } else if (Array.isArray(params[0])) {
        if (params[1] instanceof Router) {
          (params[0] as string[]).forEach((path: string, index: number) => {
            this.handler.useMiddleware(
              path,
              (params[1] as Router<T>).handler,
              params[2] as HttpMethod,
            );
          });
        } else if (Array.isArray(params[1])) {
          (params[0] as string[]).forEach((path: string, index: number) => {
            (params[1] as (Function | Router<T>)[])
              .forEach(
                (
                  item: Function | Router<T>,
                  index: number,
                ) => {
                  if (item instanceof Router) {
                    this.handler.useMiddleware(
                      path,
                      item.handler,
                      params[2] as HttpMethod,
                    );
                  } else if (item instanceof Function) {
                    this.handler.useMiddleware(
                      path,
                      new RoutingContextHandlerAdapter(item),
                      params[2] as HttpMethod,
                    );
                  } else {
                    this.handler.useMiddleware(
                      path,
                      item,
                      params[2] as HttpMethod,
                    );
                  }
                },
              );
          });
        } else {
          (params[0] as string[]).forEach((path: string, index: number) => {
            if (params[1] instanceof Function) {
              this.handler.useMiddleware(
                path,
                new RoutingContextHandlerAdapter(params[1]),
                params[2] as HttpMethod,
              );
            }
          });
        }
      } else if (
        (params[0] instanceof String || typeof params[0] == "string")
      ) {
        if (params[1] instanceof Function) {
          this.handler.useMiddleware(
            params[0] as string,
            new RoutingContextHandlerAdapter(params[1]),
            params[2] as HttpMethod,
          );
        }
      } else {
        throw `invalid interface usage, check arguments`;
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
}

/**
 * base class that defines how middleware functions should be defined and called
 * implments context handler interface so this wrapper can be used by router
 * override handle function to get a custom functionality
 * create a router class that extends the new Adapter and you get your custom routing
 * default api forces middleware functiosn of type
 *  function (ctx:HttpContextInterface,next:Function){
 *      // your
 *      // code
 *      // here
 *  }
 * but you can extend this class and override handle method for a custom functionality
 */
export class RoutingContextHandlerAdapter
  implements ContextHandlerInterface<HttpContextInterface> {
  protected successor?: ContextHandlerInterface<HttpContextInterface>;
  protected handler: Function;
  constructor(handler: Function) {
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
