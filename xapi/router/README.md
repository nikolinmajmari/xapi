## Router

Routing library based on middleware architecture. If you are familiar with express , this is almost the same. You can use the default router class or you can extend it to your own to use it based on your purposes.

Check the below example on how you can use the library

create a file `router.ts`

```ts
import {RoutingContext} from "https://deno.land/x/xapi_router@v0.0.1/mod.ts";
import type {ContextHandlerInterface} from "https://deno.land/x/xapi_router@v0.0.1/mod.ts";
import {XapiRouter} from "https://deno.land/x/xapi_router@v0.0.1/mod.ts";

/**
 * The shared information accross the middleware functions
 */
export class Context {
  readonly event: Deno.RequestEvent;
  params: {};
  constructor(event: Deno.RequestEvent) {
    this.event = event;
    this.params = {};
  }
}

/**
 * the middleware function type that the router will accept
 */
type BaseFunctionHandler = (context: Context, next: () => void) => void;

/**
 * this adapter is used to wrap functions to context handeler adapter instances
 * these instance implement context handler interface and therefore
 * can be called and chained by router for the routing graph
 * @param item Default middleware function type router accepts
 * @returns
 */
const defaultAdapterCreater = (item: BaseFunctionHandler) =>
  new ContextHandelerAdapter(item);

/**
 * The wrapper of the functions, this class is needed so the router can call your function
 * Using this adapter you can decide your own way how functions are called
 * also gives you posibility to decide any function type you want to use in the router
 */
export class ContextHandelerAdapter implements ContextHandlerInterface {
  #handeler: BaseFunctionHandler;
  #sucessor: ContextHandlerInterface | undefined;
  constructor(handeler: BaseFunctionHandler) {
    this.#handeler = handeler;
  }
  handle(routingContext: RoutingContext<Context>): void {
    routingContext.context.params = routingContext.params;
    this.#handeler(routingContext.context, () =>
      this.invokeSucessor(routingContext)
    );
  }
  setSuccessor(successor: ContextHandlerInterface): void {
    this.#sucessor = successor;
  }
  invokeSucessor(routingContext: RoutingContext<Context>) {
    if (this.#sucessor != undefined) {
      this.#sucessor?.handle(routingContext);
    } else {
      throw "sucessor not found for this middleware on " + this;
    }
  }
}

/**
 * This method creates a routing context from shared context
 * The routing library knows only about shared context
 * you need to handle communication between contexes by your self
 * this is done to separate concerns and make library independed
 * @param ctx The shared context
 * @returns
 */
export function createRoutingContext(ctx: Context) {
  let method;
  switch (ctx.event.request.method) {
    case "get":
    case "Get":
    case "GET":
      method = HttpMethod.GET;
      break;
    case "post":
    case "Post":
    case "POST":
      method = HttpMethod.POST;
      break;
    case "put":
    case "PUT":
    case "Put":
      method = HttpMethod.PUT;
      break;
    case "Patch":
    case "patch":
    case "PATCH":
      method = HttpMethod.PATCH;
      break;
    case "delete":
    case "DELETE":
    case "Delete":
      method = HttpMethod.DELETE;
      break;
    default:
      throw "Unknown http method";
  }
  let url = new URL(ctx.event.request.url);
  return new RoutingContext<Context>(ctx, url, method);
}

/**
 *  XapiRouter class is the base class of the library
 *  the first  generic argument of the library is the shared context type accross functions
 * the second is the middleware function type you are going to use on the router
 * the third is the adapter class we defined upper
 * xapirouter needs the adapter creator function on its constructor we invoke using supper argument
 */
export default class Router extends XapiRouter<
  Context,
  BaseFunctionHandler,
  ContextHandelerAdapter
> {
  constructor() {
    super(defaultAdapterCreater);
  }

  /**
   * This is used to set the end function of the middleware
   * should be called to compleete the middleware grapht
   * @param handler Function
   */
  protected completeMiddlewareWith(handler: BaseFunctionHandler) {
    this.handler.setRoute();
    this.handler.setSuccessor(super.createAdaptor(handler));
    this.handler.chainHandlers();
  }
}
```

create another file on same dir `app.ts` where you will define the top level router which will act like a single application

```ts
import Router, {createRoutingContext, Context} from "./router.ts";

export default class Application extends Router {
  private port?: number;
  constructor() {
    super();
  }

  async listen(port?: number): Promise<void> {
    super.completeMiddlewareWith((ctx, next) => {
      ctx.respondWith(new Response("not found"));
    });
    const server = Deno.listen({port: port ?? 8000});
    for await (const conn of server) {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        this.handler.handle(createRoutingContext(new Context(requestEvent)));
      }
    }
  }
}
```

Then create a file main.ts and import the Application class and Router class

`main.ts`

```ts
import Router, {Context} from "./router.ts";
import App from "./app.ts";

const mainRouter = new App();
const userRouter = new Router();
userRouter.get("/:id(\\d)", (ctx, next) => {
  ctx.event.respondWith(new Response("some user with id" + ctx.params.id));
});
userRouter.get(
  "/:id(\\d)/:property(username|email|name|surname)",
  (ctx, next) => {
    const user = {
      id: ctx.params.id,
      username: "username",
      password: "password",
      name: "name",
      surname: "surname",
      email: "email",
    };
    ctx.event.respondWith(new Response(user[ctx.params.property]));
  }
);
userRouter.post("/", [
  (ctx, next) => {
    /// validate body
    $valid = false;
    if (!$valid) {
      ctx.event.respondWith(new Response("error"));
    } else {
      next();
    }
  },
  (ctx, next) => {
    /// save user to db
    ctx.event.respondWith(new Response("success"));
  },
]);
mainRouter.use((ctx: Context, next: () => void) => {
  console.log("request got");
  next();
});
mainRouter.use(usersRouter);

//// set your error handler

mainRouter.use((ctx, next) => {
  ctx.respondWith(new Response("not found"));
});

app.listen(8000);
```

Check for more information the file on main github repo path /xapi/app/application.ts
