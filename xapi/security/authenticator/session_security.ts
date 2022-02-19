import { HttpRequest } from "../../http/http.lib.ts";
import { SessionInterface } from "../../session/session.ts";
import { AuthenticableInterface } from "../core/authenticable.ts";
import { UserSecurityCoreInterface } from "../core/context.ts";
import { CredentialsExtractor } from "../core/credentials.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";
import { JsonObject } from "../core/types.ts";




export class SessionSecurity<T extends AuthenticableInterface> implements UserSecurityCoreInterface<T>{
    #token?:UserTokenInterface<T>;
    #context:string="main";
    #storage: TokenStorage<T>;

    constructor(context:string,storage:TokenStorage<T>){
        this.#context = context;
        this.#storage = storage;
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
      });
    }    
}

export class TokenStorage<T extends AuthenticableInterface>{
    session:SessionInterface;
    key:string;
    constructor(key:string,session:SessionInterface){
        this.session = session;
        this.key = key;
    }
    storeToken(token:UserTokenInterface<T>):void{
        this.session.set(this.key,token.toString());
    }
    loadToken():JsonObject|undefined{
        const stringToken = this.session.get(this.key);
        return JSON.parse(stringToken??"") as JsonObject;
    }
}