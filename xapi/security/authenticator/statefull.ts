import { SessionInterface } from "../../session/session.ts";
import { Authenticable, AuthenticableInterface } from "../core/authenticable.ts";
import { UserSecurityCoreInterface } from "../core/context.ts";
import { UserLoader } from "../core/credentials.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";
import { TokenStorageInterface } from "../core/token_storage.ts";
import { JsonObject } from "../core/types.ts";


export class StatefullAuth<T extends Authenticable> implements UserSecurityCoreInterface<T>{
    #token?:UserTokenInterface<T>;
    #context:string="main";
    #storage: TokenStorageInterface<T>; // here we save 

    constructor(context:string,storage:TokenStorageInterface<T>){
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
      this.#storage.saveToken(this.#token);
    }    
}
