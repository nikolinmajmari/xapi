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
}
