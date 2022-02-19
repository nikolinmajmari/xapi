import { HttpRequest } from "../../http/http.lib.ts";
import { Authenticable } from "./authenticable.ts";
import { JsonObject } from "./types.ts";

export type UserLoader<T extends Authenticable> = (credentials:JsonObject)=>T;
export type UserSerializer<T extends Authenticable> = (user:T)=>string;


export type CredentialsExtractorFunction = (ctx:HttpRequest)=>string|undefined;
export interface CredentialsExtractorInterface{
    extract(ctx:HttpRequest):string|undefined;
}

export type CredentialsValidatorFunction = (credentials:string|undefined)=>JsonObject;

export interface CredentialsValidatiorInterface {
    validate(credentials:string|undefined):JsonObject;
}

export class CredentialsValidator implements CredentialsValidatiorInterface{
    constructor(private validator:CredentialsValidatorFunction){}
    validate(credentials: string|undefined): JsonObject {
        return this.validator(credentials);
    }
}

export class CredentialsExtractor implements CredentialsExtractorInterface{
    constructor(private extractor:CredentialsExtractorFunction){}
    extract(ctx: HttpRequest): string|undefined {
        return this.extractor(ctx);
    }
}

export interface JWTGeneratorInterface{
    generate(plain:JsonObject):string;
    parse(encoded:string):JsonObject;
}