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
   * Sents the response through Deno.Event
   */
  private endResponse() {
    if (this.#sent == false) {
      this.#sent = true;
      this.#event.respondWith(
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
   *
   * @param status set the status code of the response to sent
   * @returns
   */
  withStatusCode(status: number) {
    this.response.status = status;
    return this;
  }
  /**
   *
   * @param headers add headers to the response to sent, typical are the cokie headers
   * @returns
   */
  withHeaders(headers: {[key: string]: string}) {
    for (const header in headers) {
      this.response.headers?.set(header, headers[header]);
    }
    return this;
  }
  /**
   *
   * @param body Add the body of the request
   * @returns
   */
  withBody(body: BodyInit) {
    this.response.body = body;
    return this;
  }
  /**
   *
   * @param text Add the status text of the response
   * @returns
   */
  withStatusText(text: string) {
    this.response.statusText = text;
    return this;
  }

  /**
   * end the response and sent it. After you call end you can not sent any response
   */
  end(): void {
    this.endResponse();
  }

  /**
   * Endable
   * @param content
   */
  send(
    body: BodyInit | null | undefined = this.response.body,
    init: ResponseInit = {}
  ) {
    this.#event.respondWith(
      new Response(body, {
        headers: this.response.headers,
        status: this.response.status,
        statusText: this.response.statusText,
        ...init,
      })
    );
  }

  stream() {
    this.send(undefined, {});
  }

  view() {}

  redirect() {}

  json(content: {}) {
    this.response.headers?.set("Content-Type", "application/json");
    this.response.status = 200;
    this.#event.respondWith(
      new Response(JSON.stringify(content), {
        headers: this.response.headers,
        status: 200,
        statusText: "success",
      })
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
