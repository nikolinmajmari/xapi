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
   * set status of the response
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
   * set headers of the response
   * @param headers
   * @returns
   */
  headers(headers: {[key: string]: any}) {
    for (const key in headers) {
      this.response.headers?.append(key, headers[key]);
    }
    return this;
  }

  /**
   * Set body of the response
   * @param body
   * @returns
   */
  body(body: BodyInit) {
    this.response.body = body;
    return this;
  }

  /**
   * set statustext of the response
   * @param text
   * @returns
   */
  statusText(text: string) {
    this.response.statusText = text;
    return this;
  }

  /**
   * set content type to "application/javascript"
   * @returns this
   */
  contentTypeApplJS() {
    this.response.headers?.append("Content-type", "application/javascript");
    return this;
  }

  contentTypeApplPdf() {
    this.response.headers?.append("Content-type", "application/pdf");
    return this;
  }

  contentTypeApplJson() {
    this.response.headers?.append("Content-Type", "application/json");
    return this;
  }

  contentTypeTextHtml() {
    this.response.headers?.append("Content-type", "text/html");
    return this;
  }

  contentTypeTextCss() {
    this.response.headers?.append("Content-type", "text/css");
    return this;
  }

  contentTypeImageGiff() {
    this.response.headers?.append("Content-type", "image/gif");
    return this;
  }

  contentTypeImageJPEG() {
    this.response.headers?.append("Content-type", "image/jpeg");
    return this;
  }

  location(url: string) {
    this.response.headers?.append("Location", url);
    return this;
  }

  /**
   * Sent the response
   * @param content
   */
  async sent(
    body: BodyInit | null | undefined = this.response.body,
    init: ResponseInit = {}
  ): Promise<void> {
    if (this.#sent) {
      throw "Response is already sent";
    }
    console.log(this.response.headers);
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
   * Sent response as download resposne
   * @param body
   */
  async download(body: ReadableStream<Uint8Array>) {
    this.response.headers?.append("Content-Disposition", "attachment");
    await this.body(body).sent();
  }

  /**
   * Sent a redirect response
   * @param url
   */
  async redirect(url: string): Promise<void> {
    await this.statusFound().location(url).sent();
  }

  /**
   * Sent a json response
   * @param content Json ttype
   */
  async json(content: {}): Promise<void> {
    await this.statusOk()
      .contentTypeApplJS()
      .body(JSON.stringify(content))
      .sent();
  }

  /**
   * Sent a plain text response
   */
  async text(content: string): Promise<void> {
    await this.statusOk().body(content).sent();
  }

  async stream(content: ReadableStream): Promise<void> {
    await this.statusOk().body(content).sent();
  }

  /**
   * Sent html text as responsr
   * @param content
   */
  async html(content: string): Promise<void> {
    await this.statusOk().contentTypeTextHtml().body(content).sent();
  }

  /**
   * set http status codes
   */

  /**
   * Set http status code to 200 and status text to ok
   * @returns this
   */
  statusOk() {
    this.response.status = 200;
    this.response.statusText = "success";
    return this;
  }

  statusCreated() {
    this.response.status = 201;
    this.response.statusText = "created";
    return this;
  }

  statusAccepted() {
    this.response.status = 202;
    this.response.statusText = "accepted";
    return this;
  }

  statusMovedPermanently() {
    this.response.status = 301;
    this.response.statusText = "Moved Permanently";
    return this;
  }

  statusFound() {
    this.response.status = 302;
    this.response.statusText = "Found";
    return this;
  }

  statusSeeOther() {
    this.response.status = 303;
    this.response.statusText = "See Other";
    return this;
  }

  statusNotModified() {
    this.response.status = 304;
    this.response.statusText = "Moved Permanently";
    return this;
  }

  statusBadRequest() {
    this.response.status = 400;
    this.response.statusText = "Bad Request";
    return this;
  }

  statusUnauthorized() {
    this.response.status = 401;
    this.response.statusText = "Unauthorized";
    return this;
  }

  statusForbidden() {
    this.response.status = 403;
    this.response.statusText = "Forbidden";
    return this;
  }

  statusNotFound() {
    this.response.status = 404;
    this.response.statusText = "Not Found";
    return this;
  }

  statusMethodNotAllowed() {
    this.response.status = 405;
    this.response.statusText = "Method Not Allowed";
    return this;
  }

  statusNotAcceptable() {
    this.response.status = 406;
    this.response.statusText = "Not Acceptable";
    return this;
  }

  statusRequestTimeout() {
    this.response.status = 408;
    this.response.statusText = "Request Timeout";
    return this;
  }

  statusConflict() {
    this.response.status = 409;
    this.response.statusText = "Conflict";
    return this;
  }

  statusGone() {
    this.response.status = 410;
    this.response.statusText = "Gone";
    return this;
  }

  statusLengthRequired() {
    this.response.status = 411;
    this.response.statusText = "Length Required";
    return this;
  }

  statusPayloadTooLarge() {
    this.response.status = 413;
    this.response.statusText = "Payload Too Large";
    return this;
  }

  statusIneralServerError() {
    this.response.status = 500;
    this.response.statusText = "Ineral Server Error";
    return this;
  }

  statusServerUnavailable() {
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
