// deno-lint-ignore-file
import { HttpContextInterface } from "../http/http.lib.ts";
import { HttpMethod } from "../http/http.lib.ts";
import { ContextHandlerInterface } from "./router.lib.ts";
import { LayerHandler } from "./router.lib.ts";


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

export interface RoutingContextHandlerAdapterInterface<F extends Function=Function> 
        extends ContextHandlerInterface<HttpContextInterface> {

}


 export class RoutingContextHandlerAdapter<F extends Function = Function>
 implements RoutingContextHandlerAdapterInterface<F>{
 protected successor?: ContextHandlerInterface<HttpContextInterface>;
 protected handler: F;
 constructor(handler: F) {
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




interface RouterInterface<
  T extends RoutingContextHandlerAdapterInterface<F>,F extends Function=Function>{
  get(handler: Router<T> | F): void;
  get(
    path: string | string[],
    handler: Router<T> | F,
  ): void;
  get(
    path: string | string[],
    handler: (Router<T> | F)[],
  ): void;
  post(handler: Router<T> | F): void;
  post(
    path: string | string[],
    handler: Router<T> | F,
  ): void;
  post(
    path: string | string[],
    handler: (Router<T> | F)[],
  ): void;
  put(handler: Router<T> | F): void;
  put(
    path: string | string[],
    handler: Router<T> | F,
  ): void;
  put(
    path: string | string[],
    handler: (Router<T> | F)[],
  ): void;
  patch(handler: Router<T> | F): void;
  patch(
    path: string | string[],
    handler: Router<T> | F,
  ): void;
  patch(
    path: string | string[],
    handler: (Router<T> | F)[],
  ): void;
  delete(handler: Router<T> | F): void;
  delete(
    path: string | string[],
    handler: Router<T> | F,
  ): void;
  delete(
    path: string | string[],
    handler: (Router<T> | F)[],
  ): void;
  use(handler: Router<T> | F): void;
  use(
    path: string | string[],
    handler: Router<T> | F,
  ): void;
  use(
    path: string | string[],
    handler: (Router<T> | F)[],
  ): void;
}

/**
 * A wrapper around handler that defines a cleaner api to manage routes and middeware functions
 * accepts as param an RoutingContextHandlerAdapter which implements ContextHandlerInterface this
 * class defines how context is handled by middleware function
 */
export class Router<T extends RoutingContextHandlerAdapterInterface<F>,F extends Function=Function>
  implements RouterInterface<T,F> {
  protected handler: LayerHandler = new LayerHandler();
  get(handler: Router<T> | F): void;
  get(
    path: string | string[],
    handler: F | Router<T>,
  ): void;
  get(
    path: string | string[],
    handler: (F | Router<T>)[],
  ): void;
  get(
    ...params: (
      | string
      | string[]
      | F
      | Router<T>
      | (F | Router<T>)[]
    )[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (F | Router<T>), HttpMethod.GET);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | F,
          HttpMethod.GET,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | F)[],
          HttpMethod.GET,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  post(handler: F | Router<T>): void;
  post(path: string | string[], handler: F | Router<T>): void;
  post(path: string | string[], handler: (F | Router<T>)[]): void;
  post(
    ...params:
      (string | string[] | F | Router<T> | (F | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (F | Router<T>), HttpMethod.POST);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | F,
          HttpMethod.POST,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | F)[],
          HttpMethod.POST,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  put(handler: F | Router<T>): void;
  put(path: string | string[], handler: F | Router<T>): void;
  put(path: string | string[], handler: (F | Router<T>)[]): void;
  put(
    ...params:
      (string | string[] | F | Router<T> | (F | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (F | Router<T>), HttpMethod.PUT);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | F,
          HttpMethod.PUT,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | F)[],
          HttpMethod.PUT,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  patch(handler: F | Router<T>): void;
  patch(path: string | string[], handler: F | Router<T>): void;
  patch(path: string | string[], handler: (F | Router<T>)[]): void;
  patch(
    ...params:
      (string | string[] | F | Router<T> | (F | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (F | Router<T>), HttpMethod.PATCH);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | F,
          HttpMethod.PATCH,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | F)[],
          HttpMethod.PATCH,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  delete(handler: F | Router<T>): void;
  delete(path: string | string[], handler: F | Router<T>): void;
  delete(path: string | string[], handler: (F | Router<T>)[]): void;
  delete(
    ...params:
      (string | string[] | F | Router<T> | (F | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (F | Router<T>), HttpMethod.DELETE);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | F,
          HttpMethod.DELETE,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | F)[],
          HttpMethod.DELETE,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }
  use(handler: F | Router<T>): void;
  use(path: string | string[], handler: F | Router<T>): void;
  use(path: string | string[], handler: (F | Router<T>)[]): void;
  use(
    ...params:
      (string | string[] | F | Router<T> | (F | Router<T>)[])[]
  ): void {
    if (params.length == 1) {
      this.attach(params[0] as (F | Router<T>), HttpMethod.ALL);
    } else if (params.length == 2) {
      if (params[1] instanceof Function || params[1] instanceof Router) {
        this.attach(
          params[0] as string | string[],
          params[1] as Router<T> | F,
          HttpMethod.ALL,
        );
      } else {
        this.attach(
          params[0] as string | string[],
          params[1] as (Router<T> | F)[],
          HttpMethod.ALL,
        );
      }
    } else {
      throw `invalid arguments, only one or two allowed`;
    }
  }

  private attach(
    handler: F | Router<T>,
    method: HttpMethod,
  ): void;
  private attach(
    path: string | string[],
    handler: F | Router<T>,
    method: HttpMethod,
  ): void;
  private attach(
    path: string | string[],
    handler: (F | Router<T>)[],
    method: HttpMethod,
  ): void;
  private attach(
    ...params: (
      | string
      | string[]
      | F
      | Router<T>
      | (F | Router<T>)[]
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
        (params[0] as (Router<T> | F)[]).forEach(
          (
            item: F | Router<T>,
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
        (params[1] as (Router<T> | F)[]).forEach(
          (
            item: (F | Router<T>),
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
            (params[1] as (F | Router<T>)[])
              .forEach(
                (
                  item: F | Router<T>,
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
