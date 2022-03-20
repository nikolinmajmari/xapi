import {XapiRequest, XapiResponse} from "./mod.ts";

const server = Deno.listen({port: 8080});
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // without awaiting the function
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    await handleEvent(requestEvent);
  }
}

async function handleEvent(event: Deno.RequestEvent) {
  const response = new XapiResponse(event);
  const request = new XapiRequest(event.request);
  await request.body.parseJson();
  await request.body.parseForm();
  await request.body.parseMultipartFormData();
  await request.body.parseText();
  const json = request.body.json;
  const form = request.body.form;
  const multipartForm = request.body.formData;
  const text = request.body.text;
  await response
    .withBody("hey")
    .withStatusCode(200)
    .withStatusText("success")
    .end();
}
