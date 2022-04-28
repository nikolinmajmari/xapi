import {HttpMethod, RoutingContext} from "./context.ts";
import {ContextHandlerInterface} from "./handeler/handelers.ts";
import {Router as XapiRouter} from "./xapi_router.ts";

/**
 * The shared information accross the middleware functions
 */
export class Context {
  readonly event: Deno.RequestEvent;
  params: {};
  constructor(event: Deno.RequestEvent) {
    this.event = event;
    this.params = {};
  }
}

/**
 * the middleware function type that the router will accept
 */
type BaseFunctionHandler = (context: Context, next: () => void) => void;

/**
 * this adapter is used to wrap functions to context handeler adapter instances
 * these instance implement context handler interface and therefore
 * can be called and chained by router for the routing graph
 * @param item Default middleware function type router accepts
 * @returns
 */
const defaultAdapterCreater = (item: BaseFunctionHandler) =>
  new ContextHandelerAdapter(item);

/**
 * The wrapper of the functions, this class is needed so the router can call your function
 * Using this adapter you can decide your own way how functions are called
 * also gives you posibility to decide any function type you want to use in the router
 */
export class ContextHandelerAdapter implements ContextHandlerInterface {
  #handeler: BaseFunctionHandler;
  #sucessor: ContextHandlerInterface | undefined;
  constructor(handeler: BaseFunctionHandler) {
    this.#handeler = handeler;
  }
  async handle(routingContext: RoutingContext<Context>): Promise<void> {
    routingContext.context.params = routingContext.params;
    await this.#handeler(routingContext.context, () =>
      this.invokeSucessor(routingContext)
    );
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.#sucessor = successor;
  }
  invokeSucessor(routingContext: RoutingContext<Context>) {
    if (this.#sucessor != undefined) {
      this.#sucessor?.handle(routingContext);
    } else {
      throw "sucessor not found for this middleware on " + this;
    }
  }
}

/**
 * This method creates a routing context from shared context
 * The routing library knows only about shared context
 * you need to handle communication between contexes by your self
 * this is done to separate concerns and make library independed
 * @param ctx The shared context
 * @returns
 */
export function createRoutingContext(ctx: Context) {
  let method;
  switch (ctx.event.request.method) {
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
  let url = new URL(ctx.event.request.url);
  return new RoutingContext<Context>(ctx, url, method);
}

/**
 *  XapiRouter class is the base class of the library
 *  the first  generic argument of the library is the shared context type accross functions
 * the second is the middleware function type you are going to use on the router
 * the third is the adapter class we defined upper
 * xapirouter needs the adapter creator function on its constructor we invoke using supper argument
 */
export class Router extends XapiRouter<
  Context,
  BaseFunctionHandler,
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
  protected completeMiddlewareWith(handler: BaseFunctionHandler) {
    this.handler.setRoute();
    this.handler.setSuccessor(super.createAdaptor(handler));
    this.handler.chainHandlers();
  }
}
