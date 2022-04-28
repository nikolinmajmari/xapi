import {RoutingContext} from "./context.ts";
import {ContextHandlerInterface} from "./handeler/handelers.ts";
import {Router as XapiRouter} from "./xapi_router.ts";

type BaseFunctionHandler<T> = (
  context: T,
  next: () => Promise<void>
) => Promise<void>;
const defaultAdapterCreater = <C, F extends Function>(item: F) =>
  new ContextHandelerAdapter<C, F>(item);
export class ContextHandelerAdapter<
  C,
  F extends Function = BaseFunctionHandler<C>
> implements ContextHandlerInterface
{
  #handeler: F;
  #sucessor: ContextHandlerInterface | undefined;
  constructor(handeler: F) {
    this.#handeler = handeler;
  }
  async handle(routingContext: RoutingContext<C>): Promise<void> {
    await this.#handeler(
      routingContext.context,
      async () => await this.invokeSucessor(routingContext)
    );
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.#sucessor = successor;
  }
  async invokeSucessor(routingContext: RoutingContext<C>) {
    if (this.#sucessor != undefined) {
      await this.#sucessor?.handle(routingContext);
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
export class Router<C> extends XapiRouter<
  C,
  BaseFunctionHandler<C>,
  ContextHandelerAdapter<C, BaseFunctionHandler<C>>
> {
  constructor() {
    super(defaultAdapterCreater);
  }
}
