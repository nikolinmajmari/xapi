import {HttpMethod, RoutingContextInterface} from "../context.ts";
import {ContextHandlerInterface} from "./handelers.ts";
import {LayerHandler} from "./layer_handeler.ts";

/**
 * A context handler used by layer to chain context handlers
 *
 */
export class ChainedSuccessor implements ContextHandlerInterface {
  handle(context: RoutingContextInterface): void {
    if (this.layer?.getRoute()?.isStrictMatch(context.path)) {
      const handeler = this.methodSuccessors.get(context.method);
      if (handeler != undefined) {
        return handeler.handle(context);
      }
    }
    if (this.successor != undefined) {
      this.successor.handle(context);
    } else {
      throw "Error";
    }
  }

  setSuccessor(successor: ContextHandlerInterface) {
    this.successor = successor;
  }

  setMethodSuccessor(successor: ContextHandlerInterface, method: HttpMethod) {
    switch (method) {
      case HttpMethod.GET:
        this.methodSuccessors.set(HttpMethod.GET, successor);
        break;
      case HttpMethod.POST:
        this.methodSuccessors.set(HttpMethod.POST, successor);
        break;
      case HttpMethod.PUT:
        this.methodSuccessors.set(HttpMethod.POST, successor);
        break;
      case HttpMethod.PATCH:
        this.methodSuccessors.set(HttpMethod.POST, successor);
        break;
      case HttpMethod.DELETE:
        this.methodSuccessors.set(HttpMethod.POST, successor);
        break;
      case HttpMethod.ALL:
        this.setSuccessor(successor);
        break;
    }
  }

  constructor(parent: LayerHandler) {
    this.layer = parent;
  }
  private methodSuccessors: Map<HttpMethod, ContextHandlerInterface> =
    new Map();
  private successor?: ContextHandlerInterface;
  private layer?: LayerHandler;
}
