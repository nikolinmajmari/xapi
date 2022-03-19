import {HTTPJSON} from "./types.ts";

/**
 * @member source The unparsed request body
 * @member parser The injected parser that will parse request. Parsers are injected based on request type
 *                a middleware can be used to inject parser on the reques so the data can be parsed to json type
 *                to process it in application
 */

export type BodyType =
  | "bytes"
  | "form"
  | "form-data"
  | "json"
  | "text"
  | "reader"
  | "stream"
  | "undefined";

export type BodyBytes = {
  readonly type: "bytes";
  readonly value: Promise<Uint8Array>;
};

export type BodyJson = {
  readonly type: "json";
  readonly value: Promise<any>;
};

export type BodyForm = {
  readonly type: "form";
  readonly value: Promise<URLSearchParams>;
};

export type BodyText = {
  readonly type: "text";
  readonly value: Promise<string>;
};

export type BodyReader = {
  readonly type: "reader";
  readonly value: Deno.Reader;
};

export type BodyStream = {
  readonly type: "stream";
  readonly value: ReadableStream<Uint8Array>;
};

export default class RequestBody {
  #source: ReadableStream<Uint8Array> | null;
  #parser: (
    source: ReadableStream<Uint8Array> | null
  ) => HTTPJSON | ReadableStream<Uint8Array> | null;

  constructor(body: ReadableStream<Uint8Array> | null) {
    this.#source = body;
    this.#parser = (a) => a;
  }

  get data(): HTTPJSON | ReadableStream<Uint8Array> | null {
    return this.#parser(this.#source);
  }
}
