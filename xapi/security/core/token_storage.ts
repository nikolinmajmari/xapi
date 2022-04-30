import { AuthenticableInterface } from "./authenticable.ts";
import { UserTokenInterface } from "./token.ts";

export interface TokenStorageInterface<T extends AuthenticableInterface>{
    loadToken():UserTokenInterface<T>|undefined|Promise<UserTokenInterface<T>|undefined>;
    saveToken(token:UserTokenInterface<T>):void|Promise<void>;
}

