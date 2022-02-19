import { SecurityContextInterface } from "./context.ts";

export type JsonObject = {[key:string|number]:JsonObject|string|number};
export type SecurityMidlewareHandler = (ctx:SecurityContextInterface,next:()=>void)=>void;