import { HttpContext } from "../http/http.lib.ts";
import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { StringReader } from "https://deno.land/std@0.105.0/io/mod.ts";
import { Request } from "../http/http.lib.ts";

const reader = new StringReader("");

export default async function BodyParser(ctx: HttpContext, next: Function) {
  const request: Request = ctx.request;
  if (
    request.headers.get("content-type") == "application/x-www-form-urlencoded"
  ) {
    const data = await formParser(request);
    (ctx.request as Request).body = data;
  } else if (
    request.headers.get("content-type") == "application/json"
  ) {
    const data = await Deno.readAll(request.body as Deno.Reader);
    const jsonString = new TextDecoder().decode(data);
    console.log(jsonString);
    if (jsonString != null && jsonString != "") {
      request.body = JSON.parse(new TextDecoder().decode(data));
    }
  } else {
    request.body = new TextDecoder().decode(
      await Deno.readAll(request.body as Deno.Reader),
    );
    console.log("Unsupported form data type");
  }
  next();
}

async function formParser(request: Request): Promise<any> {
  const data = await Deno.readAll(request.body as Deno.Reader);
  const stringData = new TextDecoder().decode(data);
  const parsed: { [key: string]: any } = {};
  stringData.split("&").forEach(function (value: string, index: number) {
    let chunks = value.split("=");
    parsed[chunks[0]] = decodeURI(chunks[1]);
  });
  return parsed;
}
