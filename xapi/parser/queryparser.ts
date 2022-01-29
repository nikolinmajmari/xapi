import { HttpContextInterface } from "../http/http.lib.ts";

export default async function QueryParser(
  ctx: HttpContextInterface,
  next: Function,
) {
  var search = ctx.request.url.split("?")[1];
  ctx.request.url = decodeURI(ctx.request.url.split("?")[0]);
  if (search != undefined) {
    search = '{"' +
      decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(
        /=/g,
        '":"',
      ) + '"}';
    ctx.request.query = JSON.parse(search);
  }
  next();
}
