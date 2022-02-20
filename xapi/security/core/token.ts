import { Authenticable, AuthenticableInterface } from "./authenticable.ts";

export interface UserTokenInterface<T extends AuthenticableInterface>{
    readonly user:T;
    readonly attributes:Set<string>;
    readonly context:string;
    has(attribute:string):boolean;
}

export interface SerializableToken{
    toJson():string;
}


export class UserToken<T extends AuthenticableInterface> implements UserTokenInterface<T> ,SerializableToken{
    readonly user: T;
    readonly attributes: Set<string>;
    readonly context: string;
    constructor({user,attributes=[],context="main"}:{
        user:T,attributes:string[],context:string
    }){
        this.user = user;
        this.attributes = new Set<string>();
        this.context = context;
    }
    toJson(): string {
        return JSON.stringify({
            user: this.user,
            attributes:Array.from(this.attributes),
            context: this.context
        });
    }
    has(attribute: string): boolean {
        return this.attributes.has(attribute);
    }
    static fromJson<T extends AuthenticableInterface>(json:string):UserToken<T>|undefined{
        const jsonObject = JSON.parse(json);
        console.log("parsing",jsonObject);
        return new UserToken<T>({
            user:jsonObject.user as T,
            attributes:jsonObject.attributes as [],
            context: jsonObject.context as string
        })
    }
}
