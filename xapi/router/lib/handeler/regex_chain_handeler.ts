import {HttpMethod, RoutingContextInterface} from "../context.ts";
import {ContextHandlerInterface} from "./handelers.ts";
import {LayerHandler} from "./layer_handeler.ts";
import {ParamParser, Route} from "./route.ts";

/**
 * switcher but with ony one path. Used for routes that contain regex or params
 * params are also parsed here
 */
export class RegexChainHandler implements ContextHandlerInterface {
  private baseRoute?: Route;
  private handler?: LayerHandler;
  private regex?: RegExp;
  private stringRegex?: string | null;
  private param?: string | null;
  private successor?: ContextHandlerInterface;
  constructor() {}

  setRoute(route: Route) {
    ///
    /// base route    /base
    /// deep route    /deep/route
    /// deep route after
    /// binding       /base/deep/route
    ///
    /// routes are chained from top to bottom
    /// science the programer defines them from bottom up

    this.baseRoute = route;
    const deepRoute: Route = new Route(
      HttpMethod.ALL,
      this.stringRegex != null ? `(${this.stringRegex})` : "([^/]*)"
    );
    deepRoute.setRegex(true);
    deepRoute.bindToParent(this.baseRoute);
    this.handler?.setRoute(deepRoute);
  }

  handle(context: RoutingContextInterface) {
    const url = context.url.pathname;
    const local = url
      .replace(this.baseRoute?.prefixRegex ?? "", "")
      .split("/")[0];
    context.params = {
      [this.param ?? ""]: local,
      ...context.params,
    };
    this.handler?.handle(context);
  }

  setSuccessor(successor: ContextHandlerInterface) {
    this.successor = successor;
    this.handler?.setSuccessor(this.successor);
  }

  use(path: string, handler: ContextHandlerInterface, method: HttpMethod) {
    /// path         /basepath/deep/path
    /// basepath     /basepath
    /// deeppath     /deep/path
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
