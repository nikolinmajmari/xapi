import { RequestSession } from "../../session/mod.ts";
import { AuthenticableInterface } from "../core/authenticable.ts";
import { UserToken, UserTokenInterface } from "../core/token.ts";
import { TokenStorageInterface } from "../core/token_storage.ts";

export class SessionTokenStorage<T extends AuthenticableInterface> implements TokenStorageInterface<T>{
    #session:RequestSession|undefined;
    #key:string;

    constructor(session:RequestSession,key:string){
        this.#session = session;
        this.#key = key;
    }

    async loadToken(): Promise<UserTokenInterface<T>|undefined> {
        const str = await this.#session?.get(this.#key);
        if(str==undefined|| str==null||str==""){
            return undefined;
        }
        return UserToken.fromJson<T>(str);
    }
    async saveToken(token: UserToken<T>): Promise<void> {
        const str = token.toJson();
        await this.#session?.set(this.#key,str);
        await this.#session?.flush();
    }

    async clearToken(){
        await this.#session?.clear(this.#key,true);
    }
}