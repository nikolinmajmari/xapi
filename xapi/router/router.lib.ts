import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { HttpContextInterface, HttpMethod } from "../http/http.lib.ts";

/**
 * defines how context is handled by router
 */
export interface ContextHandlerInterface<T extends HttpContextInterface> {
  handle(context: HttpContextInterface): void;
  setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>): void;
}

/**
 * layer is a component that is called ony for a particular prefix, holts a stack of middleware
 * context handlers which are chained based on the specific http method
 * this is the layer interface
 */
interface LayerInterface {
  useMiddleware(
    path: string,
    handler: ContextHandlerInterface<HttpContextInterface>,
    method: HttpMethod,
  ): void;
}

/**
 * Registers handelers for an middleware layer of a certain path
 *
 * @property route used for path matching and string operations for context handlers of lower layers
 * @property handlers stack of context handlers that are called to handle request
 * @property methods suported methods of context handers on stack
 *
 * structure
 * start ----------------
 * LayerHandler   /
 *      middleware function ALL bodyParser
 *      ChainHandler
 *            path:home
 *                LayerHandler /home
 *                   middleware function GET getRooms
 *            path:rooms
 *                LayerHandler /rooms
 *                    middleware function GET  getrooms
 *                    middleware function POST  addRoom
 *      middleware function GET index
 *      middleware function ALL route not found
 * end ------------------
 *
 * chain structure
 * when the path of the LayerHandler does not matches the request path then all
 * handlers that support all methods are called scince these are chained
 * if the path of the route matches path of req for layer handler then the first handler that matches
 * request method is called or the first handlers that matches all methods
 * if an handler that matches all methods is followed by an handler that matches only one method then the successor
 * of the handler that matches all methods is a ChainedSuccessor instance
 * chained successor keeps references of next successors of all method types bettween two handlers
 * of all method type so if request path strictly matches route of the handler then the ChainedSuccessor
 * will invoke the next handler based on its method or it will skip to next all successor....
 * cases :
 * layer stack [ ALL , GET, POST, PUT, ALL , PATCH, DELETE, ALL]
 * on strict match get are invoked  [ALL, GET, ALL, ALL]
 * on strict match post are invoked [ALL,POST,ALL ,ALL]
 * on non strict match are invoked [ALL,ALL,ALL]
 * /users/:id   and /users/12 are a strict match
 *
 */
export class LayerHandler
  implements LayerInterface, ContextHandlerInterface<HttpContextInterface> {
  private route: Route;
  private successor?: ContextHandlerInterface<HttpContextInterface>;
  private handelers: ContextHandlerInterface<HttpContextInterface>[];
  private methods: HttpMethod[];

  setRoute(route?: Route) {
    if (route != null) {
      this.route = route;
    }

    //propagate route to each context handler
    this.handelers.forEach((element) => {
      if (
        element instanceof ChainHandler || element instanceof RegexChainHandler
      ) {
        element.setRoute(this.route);
      }
    });
  }

  constructor() {
    this.route = new Route(HttpMethod.ALL, "/");
    this.handelers = [];
    this.methods = [];
  }

  /**
   *
   * @param path path of the middleware
   * @param handler the context handler
   * @param method supported mtehod by context handler
   */
  useMiddleware(
    path: string = "/",
    handler: ContextHandlerInterface<HttpContextInterface>,
    method: HttpMethod = HttpMethod.ALL,
  ) {
    // these are context handlers that are stricttly called  for the path of this handler
    if (path == "/" || path == "") {
      if (handler instanceof LayerHandler) {
        // todo force the method on the next layer
        this.handelers.push(...handler.handelers);
        this.methods.push(...handler.methods);
      } else {
        this.handelers.push(handler);
        this.methods.push(method);
      }
    } else if (path[1] == ":" || path[1] == "(") { // these are handlers that have route params ore regex epressions
      let regexChainHandler: RegexChainHandler;
      if (
        this.handelers.length > 0 &&
        this.handelers[this.handelers.length - 1] instanceof RegexChainHandler
      ) {
        regexChainHandler = this
          .handelers[this.handelers.length - 1] as RegexChainHandler;
      } else {
        regexChainHandler = new RegexChainHandler();
        this.handelers.push(regexChainHandler);
        this.methods.push(HttpMethod.ALL);
      }
      regexChainHandler.use(path, handler, method);
    } else { // these are handlers for the deeper layers
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

  async handle(context: HttpContextInterface) {
    let strict = (this.route?.isStrictMatch(context.request.url) ?? false);
    //console.log(this.methods);
    // console.log(
    //   `LayerHandler:handle strict:${strict} basepath:${
    //     this.route?.pattern
    //   } for uri ${context.request.url} `,
    // );
    // console.log(this.route.pattern, this.methods);
    if (strict) {
      let start = 0;
      for (; start < this.handelers.length; start++) {
        if (
          context.request.method == this.methods[start] ||
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
    if (this.handelers.length == 1 && this.successor) {
      this.handelers[0].setSuccessor(this.successor);
    } else if (this.handelers.length > 0) {
      let createMethodIterator = (method: HttpMethod) => {
        return new WhereIterator(
          this.handelers,
          (
            item: ContextHandlerInterface<HttpContextInterface>,
            index: number,
          ) => {
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
      // console.log("call iterators for path", this.route.pattern);
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

  setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>) {
    this.successor = successor;
    this.chainHandlers();
    //  console.log("chaining middleware for ", this.handelers);
  }
  async invokeSuccessor(context: HttpContextInterface) {
    if (this.successor != null) {
      await this.successor.handle(context);
    }
  }

  getRoute() {
    return this.route;
  }
}

/**
 * A context handler used by layer to chain context handlers
 *
 */
class ChainedSuccessor
  implements ContextHandlerInterface<HttpContextInterface> {
  handle(context: HttpContextInterface): void {
    // console.log(
    //   `callin successor ${context.request.method}  basepath ${
    //     this.layer?.getRoute()?.pattern
    //   }  url ${context.request.url}  ${
    //     this.layer?.getRoute()?.isStrictMatch(context.request.url)
    //   }`,
    // );
    //console.log(`${HttpMethod.GET}`);
    //console.log("successor", context.request.method);
    if (
      context.request.method == HttpMethod.GET &&
      this.layer?.getRoute()?.isStrictMatch(context.request.url)
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
      context.request.method == HttpMethod.POST &&
      this.layer?.getRoute()?.isStrictMatch(context.request.url)
    ) {
      //console.log("post successor");
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
  setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>) {
    this.successor = successor;
  }

  setMethodSuccessor(
    successor: ContextHandlerInterface<HttpContextInterface>,
    method: HttpMethod,
  ) {
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
    this.layer = parent;
  }
  setGetSuccessor(successor: ContextHandlerInterface<HttpContextInterface>) {
    this.getSuccessor = successor;
  }

  setPostSuccessor(successor: ContextHandlerInterface<HttpContextInterface>) {
    this.postSuccessor = successor;
  }

  private getSuccessor?: ContextHandlerInterface<HttpContextInterface>;
  private postSuccessor?: ContextHandlerInterface<HttpContextInterface>;
  private patchSuccessor?: ContextHandlerInterface<HttpContextInterface>;
  private successor?: ContextHandlerInterface<HttpContextInterface>;
  private layer?: LayerHandler;
}

/**
 * type of context handler that is used as a switcher for diffrent types of paths
 * /home
 * /api
 *
 */
class ChainHandler implements ContextHandlerInterface<HttpContextInterface> {
  private isRegex: boolean = false;
  private baseRoute?: Route;
  private successor?: ContextHandlerInterface<HttpContextInterface>;
  private routes: Map<string, LayerHandler> = new Map();

  use(
    path: string,
    handler: ContextHandlerInterface<HttpContextInterface>,
    method: HttpMethod = HttpMethod.ALL,
  ) {
    const basePath = path.split("/").slice(1, 2).join("/");
    const deepPath = "/" + path.split("/").slice(2).join("/");
    if (!this.routes.has(basePath)) {
      this.routes.set(basePath, new LayerHandler());
      // todo set base path for the layer
    }
    // todo remove debug
    console.log(
      `[ChainHandler::use] basePath: ${basePath}  deepPath: ${deepPath} method: ${method}`,
    );
    (this.routes.get(basePath) as LayerHandler).useMiddleware(
      deepPath,
      handler,
      method,
    );
  }

  setRoute(route: Route) {
    this.baseRoute = route;
    for (let key of this.routes.keys()) {
      console.log("connecting ", route.pattern, "with key ", key);
      let deepRoute: Route = new Route(HttpMethod.ALL, key);
      deepRoute.connectWithParent(this.baseRoute);
      this.routes.get(key)?.setRoute(deepRoute);
    }
  }

  handle(context: HttpContextInterface) {
    // console.log(
    //   `MapHandler:handle paths:${[...this.routes.keys()]} basepath:${
    //     this.baseRoute?.pattern
    //   } for uri ${context.request.url}`,
    // );
    let pattern = this.baseRoute?.isRegex
      ? new RegExp(this.baseRoute?.pattern)
      : this.baseRoute?.pattern;
    let key = context.request.url.replace(pattern ?? "", "").split("/")[0];
    // console.log(pattern);
    //console.log("found key ",request.url.replace(pattern, ""),key," on map handler",);
    let handler = this.routes.get(key) ?? this.successor;
    //console.log(handler);
    if (handler != null) {
      handler.handle(context);
    } else if (this.successor != null) {
      this.successor.handle(context);
    } else {
      throw "Not handled middleware" + this.successor;
    }
  }
  setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>) {
    //console.log("setting succcessor for map handler");
    this.successor = successor;
    for (let [key, value] of this.routes) {
      value.setSuccessor(successor);
    }
    return this;
  }
}

/**
 * switcher but with ony one path. Used for routes that contain regex or params
 * params are also parsed here
 */
class RegexChainHandler
  implements ContextHandlerInterface<HttpContextInterface> {
  private baseRoute?: Route;
  private handler?: LayerHandler;
  private regex?: RegExp;
  private stringRegex?: string | null;
  private param?: string | null;
  private successor?: ContextHandlerInterface<HttpContextInterface>;
  constructor() {
  }

  setRoute(route: Route) {
    // console.log("setting route");
    this.baseRoute = route;
    let deepRoute: Route = new Route(
      HttpMethod.ALL,
      this.stringRegex != null ? `(${this.stringRegex})` : "([^/]*)",
    );
    deepRoute.setRegex(true);
    deepRoute.bindToParent(this.baseRoute);
    this.handler?.setRoute(deepRoute);
  }

  handle(context: HttpContextInterface) {
    let url = context.request.url;
    let local = url.replace(this.baseRoute?.prefixRegex ?? "", "").split(
      "/",
    )[0];
    context.request.params = {
      [this.param ?? ""]: local,
      ...context.request.params,
    };
    // console.log(this.handler);
    this.handler?.handle(context);
  }

  setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>) {
    this.successor = successor;
    this.handler?.setSuccessor(this.successor);
  }

  use(
    path: string,
    handler: ContextHandlerInterface<HttpContextInterface>,
    method: HttpMethod,
  ) {
    const basePath = path.split("/").slice(1, 2).join("/");
    const deepPath = "/" + path.split("/").slice(2).join("/");
    const paramParser = new ParamParser(basePath);
    this.regex = paramParser.getRegex();
    this.param = paramParser.getParam();
    this.stringRegex = paramParser.getRegexString();
    if (this.handler == undefined) {
      this.handler = new LayerHandler();
    }
    this.handler.useMiddleware(deepPath, handler, method);
  }
}

/**
 * holds infor about route information , used for regex operations
 */
class Route {
  #method: HttpMethod;
  #pattern: string;
  #strictRegex?: RegExp;
  #prefixRegex?: RegExp;
  #isRegex: boolean;
  constructor(method: HttpMethod, route: string) {
    this.#method = method;
    this.#pattern = route;
    this.#isRegex = false;
  }
  bindToParent(parent: Route) {
    this.connectWithParent(parent);
  }
  connectWithParent(parent: Route) {
    console.log("connected ", parent.pattern, " with self to ", this.#pattern);
    this.#pattern = `${parent.pattern ?? "/"}${this.#pattern ?? ""}/`;
    console.log(this.#pattern);
    this.#strictRegex = new RegExp(`^${this.pattern}$`);
    this.#prefixRegex = new RegExp(`^${this.pattern}`);
    this.#isRegex = this.#isRegex || parent.#isRegex;
  }

  setRegex(status: boolean) {
    this.#isRegex = status;
  }
  get isRegex(): boolean {
    return this.#isRegex;
  }
  get method(): HttpMethod {
    return this.#method;
  }
  get pattern(): string {
    return this.#pattern;
  }
  get strictRegex(): RegExp | undefined {
    return this.#strictRegex;
  }
  get prefixRegex(): RegExp | undefined {
    return this.#prefixRegex;
  }

  isStrictMatch(uri: string) {
    // console.log(
    //   "checking ",
    //   this.strictMatch,
    //   "uri",
    //   uri,
    //   uri + "/",
    //   this.strictMatch?.test(uri),
    //   this.strictMatch?.test(uri + "/"),
    // );
    return (this.#strictRegex?.test(uri) || this.#strictRegex?.test(uri + "/"));
  }

  isPrefixMatch(uri: string) {
    return (this.#prefixRegex?.test(uri) ||
      this.#prefixRegex?.test(uri + "/")) ?? false;
  }
}

/**
 * used on layer handler to chain middleware function
 * an iterator that iterates over elements of a list that fullfill a particular condition
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

/**
 * helper class for parsing params
 */
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
    if (
      this.partition.lastIndexOf(")") != -1 || this.partition.indexOf("(") != -1
    ) {
      return this.partition.slice(
        this.partition.indexOf("(") + 1,
        this.partition.lastIndexOf(")"),
      );
    }
    return null;
  }
  getRegex() {
    return new RegExp(this.getRegexString() ?? "([^/]*)");
  }
}
