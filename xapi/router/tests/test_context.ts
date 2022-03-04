import {RoutingContext} from "../lib/context.ts";
import {ContextHandlerInterface} from "../lib/handeler/handelers.ts";

export type TestMiddlewareFunction<T> = (ctx: T, next: () => void) => void;
export type TestContextType = {
  [key: string | number]: string | number | undefined | boolean;
};

export class TestContextHandeler<T = TestContextType>
  implements ContextHandlerInterface
{
  successor: ContextHandlerInterface | undefined;
  handler: TestMiddlewareFunction<T>;
  constructor(handler: TestMiddlewareFunction<T>) {
    this.handler = handler;
  }

  handle(context: RoutingContext<T>): void {
    this.handler(context.context, () => this.successor?.handle(context));
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.successor = successor;
  }
}
