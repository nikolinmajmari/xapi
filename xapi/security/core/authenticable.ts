export  interface AuthenticableInterface{
     readonly username:string;
}

export class Authenticable implements AuthenticableInterface{
    constructor(username:string){
        this.username = username;
    }
    readonly username: string;
}