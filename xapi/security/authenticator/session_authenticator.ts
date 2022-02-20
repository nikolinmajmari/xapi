import { HttpContextInterface } from "../../http/http.lib.ts";
import { SessionContextInterface, SessionInterface } from "../../session/session.ts";
import { Authenticable, AuthenticableInterface } from "../core/authenticable.ts";
import { SecurityContextInterface, UserSecurityCoreInterface } from "../core/context.ts";
import { CredentialsExtractor, CredentialsExtractorFunction, CredentialsExtractorInterface, CredentialsValidatiorInterface, CredentialsValidator, CredentialsValidatorFunction, UserLoader } from "../core/credentials.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";
import { TokenStorageInterface } from "../core/token_storage.ts";
import { JsonObject } from "../core/types.ts";
import { StatefullAuth } from "./statefull.ts";
import { StatelessAuth } from "./stateless.ts";

export interface SessionAuthenticatorArguments<T extends Authenticable=Authenticable>{
    userLoader: UserLoader<T>;
}

const sessionExtractor =  function (ctx:HttpContextInterface):SessionInterface|undefined{
    if((ctx as SessionContextInterface).session!=undefined){
        return (ctx as SessionContextInterface).session;
    }
    return ;
}

export class SessionTokenStorage<T extends AuthenticableInterface> implements TokenStorageInterface<T>{
    session:SessionInterface;
    key:string;
    constructor(key:string,session:SessionInterface){
        this.session = session;
        this.key = key;
    }
    saveToken(token: UserTokenInterface<T>): void {
        this.session.set(this.key,JSON.stringify(token));
    }

    loadToken():UserToken<T>|undefined{
        const stringToken = this.session.get(this.key);
        console.log("old saved token");
        console.log(stringToken as string);
        if( typeof stringToken == "string"){
            return UserToken.fromJson<T>(stringToken);
        }
    }
}


export default function sessionAuthenticator<T extends Authenticable=Authenticable>(
    params:SessionAuthenticatorArguments<T>={
        userLoader:(old)=>{return (old as unknown) as T;}
    }
){
    return (ctx:HttpContextInterface,next:Function)=>{
        const key = "main";
        try{
            const session = sessionExtractor(ctx);
            if(session!=undefined){
                const storage = new SessionTokenStorage<T>(`_security_${key}_token`,session);
                (ctx as SecurityContextInterface).security = new StatefullAuth<T>(key,storage);
                const oldToken = storage.loadToken();
                console.log("middleware");
                console.log(oldToken);
                if(oldToken!=null){
                    (ctx as SecurityContextInterface).security?.authenticate(oldToken.user,["user"]);
                    console.log((ctx as SecurityContextInterface).security);
                }
            }
        }catch(e){
            console.log(e);
        }
        next();
    }
}

export function auth<T extends AuthenticableInterface=AuthenticableInterface>(ctx:HttpContextInterface){
    return ((ctx as SecurityContextInterface).security) as UserSecurityCoreInterface<T>;
}