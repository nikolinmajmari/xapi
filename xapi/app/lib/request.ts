import {XapiRequest} from "../deps.ts";
import type {Context} from "./context.ts";

/**
 * Request implementation which includes the template rendering
 */
export class ContextRequest extends XapiRequest {
  #ctx: Context;
  get ctx(): Context {
    return this.#ctx;
  }
  constructor(ctx: Context) {
    super(ctx.event.request);
    this.#ctx = ctx;
  }

  get isJson():boolean{
    return this.headers.get("Content-type")=="application/json";
  }
  get isApplicationFormUrlEncoded():boolean{
    return this.headers.get("Content-type")=="application/x-www-form-urlencoded"; 
  }
}
