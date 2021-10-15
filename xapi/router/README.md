
## Router

Minimum  routing lib. Can be used to handle routing of requests using middleware architecture. Handelers are functions which are wrapped into FunctionHandeler objects which are then used by internal library to handle routing. 

# Example
Router implements router interface which overloads get, post, put, patch, delete and use methods. Check interface for api. 
```ts
import { Router } from "../../../xapi/router/router.ts";
import { HttpContextInterface } from "../../../xapi/http/http.lib.ts";
const router = new Router();

router.get("/", function (ctx: HttpContextInterface, next: Function) {
 // implement handler
 // call  next() for the next middleware 
});

router.use(function(ctx:HttpContextInterface,next:Function){
  // implement handler
});

router.post("/new", function (ctx: HttpContextInterface, next: Function) {
  // implement handler 
});

```
check the RouterInterface for more information on what router class methods offers (https://github.com/nikolinmajmari/xapi/blob/main/xapi/router/router.ts)

# Adapters 
You can create your own adapters to decide how handelers are invoked by the routing component. The adapter class implements ContextHandlerInterface<HttpContextInterface>
  from the router.lib.ts library. This interface defines two methods handler(ctx:ContextHandlerInterface<HttpContextInterface>) and setSuccessor(ContextHandlerInterface<HttpContextInterface>) which sets the next successor to be called in the middleware. Below is the base class that implements this interface which can be used from the ROuter class. 
  
 ```ts
 export class RoutingContextHandlerAdapter
  implements ContextHandlerInterface<HttpContextInterface> {
  protected successor?: ContextHandlerInterface<HttpContextInterface>;
  protected handler: Function;
  constructor(handler: Function) {
    this.handler = handler;
  }

  handle(context: HttpContextInterface): void {
    // choose your own apo to call the handler 
    this.handler(context, () => this.invokeSuccessor(context));
  }
  setSuccessor(successor: ContextHandlerInterface<HttpContextInterface>): void {
    this.successor = successor;
  }
  // method that calls successor 
  invokeSuccessor(context: HttpContextInterface) {
    if (this.successor) {
      this.successor.handle(context);
    }
  }
} 
  ```
  
  6  
  
