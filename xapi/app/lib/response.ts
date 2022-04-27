import {XapiResponse} from "../deps.ts";
import type {Context} from "./context.ts";
import {TemplateParams} from "./template/render_engine.ts";
export class ContextResponse extends XapiResponse {
  #ctx: Context;
  get ctx(): Context {
    return this.#ctx;
  }

  constructor(context: Context) {
    super(context.event);
    this.#ctx = context;
  }

  async render(path: string, params: TemplateParams = {}) {
    const result = await this.#ctx.app.renderView(path, params);
    return await this.body(result).textHtml().ok().end();
  }
}
