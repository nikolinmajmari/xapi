import { ServerRequest } from "https://deno.land/std/http/server.ts";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  ALL = "ALL",
}

export interface HttpContextInterface {
  request: Request;
  response: Response;
}

export class HttpContext implements HttpContextInterface {
  readonly request: Request;
  readonly response: Response;
  constructor(request: ServerRequest) {
    this.request = new Request(request);
    this.response = new Response(request);
  }
}

export class Response {
  private readonly request: ServerRequest;

  headers: Headers;
  constructor(request: ServerRequest) {
    this.request = request;
    this.headers = new Headers();
  }
  send(content: string) {
    this.request.respond({ headers: this.headers, body: content });
  }
}

export class Request {
  body: string | Deno.Reader | undefined | { [key: string]: any } = undefined;
  headers: Headers;
  params: { [key: string]: any } = {};
  query: { [key: string]: any } = {};
  readonly serverRequest: ServerRequest;
  url: string;
  method: string;
  constructor(request: ServerRequest) {
    this.serverRequest = request;
    this.body = request.body;
    this.method = request.method;
    this.url = request.url;
    this.headers = request.headers;
  }
}
