import { HttpConstants,StatusCodeInterface } from "./http.ts";

/**
 *  XapiResponse wraps Deno.event. Is used to construct a [Response] and sent it through deno.Event
 * @member event The deno.Event instance that triggered the request
 * @member response The init data used to initialize the response.
 */
export class XapiResponse implements StatusCodeInterface {
  readonly #event: Deno.RequestEvent;
  #sent: boolean;
  body :BodyInit|undefined;
  headers:Headers;
  status:number;

  statusText:string;
  constructor(event: Deno.RequestEvent) {
    this.#event = event;
    this.#sent = false;
    this.headers = new Headers();
    this.status = 200;
    this.statusText = "OK";
  }

  /**
   * set status of the response
   * @param status
   * @returns
   */
  setStatus(
    {status,statusText}: StatusCodeInterface
  ) {
    this.status = status;
    this.statusText = statusText??this.statusText;
    return this;
  }

  /**
   * set headers of the response
   * @param headers
   * @returns
   */
  setHeaders(headers: {[key: string]: any}) {
    for (const key in headers) {
      this.headers?.append(key, headers[key]);
    }
    return this;
  }

  /**
   * Set body of the response
   * @param body
   * @returns
   */
  setBody(body: BodyInit) {
    this.body = body;
    return this;
  }
  /**
   * set content type to "application/javascript"
   * @returns this
   */
  contentTypeApplJS() {
    this.headers?.append("Content-type", "application/javascript");
    return this;
  }

  contentTypeApplPdf() {
    this.headers?.append("Content-type", "application/pdf");
    return this;
  }

  contentTypeApplJson() {
    this.headers?.append("Content-Type", "application/json");
    return this;
  }

  contentTypeTextHtml() {
    this.headers?.append("Content-type", "text/html");
    return this;
  }

  contentTypeTextCss() {
    this.headers?.append("Content-type", "text/css");
    return this;
  }

  contentTypeImageGiff() {
    this.headers?.append("Content-type", "image/gif");
    return this;
  }

  contentTypeImageJPEG() {
    this.headers?.append("Content-type", "image/jpeg");
    return this;
  }

  location(url: string) {
    this.headers?.append("Location", url);
    return this;
  }

  /**
   * Sent the response
   * @param content
   */
  async sent(
    body: BodyInit | null | undefined = this.body,
    init: ResponseInit = {}
  ): Promise<void> {
    if (this.#sent) {
      throw "Response is already sent";
    }
    await this.#event.respondWith(
      new Response(body, {
        headers: this.headers,
        status: this.status,
        statusText: this.statusText,
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
    await this.setBody(body)
              .setHeaders({"Content-Disposition": "attachment"})
              .sent();
  }

  /**
   * Sent a redirect response
   * @param url
   */
  async redirect(url: string): Promise<void> {
    await this.setStatus(HttpConstants.httpStatusFound).location(url).sent();
  }

  /**
   * Sent a json response
   * @param content Json ttype
   */
  async json(content: any,status=HttpConstants.httpStatusOk): Promise<void> {
    await this.setStatus(status)
    .contentTypeApplJson()
    .setBody(JSON.stringify(content))
    .sent()
  }

  /**
   * Sent a plain text response
   */
  async text(content: string): Promise<void> {
    await this.setStatus(HttpConstants.httpStatusOk)
              .setHeaders({"content-type":"text-plain"})
              .setBody(content)
              .sent();
  }

  async stream(content: ReadableStream<Uint8Array>): Promise<void> {
    await this.setStatus(HttpConstants.httpStatusOk)
              .setBody(content)
              .sent();
  }

  /**
   * Sent html text as responsr
   * @param content
   */
  async html(content: string): Promise<void> {
    await this.setStatus(HttpConstants.httpStatusOk)
              .contentTypeTextHtml()
              .setBody(content)
              .sent();
  }
}
