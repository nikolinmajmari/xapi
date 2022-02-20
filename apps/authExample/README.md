
## Authentication Example

Simple example of session authentication middleware using routing library 

# Example
import the nessesary libraries and create a new Router

```ts
import { Router } from "../../../xapi/framework.ts";
import { HttpContextInterface } from "../../../xapi/http/http.lib.ts";
import sessionAuthenticator,{auth} from "../../../xapi/security/authenticator/session_authenticator.ts";
import { InMemorySessionAdapter } from "../../../xapi/session/adapter.ts";
import createSession from "../../../xapi/session/session.ts";
const usersRouter = new Router();
```

add the session middleware so session authentication can use the session

```ts
usersRouter.use(createSession({
    secret: "secret",
    adapter: new InMemorySessionAdapter(),
    lifetime: 2000,
  }))
```
the adapter argument is used to save and retrive values, we use in memory adapter to save our session into program heap adress space. 
then create the session authentication middleware

```ts
usersRouter.use(sessionAuthenticator());
```

You can then use the security property injected on context to authenticate 
your user or to get current authenticated user, you can either cast ctx
object to type UserSecurityCoreInterface or you can use the prebuild auth() function which will return security object for you as below 

```ts
usersRouter.get("/",(ctx,next)=>{
   const user =  auth(ctx).getUser();
   ctx.response.send(JSON.stringify(user??[]))
});

usersRouter.get("/auth",(ctx,next)=>{
    auth(ctx).authenticate({
        username:"admin"
    },["user"]);
    ctx.response.send(JSON.stringify("authenticated"))
});
```
Then add the usersRouter into your main app and test it.
