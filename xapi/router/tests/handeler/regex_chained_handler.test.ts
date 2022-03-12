import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {HttpMethod, RoutingContext} from "../../lib/context.ts";
import {RegexChainHandler} from "../../lib/handeler/regex_chain_handeler.ts";
import {Route} from "../../lib/handeler/route.ts";
import {TestContextType, TestContextHandeler} from "../test_context.ts";

const chainedHander = new RegexChainHandler();
const createChainableMiddleware = (path: string, method: HttpMethod) => {
  chainedHander.use(
    path,
    new TestContextHandeler((ctx, next) => {
      ctx[path + method] = true;
      next();
    }),
    method
  );
};
const createEndMiddleware = (path: string, method: HttpMethod) => {
  chainedHander.use(
    path,
    new TestContextHandeler((ctx, next) => {
      ctx[path + method] = true;
    }),
    method
  );
};
const closeChain = (signal: () => void) => {
  chainedHander.setSuccessor(
    new TestContextHandeler<TestContextType>((ctx, next) => {
      signal();
    })
  );
  chainedHander.setRoute(new Route(HttpMethod.ALL, "/"));
};
const createRoutingContext = (path: string, method: HttpMethod) => {
  return new RoutingContext<TestContextType>(
    {},
    new URL(`http://localhost/${path}/`),
    method
  );
};
const testCase = (
  path: string,
  method: HttpMethod,
  test: (ctx: TestContextType) => void
) => {
  const context = createRoutingContext(path, method);
  chainedHander.handle(context);
  test(context.context);
};
createChainableMiddleware("/:id(\\d+)/", HttpMethod.ALL);
createChainableMiddleware("/:id(\\d+)/auth", HttpMethod.POST);
createChainableMiddleware("/:id(\\d+)/login", HttpMethod.GET);
createEndMiddleware("/:id(\\d+)/:service(a|b|c)", HttpMethod.POST);
createEndMiddleware("/:id(\\d+)/:service(c|d|e)", HttpMethod.GET);
createEndMiddleware("/:id(\\d+)/auth", HttpMethod.PUT);
closeChain(() => 1);

Deno.test("testing chained handler", () => {
  testCase("3/a", HttpMethod.GET, (ctx) =>
    assertEquals(ctx, {
      ["/:id(\\d+)/" + HttpMethod.ALL]: true,
    })
  );
  testCase("3", HttpMethod.PUT, (ctx) =>
    assertEquals(ctx, {
      ["/:id(\\d+)/" + HttpMethod.ALL]: true,
    })
  );
  testCase("3/c", HttpMethod.POST, (ctx) =>
    assertEquals(ctx, {
      ["/:id(\\d+)/" + HttpMethod.ALL]: true,
      ["/:id(\\d+)/:service(a|b|c)" + HttpMethod.POST]: true,
    })
  );
  testCase("3/d", HttpMethod.POST, (ctx) =>
    assertEquals(ctx, {
      ["/:id(\\d+)/" + HttpMethod.ALL]: true,
    })
  );

  testCase("3/d", HttpMethod.GET, (ctx) =>
    assertEquals(ctx, {
      ["/:id(\\d+)/" + HttpMethod.ALL]: true,
      ["/:id(\\d+)/:service(c|d|e)" + HttpMethod.GET]: true,
    })
  );
  testCase("3/auth", HttpMethod.POST, (ctx) =>
    assertEquals(ctx, {
      ["/:id(\\d+)/" + HttpMethod.ALL]: true,
      ["/:id(\\d+)/auth" + HttpMethod.POST]: true,
    })
  );

  console.log("chain handler fully testested, test passed ");
});
