import { ContextInterface } from "../../app/mod.ts";
import { AuthenticableInterface } from "./authenticable.ts";
import { UserTokenInterface } from "./token.ts";

/**
 * SecurityContextInterface,holds shared object accros middleware to authenticate a user request
 */
export interface SecurityContextInterface<T extends AuthenticableInterface> extends ContextInterface{
    security:UserSecurityCoreInterface<T>|undefined ;
}

/**
 * instance shared across middleware context that holds authentication information
 */
export interface UserSecurityCoreInterface<T extends AuthenticableInterface> {
    initAuth():Promise<void>;
    destroy():Promise<void>;
    getUser():T|undefined;
    authenticate(user:T,attributes?:string[]):void|Promise<void>;
    getToken():UserTokenInterface<T>|undefined;
    isAuthenticated():boolean|undefined;
}
