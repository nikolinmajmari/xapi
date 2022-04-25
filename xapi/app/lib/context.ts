import {XapiRequest, XapiResponse} from "../deps.ts";

/**
 * @member request used to sent the resposne
 * @member response basic information of the request
 */
export interface ContextInterface {
  request: XapiRequest;
  response: XapiResponse;
}

/**
 * Default shared context accross the middleware functions
 *
 * @member request
 * @member response
 */
export class Context implements ContextInterface {
  constructor(event: Deno.RequestEvent) {
    this.request = new XapiRequest(event.request);
    this.response = new XapiResponse(event);
  }
  request: XapiRequest;
  response: XapiResponse;
}
