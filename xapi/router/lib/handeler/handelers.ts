import { HttpMethod, RoutingContextInterface } from "../context.ts";


/**
 * Defines how the handeler should be constructed to handle the context
 * which is shared through the handelers
 * @method handle handeles the context
 * @method setSuccessor sets the next handler to be called if specified
 */
export interface ContextHandlerInterface{
    handle(context: RoutingContextInterface):void;
    setSuccessor(successor: ContextHandlerInterface): void;
}



/**
 * layer is a component that is called ony for a particular prefix, holts a stack of middleware
 * context handlers which are chained based on the specific http method
 * this is the layer interface
 */
 export interface LayerInterface {
    useMiddleware(
      path: string,
      handler: ContextHandlerInterface,
      method: HttpMethod,
    ): void;
  }
  