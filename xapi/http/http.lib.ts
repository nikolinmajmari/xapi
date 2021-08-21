import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  ALL = "ALL",
}

export interface HttpContextInterface {
  request: ServerRequest;
  response: Response;
}

export class HttpContext implements HttpContextInterface {
  readonly request: ServerRequest;
  readonly response: Response;
  constructor(request: ServerRequest) {
    this.request = request;
    this.response = new Response(this.request);
  }
}

export class Response {
  private readonly request: ServerRequest;
  constructor(request: ServerRequest) {
    this.request = request;
  }
  send(content: string) {
    this.request.respond({ body: content });
  }
}
