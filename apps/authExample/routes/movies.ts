import { Router } from "../../../xapi/framework.ts";
import { HttpContextInterface } from "../../../xapi/http/http.lib.ts";
import SecurityMiddlewareFactory from "../../../xapi/security/authenticator/factory.ts";

const usersRouter = new Router();

usersRouter.use(SecurityMiddlewareFactory.createSessionAuthenticator({
    
}));

usersRouter.get("/",(ctx,next)=>{
    
});

usersRouter.post("/",(ctx,next)=>{
    
});