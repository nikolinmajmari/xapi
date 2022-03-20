import RequestBody, {JsonType} from "./body.ts";

/**
 *
 */
export class XapiRequest {
  headers: Headers;
  params: JsonType = {};
  #body: RequestBody;
  query: URLSearchParams;
  readonly request: Request;
  url: string;
  method: string;
  constructor(request: Request) {
    this.request = request;
    this.method = request.method;
    this.url = request.url;
    this.query = new URLSearchParams(new URL(this.url).search);
    this.headers = request.headers;
    this.#body = new RequestBody(request);
  }

  get body() {
    return this.#body;
  }

  get signal(): AbortSignal {
    return this.request.signal;
  }

  get integrity(): string {
    return this.request.integrity;
  }
  get keepAlive(): boolean {
    return this.request.keepalive;
  }
  get mode(): RequestMode {
    return this.request.mode;
  }

  get redirect(): RequestRedirect {
    return this.request.redirect;
  }

  get referrer(): string {
    return this.request.referrer;
  }
  get referrerPolicy(): ReferrerPolicy {
    return this.request.referrerPolicy;
  }

  get blob(): Promise<Blob> {
    return this.request.blob();
  }
}
