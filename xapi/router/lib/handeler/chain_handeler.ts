import {HttpMethod, RoutingContextInterface} from "../context.ts";
import {ContextHandlerInterface} from "./handelers.ts";
import {LayerHandler} from "./layer_handeler.ts";
import {Route} from "./route.ts";

/**
 * type of context handler that is used as a switcher for diffrent types of paths
 * /home
 * /api
 *
 */
export class ChainHandler implements ContextHandlerInterface {
  private baseRoute?: Route;
  private successor?: ContextHandlerInterface;
  private routes: Map<string, LayerHandler> = new Map();

  use(
    path: string,
    handler: ContextHandlerInterface,
    method: HttpMethod = HttpMethod.ALL
  ) {
    const basePath = path.split("/").slice(1, 2).join("/");
    const deepPath = "/" + path.split("/").slice(2).join("/");
    if (!this.routes.has(basePath)) {
      this.routes.set(basePath, new LayerHandler());
    }
    console.log(
      `[ChainHandler::use] basePath: ${basePath}  deepPath: ${deepPath} method: ${method}`
    );
    (this.routes.get(basePath) as LayerHandler).useMiddleware(
      deepPath,
      handler,
      method
    );
  }

  setRoute(route: Route) {
    this.baseRoute = route;
    for (const key of this.routes.keys()) {
      console.log("connecting ", route.pattern, "with key ", key);
      const deepRoute: Route = new Route(HttpMethod.ALL, key);
      deepRoute.connectWithParent(this.baseRoute);
      this.routes.get(key)?.setRoute(deepRoute);
    }
  }

  handle(context: RoutingContextInterface) {
    const pattern = this.baseRoute?.isRegex
      ? new RegExp(this.baseRoute?.pattern)
      : this.baseRoute?.pattern;
    const key = context.url.pathname.replace(pattern ?? "", "").split("/")[0];
    const handler = this.routes.get(key) ?? this.successor;
    if (handler != null) {
      handler.handle(context);
    } else if (this.successor != null) {
      this.successor.handle(context);
    } else {
      throw "Not handled middleware" + this.successor;
    }
  }
  setSuccessor(successor: ContextHandlerInterface) {
    //console.log("setting succcessor for map handler");
    this.successor = successor;
    for (const [_, value] of this.routes) {
      value.setSuccessor(successor);
    }
    return this;
  }
}
