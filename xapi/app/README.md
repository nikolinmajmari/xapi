Xapi-app package

This package makes usage of [xapi-router]() and [xapi-http]() to offer simple ways to build an http server. Below we show the utilities offered by this server. 

### Hello World

To create a server use the Application class as below. 

```ts
import {Application} from "./deps.ts";
....
const app = new Application();
....

app.listen(8000);

```
If we run this app nothing will happen. We need to register handlers in order to handle requests. Application class extends Router therefore it implements Router Interface. We can add the handlers directly from our application as below. 

```ts
/// simple logger 
app.use(async (ctx,next)=>{
    const start = Date.now();
    await next();
    console.log("request on ",start," took ",Date.now()-start);
});

app.get((async ctx,next)=>{
    await ctx.res.json({
        "stats":"Hello world"
    });
});

app.listen(8000);

```
### Routing
Ths package exports a Router class which defines five methods. 
- ```get```   Used to register handlers **GET** http method 
- `post` Used to register handlers **POST** http method 
- `put` Used to register handlers **PUT** http method 
- `patch` Used to register handlers **PATCH** http method 
- `delete` Used to register handlers **DELETE** http method 
- `use` Used to register handlers that are allways called regardles of http method

As aditional arguments to handlers these router methods also take a string pattern which is used to route requests 

```ts
const router = new Router();
router.use("/login",async (ctx,next)=>{
    await ctx.res.render("./login.html");
});

 ```
You can also put a regular expression as pattern detector. Just it has to be as a string on brackets as below

```ts
const router = new Router();
router.use("/(login|signup|smthelse|\\d+)",async (ctx,next)=>{
    await ctx.res.render("./login.html");
});

 ```

Router class supports nesting between routers therefore you can nest multible routers within each other. Middleware functions are called in order. All handlers are skiped if top level url part does not match. 

Using : you can define params on url and access them through context object. 
```ts
router.use("/:id(\\d+)",async (ctx,next)=>{
    const id = ctx.req.params.id;
    ///
})
```

Check the documentation for more info about Router Api. 

### Context

The context is the shared object acrooss the middleware functions. It offers three properties accessable for the handlers .

- ``req`` This is the `ContextRequest` instance which holds requet information. Also has some handy methods for parsing request body. Request params can be accessed here. 

- `res` This is response object that is sent to the client. We define some handy methods that can be used to encapsulate some of the details of response sent. 

- `attribs` This property can be used to pass parameters from previous middleware to next one. This can be used when some of the route params need to be resolved on objects on edit put or delete urls. If object is not found an http 404 response might be sent. 

If you want to share another property across context just inject it and access it through any middleware. Check xapi-session to see how it is done. 
You can also use attribs property.


Thanks For reading. 