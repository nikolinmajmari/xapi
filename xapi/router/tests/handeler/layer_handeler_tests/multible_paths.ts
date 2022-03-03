import {ChainHandler} from "../../../lib/handeler/chain_handeler.ts";
import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {TestContextType, TextContextHandeler} from "../handelers.ts";
import {HttpMethod, RoutingContext} from "../../../lib/context.ts";
import {LayerHandler} from "../../../lib/handeler/layer_handeler.ts";
import {Route} from "../../../lib/handeler/route.ts";

export default function runTest() {
  const chainHandler = new ChainHandler();
  const layer = new LayerHandler();
  /**
   * method ALL
   * path /first
   */
  layer.useMiddleware(
    "/first",
    new TextContextHandeler((ctx, next) => {
      ctx["first_all"] = true;
      next();
    })
  );
  /**
   * method GET
   * path /first
   */
  layer.useMiddleware(
    "/first",
    new TextContextHandeler((ctx, next) => {
      ctx["first_get"] = true;
      next();
    })
  );

  /**
   * method GET
   * path /second
   */
  layer.useMiddleware(
    "/second",
    new TextContextHandeler((ctx, next) => {
      ctx["second_delete"] = true;
      next();
    }),
    HttpMethod.DELETE
  );
  /**
   * method POST
   * path /first/second
   */
  layer.useMiddleware(
    "/first/second",
    new TextContextHandeler((ctx, next) => {
      ctx["first/second_post"] = true;
      next();
    }),
    HttpMethod.POST
  );
  /**
   * method PUT
   * path /first/second
   */
  layer.useMiddleware(
    "/first/second",
    new TextContextHandeler((ctx, next) => {
      ctx["first/second_put"] = true;
      next();
    }),
    HttpMethod.PUT
  );
  layer.setRoute(new Route(HttpMethod.ALL, "/"));
  layer.setSuccessor(new TextContextHandeler((ctx, next) => 1));
  layer.chainHandlers();

  const firstContext = new RoutingContext<TestContextType>(
    {},
    new URL("http:\\localhost/first"),
    HttpMethod.GET
  );
  const secondContext = new RoutingContext<TestContextType>(
    {},
    new URL("http:\\localhost/first"),
    HttpMethod.POST
  );
  const thirdContext = new RoutingContext<TestContextType>(
    {},
    new URL("http:\\localhost/second"),
    HttpMethod.POST
  );
  const fourthContext = new RoutingContext<TestContextType>(
    {},
    new URL("http:\\localhost/second"),
    HttpMethod.GET
  );
  const fifthContext = new RoutingContext<TestContextType>(
    {},
    new URL("http:\\localhost/thirrd"),
    HttpMethod.POST
  );

  layer.handle(firstContext);
  layer.handle(secondContext);
  layer.handle(thirdContext);
  layer.handle(fourthContext);
  layer.handle(fifthContext);
  assertEquals(
    firstContext.context["first"],
    true,
    "chain handler test case 1 failed "
  );
  assertEquals(
    secondContext.context["first"],
    true,
    "chain handler test case 2 failed"
  );
  assertEquals(
    thirdContext.context["second"],
    undefined,
    "chain handler test case 3 failed"
  );
  assertEquals(
    fourthContext.context["second"],
    true,
    "chain handler test case 4 failed"
  );
  assertEquals(
    fifthContext.context["third"],
    undefined,
    "chain handler test case 5 failed"
  );
}
