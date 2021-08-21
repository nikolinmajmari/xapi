import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";
import { HttpMethod } from "../http/http.lib.ts";

export interface RoutingContextInterface {
  getRequestMethod(): string;
  getRequestUrl(): string;
}

export interface ContextHandlerInterface {
  handle(context: RoutingContextInterface): void;
  setSuccessor(successor: ContextHandlerInterface): void;
}

interface LayerInterface {
  useMiddleware(
    path: string,
    handler: ContextHandlerInterface | Function,
    method: HttpMethod,
  ): void;
}

/**
 * Function handler, encapsulates the request handler function middlware
 * ---start--- example
 * let handler = new FunctionHandler(
 *      async (req,next)=>{
 *          if(req.url == "/"){
 *              req.respond({body:"success"});
 *          }else{
 *              console.log("passing to next middleware");
 *              next();
 *          }
 *      }
 * );
 * handler.setSuccessor(new FunctionHandler((req,next)=>console.log("last middleware called")));
 * handler.handle(request)
 * ---end--- example
 *
 * @property handler
 * @property successor
 * @constructor FunctionHandler
 * @method setSuccessor
 * @method handle
 */
export class FunctionHandler implements ContextHandlerInterface {
  private handler: Function;
  private successor?: ContextHandlerInterface;
  constructor(handler: Function) {
    this.handler = handler;
  }
  /**
     * Set next request handler to be called
     * @param successor
     * @returns
     */
  setSuccessor(successor: ContextHandlerInterface) {
    this.successor = successor;
  }
  handle(context: RoutingContextInterface) {
    this.handler(
      context,
      async () => await this.invokeSuccessor(context),
    );
  }

  async invokeSuccessor(context: RoutingContextInterface) {
    if (this.successor != null) {
      await this.successor.handle(context);
    }
  }
}

/**
 * Registers handelers for an middleware layer of a certain path
 *
 *
 * @property route
 * @property handlers
 * @property methods
 */
export class LayerHandler implements LayerInterface, ContextHandlerInterface {
  private route: Route;
  private successor?: ContextHandlerInterface;
  private handelers: ContextHandlerInterface[];
  private methods: HttpMethod[];

  setRoute(route?: Route) {
    if (route != null) {
      this.route = route;
    }

    //console.log("set route for ",this.handelers);
    this.handelers.forEach((element) => {
      if (element instanceof ChainHandler) {
        element.setRoute(this.route);
      }
    });
  }

  constructor() {
    this.route = new Route(HttpMethod.ALL, "/");
    this.handelers = [];
    this.methods = [];
  }

  useMiddleware(
    path: string = "/",
    handler: ContextHandlerInterface,
    method: HttpMethod = HttpMethod.ALL,
  ) {
    if (path == "/" || path == "") {
      if (handler instanceof LayerHandler) {
        // todo force the method on the next layer
        this.handelers.push(...handler.handelers);
        this.methods.push(...handler.methods);
      } else {
        this.handelers.push(handler);
        this.methods.push(method);
      }
    } else {
      let chainHandler: ChainHandler;
      if (
        this.handelers.length > 0 &&
        this.handelers[this.handelers.length - 1] instanceof ChainHandler
      ) {
        chainHandler = this
          .handelers[this.handelers.length - 1] as ChainHandler;
      } else {
        chainHandler = new ChainHandler();
        this.handelers.push(chainHandler);
        this.methods.push(HttpMethod.ALL);
      }
      chainHandler.use(path, handler, method);
    }
  }

  async handle(context: RoutingContextInterface) {
    let strict = this.route?.isStrictMatch(context.getRequestUrl()) ?? false;
    console.log(this.methods);
    //console.log(`LayerHandler:handle strict:${strict} basepath:${this.route?.getPattern()} for uri ${request.url}  ${this.handelers}`,);
    //console.log(this.route.getPattern(), this.methods);
    if (strict) {
      let start = 0;
      for (; start < this.handelers.length; start++) {
        if (
          context.getRequestMethod() == this.methods[start] ||
          this.methods[start] == HttpMethod.ALL
        ) {
          break;
        }
      }
      if (start < this.handelers.length) {
        this.handelers[start].handle(context);
      } else if (this.successor != null) {
        await this.successor.handle(context);
      }
    } else {
      //console.log(this.handelers);
      for (let i = 0; i < this.handelers.length; i++) {
        if (this.methods[i] == HttpMethod.ALL) {
          return this.handelers[i].handle(context);
        }
      }
      if (this.successor != null) {
        this.successor.handle(context);
      } else {
        throw "Not handler middleware";
      }
    }
  }

  chainHandlers() {
    this.chainMiddleware();
  }

  chainMiddleware() {
    if (this.handelers.length > 0) {
      let createMethodIterator = (method: HttpMethod) => {
        return new WhereIterator(
          this.handelers,
          (item: ContextHandlerInterface, index: number) => {
            return this.methods[index] == HttpMethod.ALL ||
              this.methods[index] == method;
          },
        );
      };
      let iterators = [
        createMethodIterator(HttpMethod.GET),
        createMethodIterator(HttpMethod.POST),
        createMethodIterator(HttpMethod.PUT),
        createMethodIterator(HttpMethod.PATCH),
        createMethodIterator(HttpMethod.DELETE),
      ];
      iterators.forEach((iterator) => {
        let prev = iterator.getIndex();
        let curr = prev;
        while (iterator.next() != null) {
          prev = curr;
          curr = iterator.getIndex();
          if (prev == null || curr == null) {
            continue;
          }
          if (this.methods[prev] == this.methods[curr]) {
            this.handelers[prev].setSuccessor(this.handelers[curr]);
          } else if (this.methods[prev] != HttpMethod.ALL) {
            this.handelers[prev].setSuccessor(this.handelers[curr]);
          }
        }
        if (curr != null && curr > 0 && curr < this.handelers.length) {
          // console.log("curr:", curr);
          if (
            this.methods[curr] != HttpMethod.ALL ||
            curr == this.handelers.length - 1
          ) {
            if (this.successor != null) {
              this.handelers[curr].setSuccessor(this.successor);
            }
          }
        }
      });
      // console.log("call iterators for path", this.route.getPattern());
      //console.log(this.handelers);
      let start = 0;
      let end = 0;
      while (true) {
        while (start < this.handelers.length - 1) {
          if (
            this.methods[start] == HttpMethod.ALL &&
            this.methods[start + 1] != HttpMethod.ALL
          ) {
            break;
          }
          start++;
        }
        end = start + 1;
        while (end < this.handelers.length) {
          if (this.methods[end] == HttpMethod.ALL) {
            break;
          }
          end++;
        }

        if (start == this.handelers.length - 1) {
          break;
        } else {
          let chainedSuccessor = new ChainedSuccessor(this);
          let getIndex = this.getFirstMethodHandlerIndex(
            start,
            end,
            HttpMethod.GET,
          );
          let postIndex = this.getFirstMethodHandlerIndex(
            start,
            end,
            HttpMethod.POST,
          );
          let putIndex = this.getFirstMethodHandlerIndex(
            start,
            end,
            HttpMethod.PUT,
          );

          if (getIndex != null) {
            chainedSuccessor.setGetSuccessor(this.handelers[getIndex]);
          }
          if (postIndex != null) {
            chainedSuccessor.setPostSuccessor(this.handelers[postIndex]);
          }
          if (end == this.handelers.length && this.successor != null) {
            chainedSuccessor.setSuccessor(this.successor);
          } else if (end != this.handelers.length) {
            chainedSuccessor.setSuccessor(this.handelers[end]);
          }
          this.handelers[start].setSuccessor(chainedSuccessor);
          start = end;
          end = start + 1;
        }
      }
    }
  }

  getFirstMethodHandlerIndex(start: number, end: number, method: HttpMethod) {
    for (let i = start; i <= end; i++) {
      if (this.methods[i] == method) {
        return i;
      }
    }
    return null;
  }

  setSuccessor(successor: ContextHandlerInterface) {
    this.successor = successor;
    this.chainHandlers();
  }
  async invokeSuccessor(context: RoutingContextInterface) {
    if (this.successor != null) {
      await this.successor.handle(context);
    }
  }

  getRoute() {
    return this.route;
  }
}

class ChainedSuccessor implements ContextHandlerInterface {
  handle(context: RoutingContextInterface): void {
    //console.log( `callin successor ${request.method}  basepath ${this.layer?.getRoute()?.getPattern()}  url ${request.url}  ${this.layer?.getRoute()?.isStrictMatch(request.url)}`,);
    //console.log(`${HttpMethod.GET}`);
    console.log("successor", context.getRequestMethod());
    if (
      context.getRequestMethod() == HttpMethod.GET &&
      this.layer?.getRoute()?.isStrictMatch(context.getRequestUrl())
    ) {
      console.log("get successor");
      if (this.getSuccessor != null) {
        this.getSuccessor.handle(context);
      } else if (this.successor != null) {
        this.successor.handle(context);
      } else {
        throw "Error";
      }
    } else if (
      context.getRequestMethod() == HttpMethod.POST &&
      this.layer?.getRoute()?.isStrictMatch(context.getRequestUrl())
    ) {
      console.log("post successor");
      if (this.postSuccessor != null) {
        this.postSuccessor.handle(context);
      } else if (this.successor != null) {
        this.successor.handle(context);
      } else {
        throw "Error";
      }
    } else {
      this.successor?.handle(context);
    }
  }
  setSuccessor(successor: ContextHandlerInterface) {
    this.successor = successor;
  }

  setMethodSuccessor(successor: ContextHandlerInterface, method: HttpMethod) {
    switch (method) {
      case HttpMethod.GET:
        this.setGetSuccessor(successor);
        break;
      case HttpMethod.POST:
        this.setPostSuccessor(successor);
        break;
    }
  }

  constructor(parent: LayerHandler) {
    super();
    this.layer = parent;
  }
  setGetSuccessor(successor: ContextHandlerInterface) {
    this.getSuccessor = successor;
  }

  setPostSuccessor(successor: ContextHandlerInterface) {
    this.postSuccessor = successor;
  }

  private getSuccessor?: ContextHandlerInterface;
  private postSuccessor?: ContextHandlerInterface;
  private patchSuccessor?: ContextHandlerInterface;
  private successor?: ContextHandlerInterface;
  private layer?: LayerHandler;
}

class ChainHandler implements ContextHandlerInterface {
  private isRegex: boolean = false;
  private baseRoute?: Route;
  private successor?: ContextHandlerInterface;
  private routes: Map<string, LayerHandler> = new Map();

  use(
    path: string,
    handler: ContextHandlerInterface,
    method: HttpMethod = HttpMethod.ALL,
  ) {
    const basePath = path.split("/").slice(1, 2).join("/");
    const deepPath = "/" + path.split("/").slice(2).join("/");
    if (!this.routes.has(basePath)) {
      this.routes.set(basePath, new LayerHandler());
      // todo set base path for the layer
    }
    // todo remove debug
    //console.log( `[ChainHandler::use] basePath: ${basePath}  deepPath: ${deepPath} method: ${method}`,);
    (this.routes.get(basePath) as LayerHandler).useMiddleware(
      deepPath,
      handler,
      method,
    );
  }

  setRoute(route: Route) {
    this.baseRoute = route;
    for (let key of this.routes.keys()) {
      let deepRoute: Route = new Route(HttpMethod.ALL, key);
      deepRoute.bindToParent(this.baseRoute);
      this.routes.get(key)?.setRoute(deepRoute);
    }
  }

  handle(context: RoutingContextInterface) {
    //console.log(`MapHandler:handle paths:${[...this.routes.keys()]} basepath:${this.baseRoute?.getPattern()} for uri ${request.url}`,);
    let pattern = this.baseRoute?.getPattern() ?? "";
    let key = context.getRequestUrl().replace(pattern, "").split("/")[0];
    //console.log("found key ",request.url.replace(pattern, ""),key," on map handler",);
    let handler = this.routes.get(key) ?? this.successor;
    //console.log(handler);
    if (handler != null) {
      handler.handle(context);
    } else {
      throw "Not handled middleware";
    }
  }
  setSuccessor(successor: ContextHandlerInterface) {
    this.successor = successor;
    for (let [key, value] of this.routes) {
      value.setSuccessor(successor);
    }
    return this;
  }
}

class RegexChainHandler implements ContextHandlerInterface {
  handle(context: RoutingContextInterface) {
    throw new Error("Method not implemented.");
  }

  setSuccessor(successor: ContextHandlerInterface) {
    throw new Error("Method not implemented.");
  }

  static fromPlainStringChainHandler(handler: ChainHandler) {
  }
}

class Route {
  constructor(
    private method: HttpMethod,
    private pattern: string,
    private regex?: RegExp,
    private strictMatch?: RegExp,
    private lossyMatch?: RegExp,
    private isRegex: boolean = false,
  ) {
  }

  bindToParent(parent: Route) {
    this.pattern = parent.pattern + this.pattern + "/";
    this.strictMatch = new RegExp(`^${this.pattern}$`);
    this.lossyMatch = new RegExp(`^${this.pattern}`);
  }

  isStrictMatch(uri: string) {
    //console.log("checking ",this.strictMatch,"uri",uri,this.strictMatch?.test(uri) ?? false,this.strictMatch?.test(uri + "/") ?? false,);
    return (this.strictMatch?.test(uri) || this.strictMatch?.test(uri + "/")) ??
      false;
  }

  isLossyMatch(uri: string) {
    return this.lossyMatch?.test(uri) ?? false;
  }

  canHandle(request: ServerRequest) {
    return request.method == this.method || this.method == HttpMethod.ALL;
  }

  getPattern(): string {
    return this.pattern;
  }
}

/**
 *
 */

class WhereIterator<T> {
  private parent: T[];
  private where: Function;
  private index: number = -1;
  constructor(parent: T[], where: Function) {
    this.parent = parent;
    this.where = where;
  }

  get() {
    if (this.index >= 0 && this.index < this.parent.length) {
      return this.parent[this.index];
    }
    return null;
  }

  getIndex() {
    if (this.index >= 0 && this.index < this.parent.length) {
      return this.index;
    }
    return null;
  }

  next() {
    this.index++;
    while (
      this.index >= 0 && this.index < this.parent.length &&
      !this.where(this.parent[this.index], this.index)
    ) {
      //console.log(this.where(this.parent[this.index], this.index), this.index);
      this.index++;
    }
    return this.get();
  }
}

export class ParamParser {
  partition: String;

  constructor(partition: String) {
    this.partition = partition;
  }
  isParam() {
    return this.partition.indexOf(":") == 0;
  }
  isRegex() {
    return this.partition.indexOf("(") >= 0 &&
      ")" == this.partition[this.partition.length - 1];
  }
  getParam() {
    return this.partition.slice(
      1,
      this.partition.includes("(")
        ? this.partition.indexOf("(")
        : this.partition.length,
    );
  }
  getRegexString() {
    return this.partition.slice(
      this.partition.indexOf("(") + 1,
      this.partition.lastIndexOf(")"),
    );
  }
  getRegex() {
    return new RegExp(this.getRegexString());
  }
}
