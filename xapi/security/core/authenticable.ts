
/**
 * Each class that represents an authenticable instance must have a username property 
 */
export  interface AuthenticableInterface{
      username:string;
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
    username: string;
}