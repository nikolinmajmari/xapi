import {HttpMethod, RoutingContextInterface} from "../context.ts";
import {ChainedSuccessor} from "./chained_successor.ts";
import {ChainHandler} from "./chain_handeler.ts";
import {ContextHandlerInterface, LayerInterface} from "./handelers.ts";
import {RegexChainHandler} from "./regex_chain_handeler.ts";
import {Route} from "./route.ts";

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
export class LayerHandler implements LayerInterface, ContextHandlerInterface {
  private route: Route;
  private successor?: ContextHandlerInterface;
  private handelers: ContextHandlerInterface[];
  private methods: HttpMethod[];

  setRoute(route?: Route) {
    if (route != null) {
      this.route = route;
    }

    //propagate route to each context handler
    this.handelers.forEach((element) => {
      if (
        element instanceof ChainHandler ||
        element instanceof RegexChainHandler
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
    handler: ContextHandlerInterface,
    method: HttpMethod = HttpMethod.ALL
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
    } else if (path[1] == ":" || path[1] == "(") {
      // these are handlers that have route params ore regex epressions
      let regexChainHandler: RegexChainHandler;
      if (
        this.handelers.length > 0 &&
        this.handelers[this.handelers.length - 1] instanceof RegexChainHandler
      ) {
        regexChainHandler = this.handelers[
          this.handelers.length - 1
        ] as RegexChainHandler;
      } else {
        regexChainHandler = new RegexChainHandler();
        this.handelers.push(regexChainHandler);
        this.methods.push(HttpMethod.ALL);
      }
      regexChainHandler.use(path, handler, method);
    } else {
      // these are handlers for the deeper layers
      let chainHandler: ChainHandler;
      if (
        this.handelers.length > 0 &&
        this.handelers[this.handelers.length - 1] instanceof ChainHandler
      ) {
        chainHandler = this.handelers[
          this.handelers.length - 1
        ] as ChainHandler;
      } else {
        chainHandler = new ChainHandler();
        this.handelers.push(chainHandler);
        this.methods.push(HttpMethod.ALL);
      }
      chainHandler.use(path, handler, method);
    }
  }

  async handle(context: RoutingContextInterface) {
    const strict = this.route?.isStrictMatch(context.url.pathname) ?? false;
    if (strict) {
      let start = 0;
      for (; start < this.handelers.length; start++) {
        if (
          context.method == this.methods[start] ||
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

  ///
  /// build up layer chain which is used during middleware handle for routing
  ///
  chainMiddleware() {
    if (this.handelers.length == 1 && this.successor) {
      this.handelers[0].setSuccessor(this.successor);
    } else if (this.handelers.length > 0) {
      /// chain handelers of same method type as below

      /// all    get    get   post    all    post    all    get
      /// all -> get -> get     ->    all     ->     all -> get
      /// all        ->       post -> all -> post -> all
      ///
      /// point of interest is that two gets will allways point to each other and a previous get will allways
      /// point to next get or all but not put as successor
      ///
      const createMethodIterator = (method: HttpMethod) => {
        return new WhereIterator(
          this.handelers,
          (_item: ContextHandlerInterface, index: number) => {
            return (
              this.methods[index] == HttpMethod.ALL ||
              this.methods[index] == method
            );
          }
        );
      };
      const iterators = [
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
          ///
          /// start and end are indexes of a sequence composed of two all handelers
          /// with at least a single method handeler between
          /// chained successor is used to handle chaining on complex combinations as below
          /// on middleware  all:  all    get    get   post   get  all   post  get   all
          /// on middleware  get:  all    get    get          get  all         get   all
          /// on middleware post:  all                 post        all   post        all
          /// all all methods must have an ChainedSuccessor instance sucessor which will
          /// chain the next sucessor based on the context method to the nearest next get
          /// or post request in our case
          ///
          const chainedSuccessor = new ChainedSuccessor(this);
          for (const method of [
            HttpMethod.GET,
            HttpMethod.PATCH,
            HttpMethod.POST,
            HttpMethod.PUT,
            HttpMethod.DELETE,
          ]) {
            const firstIndex = this.getFirstMethodHandlerIndex(
              start,
              end,
              method
            );
            if (firstIndex != null) {
              chainedSuccessor.setMethodSuccessor(
                this.handelers[firstIndex],
                method
              );
            }
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

  ///
  /// gets the first index of the handeler with specified method on a sequence of
  /// handelers where the first one is an all handeler while the last one is another
  /// all handeler with at least one method handler between. The last one of seq might not
  /// be an all handler only when the end value is the index of last element of the layer
  /// handler handlers
  ///
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
    //  console.log("chaining middleware for ", this.handelers);
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

/**
 * used on layer handler to chain middleware function
 * an iterator that iterates over elements of a list that fullfill a particular condition
 */

class WhereIterator<T> {
  private parent: T[];
  private where: (item: T, index: number) => boolean;
  private index: number;
  constructor(parent: T[], where: (item: T, index: number) => boolean) {
    this.parent = parent;
    this.where = where;
    this.index = -1;
  }

  get(): T | null {
    if (this.index >= 0 && this.index < this.parent.length) {
      return this.parent[this.index];
    }
    return null;
  }

  getIndex(): number | null {
    if (this.index >= 0 && this.index < this.parent.length) {
      return this.index;
    }
    return null;
  }
  next(): T | null {
    this.index++;
    while (
      this.index >= 0 &&
      this.index < this.parent.length &&
      !this.where(this.parent[this.index], this.index)
    ) {
      //console.log(this.where(this.parent[this.index], this.index), this.index);
      this.index++;
    }
    return this.get();
  }
}
