import { AuthenticableInterface } from "./authenticable.ts";
import { UserTokenInterface } from "./token.ts";

export interface TokenStorageInterface<T extends AuthenticableInterface>{
    loadToken(hash:string):UserTokenInterface<T>|undefined;
    saveToken(token:UserTokenInterface<T>):void;
}

export interface HashStorageInterface{
    hasher:HasherInterface;
}


export class TokenLoader<T extends AuthenticableInterface> implements TokenStorageInterface<T>{
     #loader:(hash:string)=>UserTokenInterface<T>;
     #saver:(token: UserTokenInterface<T>)=>void;
    constructor(loader:(hash:string)=>UserTokenInterface<T>,saver:(token:UserTokenInterface<T>)=>void){
        this.#loader = loader;
        this.#saver = saver;
    }
    loadToken(hash: string): UserTokenInterface<T>{
        return this.#loader(hash);
    }
    saveToken(token: UserTokenInterface<T>): void {
        return this.#saver(token);
    }
}


export interface HasherInterface{
    hash(hash:string):string;
}

