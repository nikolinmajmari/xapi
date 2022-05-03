import {XapiRequest, XapiResponse} from "../deps.ts";
import {ContextResponse} from "./response.ts";
import {ContextRequest} from "./request.ts";
import {Application} from "./app.ts";

/**
 * @member request used to sent the resposne
 * @member response basic information of the request
 */
export interface ContextInterface {

  /**
   * request
   */
  req: ContextRequest;

  /**
   * response
   */
  res: ContextResponse;

  /**
   * attribs
   */
  attribs: {[key: string]: any};
  /**
   * variables shared across middleware. Different from attribs these values are shared across the view also 
   */
  locals:{[key:string]:any}
}

/**
 * Default shared context accross the middleware functions
 *
 * @member request
 * @member response
 */
export class Context implements ContextInterface {
  #event: Deno.RequestEvent;
  #app: Application;
  get app(): Application {
    return this.#app;
  }
  get event(): Deno.RequestEvent {
    return this.#event;
  }
  constructor(event: Deno.RequestEvent, app: Application) {
    this.#event = event;
    this.#app = app;
    this.req = new ContextRequest(this);
    this.res = new ContextResponse(this);
  }
  locals: { [key: string]: any; } = {};
  req: ContextRequest;
  res: ContextResponse;
  attribs = {};
}
