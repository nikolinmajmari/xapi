import RequestBody from "./body.ts";

export class XapiRequest {
  requestBody: RequestBody;
  #body: undefined | string | Uint8Array | null | {[key: string]: any};
  headers: Headers;
  params: {[key: string]: any} = {};
  query: {[key: string]: any} = {};
  readonly requestEvent: Deno.RequestEvent;
  url: string;
  method: string;
  constructor(event: Deno.RequestEvent) {
    this.requestEvent = event;
    this.requestBody = new RequestBody(event.request.body);
    this.method = event.request.method;
    this.url = event.request.url;
    this.headers = event.request.headers;
    event.request.body;
  }

  get body(): string | Uint8Array | null | {[key: string]: any} {
    return this.requestBody.data;
  }

  get signal(): AbortSignal {
    return this.requestEvent.request.signal;
  }

  get integrity(): string {
    return this.requestEvent.request.integrity;
  }
  get keepAlive(): boolean {
    return this.requestEvent.request.keepalive;
  }
  get mode(): RequestMode {
    return this.requestEvent.request.mode;
  }

  get redirect(): RequestRedirect {
    return this.requestEvent.request.redirect;
  }

  get referrer(): string {
    return this.requestEvent.request.referrer;
  }
  get referrerPolicy(): ReferrerPolicy {
    return this.requestEvent.request.referrerPolicy;
  }

  get blob(): Promise<Blob> {
    return this.requestEvent.request.blob();
  }
}
