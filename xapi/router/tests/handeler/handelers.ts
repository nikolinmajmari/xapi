import {
  RoutingContext,
  RoutingContextInterfaceFactory,
} from "../../lib/context.ts";
import {RoutingContextInterface} from "../../lib/context.ts";
import {ContextHandlerInterface} from "../../lib/handeler/handelers.ts";

export type TestMiddlewareFunction<T> = (ctx: T, next: () => void) => void;
export type TestContextType = {
  [key: string | number]: string | number | undefined | boolean;
};

export class TextContextHandeler<T = TestContextType>
  implements ContextHandlerInterface
{
  successor: ContextHandlerInterface | undefined;
  handler: TestMiddlewareFunction<T> | undefined;
  constructor(handler: TestMiddlewareFunction<T>) {
    this.handler = handler;
  }

  handle(context: RoutingContext<T>): void {
    if (this.handler != undefined) {
      this.handler(context.context, () => this.successor?.handle(context));
    } else {
      throw "Exception";
    }
  }
  setSuccessor(_successor: ContextHandlerInterface): void {
    this.successor = _successor;
  }
}
