
## Router

Routing library based on middleware architecture. If you are familiar with express , this is almost the same. You can use the default router class or you can extend it to your own to use it based on your purposes. 

Define an context of some type to be shared across middleweare functions 
```ts
interface Context{
   event: RequestEvent
}

```

Define a function type that you will use on your middleware architecture
```ts
type BaseFunctionHandler<C extends Context = Context> = (context: Context, next: () => void) => void;

```
Create and context handeler adapter so the library can call your function and pas to it next middleware function and routing context
Adapter implements ContextHandelerInterface so it can be chained and called from the library. 

```ts
export class ContextHandelerAdapter<
  C extends Context=Context,
  F extends Function = BaseFunctionHandler<Context>
> implements ContextHandlerInterface
{
  #handeler: F;
  #sucessor: ContextHandlerInterface | undefined;
  constructor(handeler: F) {
    this.#handeler = handeler;
  }
  handle(routingContext: RoutingContext<Context>): void {
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


```

Define the defaultAdaptorCreatorMethod as below and pass this method to router
so router can convert functions to ContextHandelerAdapterTypes
```ts
const defaultAdapterCreater = <Context, F extends Function>(item: F) =>
  new ContextHandelerAdapter<Context, F>(item);

```


Create your router class extending from XapiRouter and start using it for your amazing apps. 

```ts
export class Router<Context> extends XapiRouter<
  Context,
  BaseFunctionHandler<Context>,
  ContextHandelerAdapter<Context, BaseFunctionHandler<Context>>
> {
  constructor() {
    super(defaultAdapterCreater);
  }
}

```

Import your new router and start building up your app, it supports nesting and route params also, also regular expressions are supported as strings 
Router class defines some handy methods with multible overrides to make its usage easier

```ts
import {Router} from "xapi-router";
const router = new Router();
var inMemoryDatabase: { id: number; title: string; content: string }[] = [];
var ID = 0;

const createNote = (title: string, content: string) => {
  ID++;
  return {
    id: ID,
    title: title,
    content: content,
  };
};

router.get("/", function (ctx, next) {
   // handle get here
});

router.post("/new", function (ctx, next) {
  /// handle post here
});

router.get(
  "/:id(\\d)/edit",
  function (ctx, next) {
    // handle get here 
  },
);

router.get(
  "/:id(\\d)/:property(title|id|content)",
  function (ctx, next) {

  },
);

router.delete("/:id(\\d)/delete", [
  (ctx, next) => {
    // handle delete
  },
]);

export default router;

```

Once you create a router you can call its handle method pass routing context to it and let the router call the 
function based on your parameters.
MyContext is some class that implements Context interface defined upper , these are your choice 
routing context also needs an url and an http method. 
During routing params are stored on routing context. You can modify handle method on routing context adapter in order to 
pass these parameters to the context object so the function can access them
```ts
import {RoutingContext} from "xapi-router";
const routingContext = new RoutingContext<Context>(new MyContext(),new URL("http://localhost/home/1/new"),HttpMethod.POST);
```

let the library decide who are the handelers to handle this RoutingContext. Before handeling the context you need to build up
the graph of functions in middleware,
this needs to be done only once and for the top most level router, 
then you can handle as many contexes as you want.
```ts
  router.setRoute();
  router.setSuccessor(
    new ContextHandelerAdapter((ctx, next) => {
       // console.log("route not found");
    })
  );

router.handle(routingContext);
router.handle(routingContext);
router.handle(routingContext);

```

Check for more information the file on main github repo path  /xapi/app/application.ts 
 
