export  interface AuthenticableInterface{
     readonly username:string;
}

export interface SerializableAuthenticable{
    toJson():string;
}

/**
 * an object being able to authenticate based on recived credentials
 */
export class Authenticable implements AuthenticableInterface{ 
    constructor(username:string){
        this.username = username;
    }
    readonly username: string;
}