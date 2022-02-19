import { HttpContextInterface } from "../../http/http.lib.ts";
import { Authenticable } from "../core/authenticable.ts";
import { SecurityContextInterface } from "../core/context.ts";
import { CredentialsExtractor, CredentialsExtractorFunction, CredentialsExtractorInterface, CredentialsValidatiorInterface, CredentialsValidator, CredentialsValidatorFunction, UserLoader } from "../core/credentials.ts";
import { JsonObject, SecurityMidlewareHandler } from "../core/types.ts";
import { ApiTokenSecurity } from "./api_token_security.ts";

export interface ApiAuthenticatorArguments<T extends Authenticable=Authenticable>{
    credentialsExtractor:CredentialsExtractorInterface|CredentialsExtractorFunction,
    tokenValidator:CredentialsValidatiorInterface|CredentialsValidatorFunction,
    userLoader: UserLoader<T>;
}


export default  class SecurityMiddlewareFactory{
    static createApiAuthenticator<T extends Authenticable=Authenticable>(
        params:ApiAuthenticatorArguments<T>
    ):SecurityMidlewareHandler{
        return (ctx:HttpContextInterface,next:Function)=>{
            try{
                let credentials:string|undefined;
                let validated:JsonObject|undefined;
                if( params.credentialsExtractor instanceof CredentialsExtractor){
                    credentials = params.credentialsExtractor.extract(ctx.request);
                }else{
                     credentials = (params.credentialsExtractor as CredentialsExtractorFunction)(ctx.request);
                }
                if(params.tokenValidator instanceof CredentialsValidator ){
                    validated = params.tokenValidator.validate(credentials);
                }else{
                    validated = (params.tokenValidator as CredentialsValidatorFunction)(credentials);
                }
                const user = params.userLoader(validated);
                (ctx as SecurityContextInterface).security = new ApiTokenSecurity<T>("main");
                (ctx as SecurityContextInterface).security.authenticate(user,["user"]);
                next();
            }catch(e){
                next();
            }
        }
    }
}