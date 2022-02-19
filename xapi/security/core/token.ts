import { Authenticable } from "./authenticable.ts";

export interface UserTokenInterface<T extends Authenticable>{
    readonly user:T;
    readonly attributes:Set<string>;
    readonly context:string;
    has(attribute:string):boolean;
}


export class UserToken<T extends Authenticable> implements UserTokenInterface<T>{
    readonly user: T;
    readonly attributes: Set<string>;
    readonly context: string;
    constructor({user,attributes=[],context="main"}:{
        user:T,attributes:string[],context:string
    }){
        this.user = user;
        this.attributes = new Set<string>(attributes);
        this.context = context;
    }
    has(attribute: string): boolean {
        return this.attributes.has(attribute);
    }
}