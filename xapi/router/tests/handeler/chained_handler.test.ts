import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {HttpMethod, RoutingContext} from "../../lib/context.ts";
import {ChainHandler} from "../../lib/handeler/chain_handeler.ts";
import {Route} from "../../lib/handeler/route.ts";
import {TestContextType, TestContextHandeler} from "../test_context.ts";

const chainedHander = new ChainHandler();
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
    new URL(`http://localhost/${path}`),
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
createChainableMiddleware("/home", HttpMethod.ALL);
createChainableMiddleware("/home", HttpMethod.POST);
createChainableMiddleware("/login", HttpMethod.GET);
createEndMiddleware("/home/auth", HttpMethod.POST);
createEndMiddleware("/home/auth/me", HttpMethod.GET);
createChainableMiddleware("/home/auth/me", HttpMethod.POST);
createChainableMiddleware("/home/auth", HttpMethod.ALL);
closeChain(() => 1);

Deno.test("testing chained handler", () => {
  testCase("home", HttpMethod.POST, (ctx) =>
    assertEquals(ctx, {
      ["/home" + HttpMethod.ALL]: true,
      ["/home" + HttpMethod.POST]: true,
    })
  );
  testCase("home", HttpMethod.GET, (ctx) =>
    assertEquals(ctx, {["/home" + HttpMethod.ALL]: true})
  );
  testCase("login", HttpMethod.POST, (ctx) => assertEquals(ctx, {}));
  testCase("home/auth", HttpMethod.POST, (ctx) =>
    assertEquals(ctx, {
      ["/home" + HttpMethod.ALL]: true,
      ["/home/auth" + HttpMethod.POST]: true,
    })
  );
  testCase("home/auth/me", HttpMethod.POST, (ctx) =>
    assertEquals(ctx, {
      ["/home/auth/me" + HttpMethod.POST]: true,
      ["/home" + HttpMethod.ALL]: true,
      ["/home/auth" + HttpMethod.ALL]: true,
    })
  );
  console.log("chain handler fully testested, test passed ");
});
