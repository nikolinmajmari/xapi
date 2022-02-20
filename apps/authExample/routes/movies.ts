import { Router } from "../../../xapi/framework.ts";
import { HttpContextInterface } from "../../../xapi/http/http.lib.ts";
import sessionAuthenticator,{auth} from "../../../xapi/security/authenticator/session_authenticator.ts";
import { InMemorySessionAdapter } from "../../../xapi/session/adapter.ts";
import createSession from "../../../xapi/session/session.ts";

const usersRouter = new Router();


usersRouter.use(createSession({
    secret: "secret",
    adapter: new InMemorySessionAdapter(),
    lifetime: 2000,
  }))
usersRouter.use((ctx,next)=>{
    console.log("called user router");
    next();
})

usersRouter.use(sessionAuthenticator());

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

export default usersRouter;