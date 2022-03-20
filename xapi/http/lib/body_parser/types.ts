import {JsonType} from "../body.ts";
import {FormDataBody} from "../oak/multipart.ts";

export type JsonParserType = (
  source: ReadableStream<Uint8Array>
) => Promise<JsonType>;
export type FormParserType = (
  source: ReadableStream<Uint8Array>
) => Promise<URLSearchParams>;
export type FormMultipartParserType = (
  reader: ReadableStream<Uint8Array>,
  limit: string
) => Promise<FormDataBody>;
export type BytesParserType = (source: ReadableStreamReader<Uint8Array>) => [];
export type Uint8ArrayParserType = (
  source: ReadableStream<Uint8Array>
) => Promise<Uint8Array>;
export type TextParserType = (
  soucrce: ReadableStream<Uint8Array>
) => Promise<string>;
export type ReadedBodyType =
  | Uint8Array
  | JsonType
  | URLSearchParams
  | string
  | FormDataBody;
export type BodyParserType =
  | JsonParserType
  | FormParserType
  | FormMultipartParserType
  | Uint8ArrayParserType;
