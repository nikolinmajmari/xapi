import {RoutingContext} from "./context.ts";
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
  handle(routingContext: RoutingContext<Context>): void {
    routingContext.context.params = routingContext.params;
    this.#handeler(routingContext.context, () =>
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
}
