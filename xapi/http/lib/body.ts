import {readerFromStreamReader} from "../deps.ts";
import {FormDataBody, FormDataReader} from "./oak/multipart.ts";

export type JsonType = {
  [key: string | number]: JsonType | number | string | null;
};

export type BodyType =
  | string
  | null
  | JsonType
  | URLSearchParams
  | FormDataBody
  | Uint8Array;

export interface ParsableBodyInterface {
  parseJson(): Promise<JsonType>;
  parseForm(): Promise<URLSearchParams>;
  parseMultipartFormData(): Promise<FormDataBody>;
  parseText(): Promise<string | null>;
  get json(): JsonType;
  get form(): URLSearchParams;
  get formData(): FormDataBody;
  get text(): string | null;
}

const decoder = new TextDecoder();

export default class RequestBody implements ParsableBodyInterface {
  #isRead: boolean;
  #json: JsonType = {};
  #formData: FormDataBody = {
    fields: {},
    files: [],
  } as FormDataBody;
  #form: URLSearchParams = new URLSearchParams();
  #text: string | null = null;

  #source: ReadableStream<Uint8Array> | null = null;
  #headers: Headers;

  constructor(request: Request) {
    this.#source = request.body;
    this.#isRead = true;
    this.#headers = request.headers;
  }

  /**
   * parse request body  to json
   */
  async parseJson(): Promise<JsonType> {
    const reader = this.#source?.getReader();
    const data = await reader?.read();
    const value = data?.value;
    const jsonString = new TextDecoder().decode(value);
    if (jsonString != null && jsonString != "") {
      this.#json = JSON.parse(new TextDecoder().decode(value));
      return this.#json;
    }
    throw "No content type to parse JSON";
  }
  async parseForm(): Promise<URLSearchParams> {
    this.#form = new URLSearchParams(
      decoder.decode(await this.uint8Array()).replace(/\+/g, " ")
    );
    return this.#form;
  }
  async parseMultipartFormData(): Promise<FormDataBody> {
    const contentType = this.#headers.get("content-type");
    const readableStream = this.#source?.getReader();
    if (contentType != null && readableStream != undefined) {
      const reader = new FormDataReader(
        contentType,
        readerFromStreamReader(readableStream)
      );
      this.#formData = await reader.read();
      return this.#formData;
    }
    throw "No Body Detected";
  }
  async parseText(): Promise<string | null> {
    const reader = this.#source?.getReader();
    const data = await reader?.read();
    const value = data?.value;
    this.#text = decoder.decode(value);
    return this.#text;
  }
  get json(): JsonType {
    return this.#json;
  }
  get form(): URLSearchParams {
    return this.#form;
  }
  get formData(): FormDataBody {
    return this.#formData;
  }
  get text(): string | null {
    return this.#text;
  }

  get stream(): ReadableStream<Uint8Array> | null {
    return this.#source;
  }

  async uint8Array(): Promise<Uint8Array | undefined> {
    this.#isRead = true;
    const reader = this.#source?.getReader();
    const result = await reader?.read();
    return result?.value;
  }
}
