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
  private parentRoute?: Route;
  private handler?: LayerHandler;
  private parser: ParamParser | undefined;
  private param: string | undefined;
  private part: string | undefined;
  private regexString: string | undefined;
  private regex: RegExp | undefined;
  private successor?: ContextHandlerInterface;
  constructor() {}

  matches(path: string) {
    return (
      path.split("/").slice(1, 2).join("/") == this.part ||
      this.part == undefined
    );
  }

  setRoute(route: Route) {
    this.parentRoute = route;
    this.baseRoute = new Route(
      HttpMethod.ALL,
      this.regexString != null ? `(${this.regexString})/` : "([^/]*)/"
    );
    this.baseRoute.setRegex(true);
    this.baseRoute.bindToParent(route);
    this.handler?.setRoute(this.baseRoute);
    //console.log("base route :", this.baseRoute.pattern);
  }

  handle(context: RoutingContextInterface) {
    const url = context.path;
    if (this.baseRoute?.isPrefixMatch(url)) {
      if (this.param != "" && this.param != undefined) {
        const parts = url.replace(this.parentRoute?.prefixRegex ?? "/", "");
        const param = parts.split("/")[0];
        context.params = {
          [this.param ?? ""]: param,
          ...context.params,
        };
      }
      this.handler?.handle(context);
    } else if (this.successor != undefined) {
      this.successor.handle(context);
    } else {
      throw "Not handled middleware";
    }
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
    this.part = basePath;
    const deepPath = "/" + path.split("/").slice(2).join("/");
    //console.log(basePath, deepPath);
    this.parser = new ParamParser(basePath);
    this.regexString = this.parser.getRegexString() ?? undefined;
    this.regex = this.parser.getRegex();
    this.param = this.parser.getParam();
    //console.log("use: ", this.param, this.regex, this.regexString);
    if (this.handler == undefined) {
      this.handler = new LayerHandler();
    }
    this.handler.useMiddleware(deepPath, handler, method);
  }
}
