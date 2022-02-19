import Application from "../../xapi/app/application.ts";
import { HttpContextInterface } from "../../xapi/http/http.lib.ts";
import { BearerExtractor } from "../../xapi/security/authenticator/api_token_security.ts";
import SecurityMiddlewareFactory from "../../xapi/security/authenticator/factory.ts";
import { Authenticable } from "../../xapi/security/core/authenticable.ts";
const app = new Application();

app.use(SecurityMiddlewareFactory.createApiAuthenticator({
  credentialsExtractor:(req)=>{
    console.log("extracting header bearer");
    return "bearer";
  },
  tokenValidator:(token)=>{
    console.log("validating recived "+token);
    console.log("returning as object { token:"+token+"}");
    return {token:token??""};
  },
  userLoader:(credentials)=>{
    console.log("recived credentials ",credentials);
    console.log("returning user");
    return {username:"papa"} as Authenticable;
  
  }
}));
app.use((ctx: HttpContextInterface, next: Function) => {
  console.log("middleware called", ctx.request.url);
  next();
});

app.use((ctx: HttpContextInterface, _next: Function) => {
  ctx.response.send("hey boss");
});

app.listen(9000);
