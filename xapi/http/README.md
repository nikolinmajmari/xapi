# Xapi Http

Simple classes to support the xapi framework

Two main classes are exported from this lib XapiRequest and XapiResponse. 

XapiResponse uses `RequestEvent` to sent the builded response. 

### XapiRequest

It offers all request proprties. The body property is somehow different from fetch api specification. XapiRequest body property is an object which offers some methods to parse request body 

- `parseText` parses request to text type decoding of body. 
- `stream` get property returns a `ReadableStream<Uint8Array>` representation of body. 
- `parseJson`  parses request body to json so then you can retrive json body by `ctx.req.body.json`
- `parseForm` parses request body encoded to `application/url-form-encoded`. Then decoded data can be acessed on `ctx.req.body.form` of `UrlSearchParams` type. 
- `parseMultipartFormData` parses response of `multipart/form-data` type which is used mostly on file upload. It returns a `FormDataBody` type which contains `records` property and `files`. You can also access parsed form into `ctx.req.body.formData` property. 

Below we show an file upload example 
```ts
try {
    const form = await ctx.req.body.parseMultipartFormData();
    const {title, content}: {[key: string]: string} = {...form.fields};
    const _files = form.files ?? [];
    let file = "";
    for (const _file of _files) {
      if (_file.name == "file") {
        file = "user_1_" + Date.now().toString() + "_" + _file.originalName;
        const fp = await Deno.open("./private_uploads/notes/" + file, {
          write: true,
          create: true,
        });
        if (_file.content != undefined) {
          await fp.writable.getWriter().write(_file.content);
        } else {
          const source = await Deno.open(_file.filename!, {read: true});
          await source.readable.pipeTo(fp.writable);
        }
        break;
      }
    }
    const note = new Note();
    note.title = title;
    note.content = content;
    note.file = file;
    await db.createModel(Note, note);
    await ctx.res.redirect("/notes");
  } catch (e) {
    await ctx.res.badRequest();
  }
```

In this example we upload a form with three fields. The third one is a file input type. 

### XapiResponse

Offers nessesary properties to build response
- `headers`
- `body`
- `status`
- `statusText`

Except these you can call `sent()` method to sent the response. 
Except setters of these properties class also offers custom sent methods that have default headers. 