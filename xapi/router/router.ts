import { HttpMethod } from "../http/http.lib.ts";
import {
  ContextHandlerInterface,
  RoutingContextInterface,
} from "./router.lib.ts";
import {
  FunctionHandler,
  LayerHandler,
  RequestHandler,
  RequestHandlerInterface,
} from "./router.lib.ts";

function isString(value: string | String) {
  return typeof value === "string" || value instanceof String;
}

interface RouterInterface<T extends BaseContextHandlerAdapter> {
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

export class Router<T extends BaseContextHandlerAdapter>
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
                new FunctionHandler(item),
                params[1] as HttpMethod,
              );
            }
          },
        );
      } else if (params[0] instanceof Function) {
        this.handler.useMiddleware(
          "/",
          new FunctionHandler(params[0]),
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
                new FunctionHandler(item),
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
                      new FunctionHandler(item),
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
                new FunctionHandler(params[1]),
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
            new FunctionHandler(params[1]),
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

export class BaseContextHandlerAdapter implements ContextHandlerInterface {
  protected successor?: ContextHandlerInterface;
  protected handler: Function;
  constructor(handler: Function) {
    this.handler = handler;
  }

  handle(context: RoutingContextInterface): void {
    this.handler(context, () => this.invokeSuccessor(context));
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.successor = successor;
  }
  invokeSuccessor(context: RoutingContextInterface) {
    if (this.successor) {
      this.successor.handle(context);
    }
  }
}
