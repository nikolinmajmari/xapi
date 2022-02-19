import { HttpContextInterface } from "../../http/http.lib.ts";
import { AuthenticableInterface } from "./authenticable.ts";
import { UserTokenInterface } from "./token.ts";

/**
 * SecurityContextInterface,holds shared object accros middleware to authenticate a user request
 */
export interface SecurityContextInterface extends HttpContextInterface{
    security:SecurityCoreInterface;
}

export interface SecurityCoreInterface{
    authenticate(user:AuthenticableInterface,attributes?:string[]):void;
}

export interface UserSecurityCoreInterface<T extends AuthenticableInterface> extends SecurityCoreInterface{
    getUser():T|undefined;
    getToken():UserTokenInterface<T>|undefined;
    isAuthenticated():boolean|undefined;
}
