import {ChainHandler} from "../../lib/handeler/chain_handeler.ts";
import {
  AssertionError,
  equal,
  assert,
  assertMatch,
  assertEquals,
  fail,
  assertThrows,
  unimplemented,
  unreachable,
} from "https://deno.land/std/testing/asserts.ts";
import {TestContextType, TextContextHandeler} from "./handelers.ts";
import {HttpMethod, RoutingContext} from "../../lib/context.ts";
const chainHandler = new ChainHandler();
chainHandler.use(
  "1",
  new TextContextHandeler((ctx, next) => {
    ctx["1"] = true;
    next();
  })
);
chainHandler.use(
  "2",
  new TextContextHandeler((ctx, next) => {
    ctx["2"] = true;
    next();
  })
);
chainHandler.setSuccessor(new TextContextHandeler((ctx, next) => 1));
const firstContext = new RoutingContext<TestContextType>(
  {},
  new URL("http:\\localhost/1"),
  HttpMethod.GET
);
const secondContext = new RoutingContext<TestContextType>(
  {},
  new URL("http:\\localhost/1"),
  HttpMethod.GET
);

Deno.test({
  name: "testing single chain handler",
  fn: () => {
    chainHandler.handle(firstContext);
    chainHandler.handle(secondContext);
    assertEquals(
      firstContext.context["1"],
      true,
      "chain handler test case 1 failed "
    );
    assertEquals(
      secondContext.context["2"],
      true,
      "chain handler test case 2 failed"
    );
  },
});
