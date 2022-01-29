export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  ALL = "ALL",
}

export interface HttpContextInterface {
  request: HttpRequest;
  response: HttpResponse;
}

export class HttpContext implements HttpContextInterface {
  readonly request: HttpRequest;
  readonly response: HttpResponse;
  constructor(requestEvent:Deno.RequestEvent) {
    this.request = new HttpRequest(requestEvent);
    this.response = new HttpResponse(requestEvent);
  }


  static fromRequestEvent(event:Deno.RequestEvent):HttpContext{
    return new HttpContext(event)
  }
}

export class HttpResponse {
  private readonly event: Deno.RequestEvent;

  headers: Headers;
  constructor(event: Deno.RequestEvent) {
    this.event = event;
    this.headers = new Headers();
  }
  send(content: string) {
    this.event.respondWith(new Response(content,{headers:this.headers,status:200}));
  }
  json(content:{}){
    this.event.respondWith(new Response(JSON.stringify(content),{headers:this.headers,status:200}));
  }
}

export class HttpRequest {
  body: string | Uint8Array | null | { [key: string]: any } = null;
  headers: Headers;
  params: { [key: string]: any } = {};
  query: { [key: string]: any } = {};
  readonly requestEvent: Deno.RequestEvent;
  url: string;
  method: string;
  constructor(event: Deno.RequestEvent) {
    this.requestEvent = event;
    this.body = event.request.body;
    this.method = event.request.method;
    this.url = event.request.url.replace("http://localhost:8080","");
    this.headers = event.request.headers;
  }
}
