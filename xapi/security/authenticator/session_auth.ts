import { FunctionHandler } from "../../app/lib/router.ts";
import { ContextInterface } from "../../app/mod.ts";
import {RequestSession, session as sessionExtractor} from "../../session/mod.ts";
import { Authenticable} from "../core/authenticable.ts";
import { SecurityContextInterface, UserSecurityCoreInterface } from "../core/context.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";
import { TokenStorageInterface } from "../core/token_storage.ts";
import { SessionTokenStorage } from "./session_token_storage.ts";

export class SessionAuth<T extends Authenticable>{
    authMiddleware():FunctionHandler{
        return async (ctx,next)=>{
            try{
                const session = sessionExtractor(ctx);
                (ctx as SecurityContextInterface<T>).security = new SessionAuthContext(session!);
                await authExtractor(ctx)?.initAuth();
            }catch(e){
                console.log("auth could not be initiated because of ",e.toString());
            }
            await next();
        };
    }
    eject(ctx:ContextInterface):UserSecurityCoreInterface<T>|undefined{
        return authExtractor<T>(ctx);
    }
    ensureAuthenticated():FunctionHandler{
        return async (ctx,next)=>{
            if(this.eject(ctx)?.isAuthenticated()==true){
                return await next();
            }
            await ctx.res.redirect("/auth/login");
        }
    }
}

export const authExtractor = <T extends Authenticable>(ctx:ContextInterface)=>(ctx as SecurityContextInterface<T>).security;

export class SessionAuthContext<T extends Authenticable> implements UserSecurityCoreInterface<T>{
    #tokenStorage:TokenStorageInterface<T>;
    #token:UserTokenInterface<T>|undefined;

    constructor(session:RequestSession){
        this.#tokenStorage = new SessionTokenStorage(session,"_security_main");
    }

    async initAuth():Promise<void>{
        this.#token = await this.#tokenStorage.loadToken();
    }

    getUser(): T|undefined {
        return this.#token?.user;
    }
    getToken(): UserTokenInterface<T>|undefined {
        return this.#token;
    }
    isAuthenticated(): boolean|undefined {
        return this.#token!=undefined ;
    }
    async authenticate(user: T,attributes?: string[]): Promise<void> {
        this.#token =  new UserToken({user,attributes:attributes??[],context:"_security_main"})
        await this.#tokenStorage.saveToken(this.#token!);
    }
}