import { HttpContext } from "../http/http.lib.ts";
import { HttpRequest } from "../http/http.lib.ts";


export default async function BodyParser(ctx: HttpContext, next: Function) {
  const request: HttpRequest = ctx.request;
  if (
    request.headers.get("content-type") == "application/x-www-form-urlencoded"
  ) {
    const data = await formParser(request);
    (ctx.request as HttpRequest).body = data;
  } else if (
    request.headers.get("content-type") == "application/json"
  ) {
    const reader = request.requestEvent.request.body?.getReader();
    const data = await reader?.read();
    const value = data?.value;
    const jsonString = new TextDecoder().decode(value);
    if (jsonString != null && jsonString != "") {
      request.body = JSON.parse(new TextDecoder().decode(value));
      
    }
  } else {
    const reader = request.requestEvent.request.body?.getReader();
    const data = await reader?.read();
    const value = data?.value;
    request.body = value??null;
    console.log("Unsupported form data type");
  }
  next();
}

async function formParser(request: HttpRequest): Promise<any> {
  const reader = request.requestEvent.request.body?.getReader();
  const data = await reader?.read();
  const value = data?.value;
  const stringData = new TextDecoder().decode(value);
  const parsed: { [key: string]: any } = {};
  stringData.split("&").forEach(function (value: string, index: number) {
    let chunks = value.split("=");
    parsed[chunks[0]] = decodeURI(chunks[1]);
  });
  return parsed;
}
