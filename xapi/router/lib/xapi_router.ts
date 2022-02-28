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
import {HttpMethod} from "./context.ts";
import {ContextHandlerInterface} from "./handeler/handelers.ts";
import {LayerHandler} from "./handeler/layer_handeler.ts";

interface RouterInterface<
  T extends ContextHandlerInterface,
  F extends Function = Function
> {
  get(handler: RouterInterface<T, F> | F): void;
  get(path: string | string[], handler: RouterInterface<T> | F): void;
  get(path: string | string[], handler: (RouterInterface<T> | F)[]): void;
  post(handler: RouterInterface<T> | F): void;
  post(path: string | string[], handler: RouterInterface<T> | F): void;
  post(path: string | string[], handler: (RouterInterface<T> | F)[]): void;
  put(handler: RouterInterface<T> | F): void;
  put(path: string | string[], handler: RouterInterface<T> | F): void;
  put(path: string | string[], handler: (RouterInterface<T> | F)[]): void;
  patch(handler: RouterInterface<T> | F): void;
  patch(path: string | string[], handler: RouterInterface<T> | F): void;
  patch(path: string | string[], handler: (RouterInterface<T> | F)[]): void;
  delete(handler: RouterInterface<T> | F): void;
  delete(path: string | string[], handler: RouterInterface<T> | F): void;
  delete(path: string | string[], handler: (RouterInterface<T> | F)[]): void;
  use(handler: RouterInterface<T> | F): void;
  use(path: string | string[], handler: RouterInterface<T> | F): void;
  use(path: string | string[], handler: (RouterInterface<T> | F)[]): void;
}

/**
 * A wrapper around handler that defines a cleaner api to manage routes and middeware functions
 * accepts as param an RoutingContextHandlerAdapter which implements ContextHandlerInterface this
 * class defines how context is handled by middleware function
 */
export class Router<C, F extends Function, A extends ContextHandlerInterface>
  implements RouterInterface<ContextHandlerInterface, F>
{
  private createAdaptor: (item: F) => A;
  constructor(createAdaptor: (item: F) => A) {
    this.createAdaptor = createAdaptor;
  }
  protected handler: LayerHandler = new LayerHandler();
  get(handler: Router<C, F, A> | F): void;
  get(path: string | string[], handler: F | Router<C, F, A>): void;
  get(path: string | string[], handler: (F | Router<C, F, A>)[]): void;
  get(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as F | Router<C, F, A>, HttpMethod.GET);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<C, F, A> | F,
          HttpMethod.GET
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<C, F, A> | F)[],
          HttpMethod.GET
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  post(handler: F | Router<C, F, A>): void;
  post(path: string | string[], handler: F | Router<C, F, A>): void;
  post(path: string | string[], handler: (F | Router<C, F, A>)[]): void;
  post(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as F | Router<C, F, A>, HttpMethod.POST);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<C, F, A> | F,
          HttpMethod.POST
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<C, F, A> | F)[],
          HttpMethod.POST
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  put(handler: F | Router<C, F, A>): void;
  put(path: string | string[], handler: F | Router<C, F, A>): void;
  put(path: string | string[], handler: (F | Router<C, F, A>)[]): void;
  put(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as F | Router<C, F, A>, HttpMethod.PUT);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<C, F, A> | F,
          HttpMethod.PUT
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<C, F, A> | F)[],
          HttpMethod.PUT
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  patch(handler: F | Router<C, F, A>): void;
  patch(path: string | string[], handler: F | Router<C, F, A>): void;
  patch(path: string | string[], handler: (F | Router<C, F, A>)[]): void;
  patch(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as F | Router<C, F, A>, HttpMethod.PATCH);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<C, F, A> | F,
          HttpMethod.PATCH
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<C, F, A> | F)[],
          HttpMethod.PATCH
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  delete(handler: F | Router<C, F, A>): void;
  delete(path: string | string[], handler: F | Router<C, F, A>): void;
  delete(path: string | string[], handler: (F | Router<C, F, A>)[]): void;
  delete(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as F | Router<C, F, A>, HttpMethod.DELETE);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<C, F, A> | F,
          HttpMethod.DELETE
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<C, F, A> | F)[],
          HttpMethod.DELETE
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  use(handler: F | Router<C, F, A>): void;
  use(path: string | string[], handler: F | Router<C, F, A>): void;
  use(path: string | string[], handler: (F | Router<C, F, A>)[]): void;
  use(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as F | Router<C, F, A>, HttpMethod.ALL);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<C, F, A> | F,
          HttpMethod.ALL
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<C, F, A> | F)[],
          HttpMethod.ALL
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }

  private attach(handler: F | Router<C, F, A>, method: HttpMethod): void;
  private attach(
    path: string | string[],
    handler: F | Router<C, F, A>,
    method: HttpMethod
  ): void;
  private attach(
    path: string | string[],
    handler: (F | Router<C, F, A>)[],
    method: HttpMethod
  ): void;
  private attach(
    ...params: (
      | string
      | string[]
      | F
      | Router<C, F, A>
      | (F | Router<C, F, A>)[]
      | HttpMethod
    )[]
  ) {
    if (params.length == 2) {
      if (params[0] instanceof Router) {
        this.handler.useMiddleware(
          "/",
          params[0].handler,
          params[1] as HttpMethod
        );
      } else if (Array.isArray(params[0])) {
        (params[0] as (Router<C, F, A> | F)[]).forEach(
          (item: F | Router<C, F, A>, index: number) => {
            if (item instanceof Router) {
              this.handler.useMiddleware(
                "/",
                item.handler,
                params[1] as HttpMethod
              );
            } else {
              this.handler.useMiddleware(
                "/",
                this.createAdaptor(item),
                params[1] as HttpMethod
              );
            }
          }
        );
      } else if (params[0] instanceof Function) {
        this.handler.useMiddleware(
          "/",
          this.createAdaptor(params[0]),
          params[1] as HttpMethod
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
          params[2] as HttpMethod
        );
      } else if (
        (params[0] instanceof String || typeof params[0] == "string") &&
        Array.isArray(params[1])
      ) {
        (params[1] as (Router<C, F, A> | F)[]).forEach(
          (item: F | Router<C, F, A>, index: number) => {
            if (item instanceof Router) {
              this.handler.useMiddleware(
                params[0] as string,
                item.handler,
                params[2] as HttpMethod
              );
            } else if (item instanceof Function) {
              this.handler.useMiddleware(
                params[0] as string,
                this.createAdaptor(item),
                params[2] as HttpMethod
              );
            } else {
              this.handler.useMiddleware(
                params[0] as string,
                item,
                params[2] as HttpMethod
              );
            }
          }
        );
      } else if (Array.isArray(params[0])) {
        if (params[1] instanceof Router) {
          (params[0] as string[]).forEach((path: string, index: number) => {
            this.handler.useMiddleware(
              path,
              (params[1] as Router<C, F, A>).handler,
              params[2] as HttpMethod
            );
          });
        } else if (Array.isArray(params[1])) {
          (params[0] as string[]).forEach((path: string, index: number) => {
            (params[1] as (F | Router<C, F, A>)[]).forEach(
              (item: F | Router<C, F, A>, index: number) => {
                if (item instanceof Router) {
                  this.handler.useMiddleware(
                    path,
                    item.handler,
                    params[2] as HttpMethod
                  );
                } else if (item instanceof Function) {
                  this.handler.useMiddleware(
                    path,
                    this.createAdaptor(item),
                    params[2] as HttpMethod
                  );
                } else {
                  this.handler.useMiddleware(
                    path,
                    item,
                    params[2] as HttpMethod
                  );
                }
              }
            );
          });
        } else {
          (params[0] as string[]).forEach((path: string, index: number) => {
            if (params[1] instanceof Function) {
              this.handler.useMiddleware(
                path,
                this.createAdaptor(params[1]),
                params[2] as HttpMethod
              );
            }
          });
        }
      } else if (params[0] instanceof String || typeof params[0] == "string") {
        if (params[1] instanceof Function) {
          this.handler.useMiddleware(
            params[0] as string,
            this.createAdaptor(params[1]),
            params[2] as HttpMethod
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
