export interface ContextInterface {
  event: Deno.RequestEvent;
  params: {};
}

export class Context implements ContextInterface {
  event: Deno.RequestEvent;
  params: {};

  constructor(event: Deno.RequestEvent) {
    this.params = {};
    this.event = event;
  }
}
