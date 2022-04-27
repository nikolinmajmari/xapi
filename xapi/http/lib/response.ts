import {XapiResponseInterface} from "./http.d.ts";
import {MultipartWriter} from "https://deno.land/std/mime/mod.ts";
import {Buffer} from "https://deno.land/std@0.133.0/io/buffer.ts";

/**
 *  XapiResponse wraps Deno.event. Is used to construct a [Response] and sent it through deno.Event
 * @member event The deno.Event instance that triggered the request
 * @member response The init data used to initialize the response.
 */
export class XapiResponse {
  readonly #event: Deno.RequestEvent;
  #sent: boolean;
  protected response: XapiResponseInit;
  constructor(event: Deno.RequestEvent) {
    this.#event = event;
    this.#sent = false;
    this.response = new XapiResponseInit();
  }

  /**
   * Access response initlaization
   * ```ts
   * const res = new XapiResponse();
   * res.init.body;
   *
   * ```
   */
  get init() {
    return this.response;
  }

  /**
   *
   * @param status
   * @returns
   */
  status(
    status: number,
    statusText: string | undefined = this.response.statusText
  ) {
    this.response.status = status;
    this.response.statusText = statusText;
    return this;
  }

  /**
   *
   * @param headers
   * @returns
   */
  headers(headers: {[key: string]: string}) {
    for (const key in headers) {
      this.response.headers?.append(key, headers[key]);
    }
    return this;
  }

  /**
   * headers update methods
   */
  applicationJavascript() {
    this.response.headers?.append("Content-type", "application/javascript");
    return this;
  }

  applicationPdf() {
    this.response.headers?.append("Content-type", "application/pdf");
    return this;
  }

  applicationJson() {
    this.response.headers?.append("Content-Type", "application/json");
    return this;
  }

  textHtml() {
    this.response.headers?.append("Content-type", "text/html");
    return this;
  }

  textCss() {
    this.response.headers?.append("Content-type", "text/css");
    return this;
  }

  imageGif() {
    this.response.headers?.append("Content-type", "image/gif");
    return this;
  }

  imageJPEG() {
    this.response.headers?.append("Content-type", "image/jpeg");
    return this;
  }

  location(url: string) {
    this.response.headers?.append("Location", url);
    return this;
  }

  /**
   *
   * @param body
   * @returns
   */
  body(body: BodyInit) {
    this.response.body = body;
    return this;
  }

  /**
   *
   * @param text
   * @returns
   */
  statusText(text: string) {
    this.response.statusText = text;
    return this;
  }

  /**
   *
   */
  protected async sentResponse() {
    if (this.#sent == false) {
      this.#sent = true;
      await this.#event.respondWith(
        new Response(this.response.body, {
          headers: this.response.headers,
          status: this.response.status,
          statusText: this.response.statusText,
        })
      );
    } else {
      throw "Response already sented";
    }
  }

  /**
   * end the response and sent it. After you call end you can not sent any response
   */
  async end(): Promise<void> {
    return await this.sentResponse();
  }

  /**
   * Endable
   * @param content
   */
  async sent(
    body: BodyInit | null | undefined = this.response.body,
    init: ResponseInit = {}
  ): Promise<void> {
    if (this.#sent) {
      throw "Response is already sent";
    }
    await this.#event.respondWith(
      new Response(body, {
        headers: this.response.headers,
        status: this.response.status,
        statusText: this.response.statusText,
        ...init,
      })
    );
    this.#sent = true;
  }

  /**
   *
   * @param url
   */
  async redirect(url: string): Promise<void> {
    await this.found().location(url).sentResponse();
  }

  /**
   *
   * @param content Json ttype
   */
  async json(content: {}): Promise<void> {
    await this.ok()
      .applicationJson()
      .body(JSON.stringify(content))
      .sentResponse();
  }

  /**
   *
   */
  async text(content: string): Promise<void> {
    this.ok();
    await this.#event.respondWith(new Response(content, this.response));
  }

  async html(content: string): Promise<void> {
    await this.ok().textHtml().text(content);
  }

  /**
   * set http status codes
   */
  ok() {
    this.response.status = 200;
    this.response.statusText = "success";
    return this;
  }

  created() {
    this.response.status = 201;
    this.response.statusText = "created";
    return this;
  }

  accepted() {
    this.response.status = 202;
    this.response.statusText = "accepted";
    return this;
  }

  movedPermanently() {
    this.response.status = 301;
    this.response.statusText = "Moved Permanently";
    return this;
  }

  found() {
    this.response.status = 302;
    this.response.statusText = "Found";
    return this;
  }

  seeOther() {
    this.response.status = 303;
    this.response.statusText = "See Other";
    return this;
  }

  notModified() {
    this.response.status = 304;
    this.response.statusText = "Moved Permanently";
    return this;
  }

  badRequest() {
    this.response.status = 400;
    this.response.statusText = "Bad Request";
    return this;
  }

  unauthorized() {
    this.response.status = 401;
    this.response.statusText = "Unauthorized";
    return this;
  }

  forbidden() {
    this.response.status = 403;
    this.response.statusText = "Forbidden";
    return this;
  }

  notFound() {
    this.response.status = 404;
    this.response.statusText = "Not Found";
    return this;
  }

  methodNotAllowed() {
    this.response.status = 405;
    this.response.statusText = "Method Not Allowed";
    return this;
  }

  notAcceptable() {
    this.response.status = 406;
    this.response.statusText = "Not Acceptable";
    return this;
  }

  requestTimeout() {
    this.response.status = 408;
    this.response.statusText = "Request Timeout";
    return this;
  }

  conflict() {
    this.response.status = 409;
    this.response.statusText = "Conflict";
    return this;
  }

  gone() {
    this.response.status = 410;
    this.response.statusText = "Gone";
    return this;
  }

  lengthRequired() {
    this.response.status = 411;
    this.response.statusText = "Length Required";
    return this;
  }

  payloadTooLarge() {
    this.response.status = 413;
    this.response.statusText = "Payload Too Large";
    return this;
  }

  ineralServerError() {
    this.response.status = 500;
    this.response.statusText = "Ineral Server Error";
    return this;
  }

  serverUnavailable() {
    this.response.status = 503;
    this.response.statusText = "Service Unavailable";
    return this;
  }
}

class XapiResponseInit implements ResponseInit {
  headers?: Headers;
  status?: number | undefined;
  statusText?: string | undefined;
  body: BodyInit | null | undefined;
  constructor() {
    this.headers = new Headers();
    this.status = 200;
    this.statusText = "success";
    this.body = null;
  }
}
