import { HttpRequest } from "../../http/http.lib.ts";
import { Authenticable, AuthenticableInterface } from "../core/authenticable.ts";
import { UserSecurityCoreInterface } from "../core/context.ts";
import { CredentialsExtractor, CredentialsExtractorFunction, CredentialsExtractorInterface, CredentialsValidatiorInterface, CredentialsValidatorFunction, UserLoader } from "../core/credentials.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";


export class BearerExtractor extends CredentialsExtractor{
    constructor(){
        super((request: HttpRequest): string|undefined =>{
            if(request.headers.has("Authorization")){
                const header = request.headers.get("Authorization");
                if (header?.startsWith("Bearer ")){
                   return header.substring(7, header.length);
               } 
            }
        });
    }  
}

export class StatelessAuth<T extends AuthenticableInterface> implements UserSecurityCoreInterface<T>{
    #token?:UserTokenInterface<T>;
    #context:string="main";

    constructor(context:string){
        this.#context = context
    }
    isAuthenticated(): boolean {
        return this.#token!=null && this.#token != undefined;
    }

    getUser(): T|undefined {
        return this.#token?.user;
    }
    getToken(): UserTokenInterface<T>|undefined {
        return this.#token;
    }
    authenticate(user: AuthenticableInterface,attributes?: string[]): void {
      this.#token = new UserToken<T>({
          attributes:attributes??[],
          user:user as T,
          context:this.#context
      })
    }    
}

export interface ApiAuthenticatorArguments<T extends Authenticable=Authenticable>{
    credentialsExtractor:CredentialsExtractorInterface|CredentialsExtractorFunction,
    tokenValidator:CredentialsValidatiorInterface|CredentialsValidatorFunction,
    userLoader: UserLoader<T>;
}