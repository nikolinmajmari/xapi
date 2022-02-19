import { AuthenticableInterface } from "./authenticable.ts";
import { UserTokenInterface } from "./token.ts";

export interface TokenStorageInterface<T extends AuthenticableInterface>{
    hasher:HasherInterface;
    loadToken(hash:string):UserTokenInterface<T>;
    saveToken(token:UserTokenInterface<T>):void;
}


export interface HasherInterface{
    hash(hash:string):string;
}

