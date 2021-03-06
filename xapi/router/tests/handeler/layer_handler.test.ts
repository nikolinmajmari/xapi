import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {HttpMethod, RoutingContext} from "../../lib/context.ts";
import {LayerHandler} from "../../lib/handeler/layer_handeler.ts";
import {Route} from "../../lib/handeler/route.ts";
import {TestContextHandeler, TestContextType} from "../test_context.ts";

const layer = new LayerHandler();
const createChainableMiddleware = (path: string, method: HttpMethod) => {
  layer.useMiddleware(
    path,
    new TestContextHandeler((ctx, next) => {
      ctx[path + method] = true;
      next();
    }),
    method
  );
};
const createEndMiddleware = (path: string, method: HttpMethod) => {
  layer.useMiddleware(
    path,
    new TestContextHandeler((ctx, next) => {
      ctx[path + method] = true;
    }),
    method
  );
};
const closeChain = (signal: () => void) => {
  layer.useMiddleware(
    "/",
    new TestContextHandeler<TestContextType>((ctx, next) => {
      signal();
    })
  );
  layer.setRoute();
  layer.chainHandlers();
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
  layer.handle(context);
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

Deno.test({
  name: "testing single level path match and method match ",
  fn: () => {
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
    console.log("layer handeler test case 1 successfully passed");
  },
});
