import {ChainHandler} from "../../../lib/handeler/chain_handeler.ts";
import {TestContextType, TextContextHandeler} from "../handelers.ts";
import {HttpMethod, RoutingContext} from "../../../lib/context.ts";
import {LayerHandler} from "../../../lib/handeler/layer_handeler.ts";
import {Route} from "../../../lib/handeler/route.ts";

const layer = new LayerHandler();
/**
 * method ALL
 * path /a
 */
layer.useMiddleware(
  "/a",
  new TextContextHandeler((ctx, next) => {
    ctx["a"] = HttpMethod.ALL;
    next();
  })
);
/**
 * method POST
 * path /a
 */
layer.useMiddleware(
  "/a",
  new TextContextHandeler((ctx, next) => {
    ctx["a"] = HttpMethod.POST;
    next();
  }),
  HttpMethod.POST
);

/**
 * method GET
 * path /a/b
 */
layer.useMiddleware(
  "/a/b",
  new TextContextHandeler((ctx, next) => {
    ctx["ab"] = HttpMethod.DELETE;
    next();
  }),
  HttpMethod.DELETE
);
/**
 * method POST
 * path /a/b
 */
layer.useMiddleware(
  "/a/b",
  new TextContextHandeler((ctx, next) => {
    ctx["ab"] = HttpMethod.POST;
    next();
  }),
  HttpMethod.POST
);
/**
 * method PUT
 * path /first/second
 */
layer.useMiddleware(
  "/a/:id(\\d)",
  new TextContextHandeler((ctx, next) => {
    ctx["a:id"] = HttpMethod.PUT;
    next();
  }),
  HttpMethod.PUT
);

layer.setRoute(new Route(HttpMethod.ALL, "/"));
layer.setSuccessor(new TextContextHandeler((ctx, next) => 1));
layer.chainHandlers();
export default layer;
