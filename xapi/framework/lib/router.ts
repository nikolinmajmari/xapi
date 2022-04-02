import {
  ContextHandlerInterface,
  RoutingContextInterfaceFactory,
  XapiRouter,
  RoutingContext,
  HttpMethod,
} from "../deps.ts";
import {ContextInterface} from "./context.ts";

/**
 * defines the default function type to be used in middleware
 * @param context An instance that implements ContextInterface. Shared context accross middleware
 * @param next An callback that invokes the next middleware function
 */
type FunctionHandler = (context: ContextInterface, next: () => void) => void;

/**
 *
 * @param item Function of type FunctionHandler
 * @returns ContextHandlerAdapter type
 */
export const defaultAdapterCreater = (item: FunctionHandler) =>
  new ContextHandelerAdapter(item);

/**
 * The adapter class wraps the user function and helps the router invoke user function. It also implements
 * context handler interface so that chaining can happen
 */
export class ContextHandelerAdapter implements ContextHandlerInterface {
  /**
   *
   */
  #handeler: FunctionHandler;
  #sucessor: ContextHandlerInterface | undefined;
  constructor(handeler: FunctionHandler) {
    this.#handeler = handeler;
  }
  handle(routingContext: RoutingContext<ContextInterface>): void {
    /// handle parameter passing
    routingContext.context.request.params = {
      ...routingContext.context.request.params,
      ...routingContext.params,
    };
    this.#handeler(routingContext.context, () =>
      this.invokeSucessor(routingContext)
    );
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.#sucessor = successor;
  }
  invokeSucessor(routingContext: RoutingContext<ContextInterface>) {
    if (this.#sucessor != undefined) {
      this.#sucessor?.handle(routingContext);
    } else {
      throw "sucessor not found for this middleware on " + this;
    }
  }
}

/**
 *  default router class to create your middleware handlers
 *
 *  const router = new Router();
 *  router.use((ctx,next)=>{
 *      doSomething(ctx);
 *      next();
 *  });
 *  but before extend this class to set yur C type by default
 *  the shared information between handelers
 */
export class Router extends XapiRouter<
  ContextInterface,
  FunctionHandler,
  ContextHandelerAdapter
> {
  constructor() {
    super(defaultAdapterCreater);
  }

  /**
   * This is used to set the end function of the middleware
   * should be called to compleete the middleware grapht
   * @param handler Function
   */
  protected completeMiddlewareWith(handler: FunctionHandler) {
    this.handler.setRoute();
    this.handler.setSuccessor(defaultAdapterCreater(handler));
    this.handler.chainHandlers();
  }
}

/**
 * factory that is used to create context
 */
export class RoutingContextFactory
  implements RoutingContextInterfaceFactory<ContextInterface>
{
  createRoutingContextFrom(
    ctx: ContextInterface
  ): RoutingContext<ContextInterface> {
    let method;
    switch (ctx.request.method) {
      case "get":
      case "Get":
      case "GET":
        method = HttpMethod.GET;
        break;
      case "post":
      case "Post":
      case "POST":
        method = HttpMethod.POST;
        break;
      case "put":
      case "PUT":
      case "Put":
        method = HttpMethod.PUT;
        break;
      case "Patch":
      case "patch":
      case "PATCH":
        method = HttpMethod.PATCH;
        break;
      case "delete":
      case "DELETE":
      case "Delete":
        method = HttpMethod.DELETE;
        break;
      default:
        throw "Unknown http method";
    }
    let url = new URL(ctx.request.url);
    return new RoutingContext<ContextInterface>(ctx, url, method);
  }
}
