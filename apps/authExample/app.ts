import Application from "../../xapi/app/application.ts";
import { HttpContextInterface } from "../../xapi/http/http.lib.ts";
import apiAuthenticator from "../../xapi/security/authenticator/api_authenticator.ts";
import { Authenticable } from "../../xapi/security/core/authenticable.ts";
const app = new Application();

/**
 * app.use(apiAuthenticator({
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
 */
app.use((ctx: HttpContextInterface, next: Function) => {
  console.log("middleware called", ctx.request.url);
  next();
});
import moviesRouter  from "./routes/movies.ts";
app.use("/movies",moviesRouter);
app.use((ctx,next)=>{
  console.log(ctx.request.url);
  next();
})

app.use((ctx: HttpContextInterface, _next: Function) => {
  ctx.response.send("hey boss");
});

app.listen(9000);
