import {HttpConstants, XapiResponse} from "../deps.ts";
import type {Context} from "./context.ts";
import {TemplateParams} from "./template/render_engine.ts";
import ineralServerErrorPageHtml from "./views/ineral_server_error.js";
import notFoundErrorPageHtml from "./views/not_found_error.js";
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
    return await this.setBody(result)
                     .contentTypeTextHtml()
                     .setStatus(HttpConstants.httpStatusOk)
                     .sent();
  }

  async ineralServerError(): Promise<void> {
    return await this.setStatus(HttpConstants.httpStatusIntealServerError)
      .contentTypeTextHtml()
      .setBody(ineralServerErrorPageHtml)
      .sent();
  }

  async notFound(): Promise<void> {
    return await this.setStatus(HttpConstants.httpStatusNotFound)
      .contentTypeTextHtml()
      .setBody(notFoundErrorPageHtml)
      .sent();
  }

  async forbidden(): Promise<void> {
    return await this.setStatus(HttpConstants.httpStatusForbidden).redirect("/");
  }

  async badRequest():Promise<void>{
    return await this.setStatus(HttpConstants.httpStatusBadRequest).setBody("").sent();
  }

  async unAuthorized(): Promise<void> {
    return await this.setStatus(HttpConstants.httpStatusUnauthorized).redirect("/login");
  }
}
