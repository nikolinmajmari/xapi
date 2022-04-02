import {XapiResponseInterface} from "./http.d.ts";

/**
 *  XapiResponse wraps Deno.event. Is used to construct a [Response] and sent it through deno.Event
 * @member event The deno.Event instance that triggered the request
 * @member response The init data used to initialize the response.
 */
export class XapiResponse implements XapiResponseInterface {
  readonly #event: Deno.RequestEvent;
  #sent: boolean;
  private readonly response: XapiResponseInit;
  constructor(event: Deno.RequestEvent) {
    this.#event = event;
    this.#sent = false;
    this.response = new XapiResponseInit();
  }

  /**
   *
   * @param status
   * @returns
   */
  withStatusCode(status: number): XapiResponseInterface {
    this.response.status = status;
    return this;
  }

  /**
   *
   * @param headers
   * @returns
   */
  withHeaders(headers: {[key: string]: string}): XapiResponseInterface {
    for (const key in headers) {
      this.response.headers?.append(key, headers[key]);
    }
    return this;
  }

  /**
   *
   * @param body
   * @returns
   */
  withBody(body: BodyInit): XapiResponseInterface {
    this.response.body = body;
    return this;
  }

  /**
   *
   * @param text
   * @returns
   */
  withStatusText(text: string): XapiResponseInterface {
    this.response.statusText = text;
    return this;
  }

  /**
   *
   */
  private async endResponse() {
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
    return await this.endResponse();
  }

  /**
   * Endable
   * @param content
   */
  async send(
    body: BodyInit | null | undefined = this.response.body,
    init: ResponseInit = {}
  ): Promise<void> {
    await this.#event.respondWith(
      new Response(body, {
        headers: this.response.headers,
        status: this.response.status,
        statusText: this.response.statusText,
        ...init,
      })
    );
  }

  /**
   *
   */
  async stream(): Promise<void> {
    await this.send(undefined, {});
  }

  /**
   *
   * @param url
   */
  async redirect(url: string): Promise<void> {
    this.response.status = 302;
    this.response.statusText = "redirect";
    this.response.headers?.append("Location", url);
    await this.#event.respondWith(new Response(null, this.response));
  }

  /**
   *
   * @param content
   */
  async json(content: {}): Promise<void> {
    this.response.headers?.set("Content-Type", "application/json");
    this.response.status = 200;
    await this.#event.respondWith(
      new Response(JSON.stringify(content), this.response)
    );
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
