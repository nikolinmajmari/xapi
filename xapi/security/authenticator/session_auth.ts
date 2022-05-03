import { FunctionHandler } from "../../app/lib/router.ts";
import { ContextInterface } from "../../app/mod.ts";
import {RequestSession, session as sessionExtractor} from "../../session/mod.ts";
import { Authenticable} from "../core/authenticable.ts";
import { SecurityContextInterface, UserSecurityCoreInterface } from "../core/context.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";
import { TokenStorageInterface } from "../core/token_storage.ts";
import { SessionTokenStorage } from "./session_token_storage.ts";

export class SessionAuth<T extends Authenticable>{
    #failurePath:string;
    #userFromJson:(obj:any)=>T;
    constructor(params:{failurePath:string,userFromJson:(obj:any)=>T}){
        this.#failurePath = params.failurePath;
        this.#userFromJson = params.userFromJson;
    }
    authMiddleware():FunctionHandler{
        return async (ctx,next)=>{
            try{
                const session = sessionExtractor(ctx);
                (ctx as SecurityContextInterface<T>).security = new SessionAuthContext(session!,this.#userFromJson);
                await authExtractor(ctx)?.initAuth();
                ctx.locals.user = authExtractor(ctx)?.getUser()
            }catch(e){
                console.log("auth could not be initiated because of ");
                console.log(e);
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
            await ctx.res.redirect(this.#failurePath);
        }
    }
    of(ctx:ContextInterface):UserSecurityCoreInterface<T> | undefined{
        return authExtractor(ctx);
    }
}

export const authExtractor = <T extends Authenticable>(ctx:ContextInterface)=>(ctx as SecurityContextInterface<T>).security;

export class SessionAuthContext<T extends Authenticable> implements UserSecurityCoreInterface<T>{
    #tokenStorage:TokenStorageInterface<T>;
    #token:UserTokenInterface<T>|undefined;
    #userFromJson:(obj:any)=>T;

    constructor(session:RequestSession,userFromJson:(obj:any)=>T){
        this.#tokenStorage = new SessionTokenStorage(session,"_security_main");
        this.#userFromJson = userFromJson;
    }

    async initAuth():Promise<void>{
        const savedToken =  await this.#tokenStorage.loadToken();
        if(savedToken!=undefined){
            const user = this.#userFromJson(savedToken?.user);
            this.#token =  new UserToken({user,attributes:Array.from(savedToken.attributes),context:"_security_main"});
        }
    }

    async destroy():Promise<void>{
        await this.#tokenStorage.clearToken();
        this.#token = undefined; 
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