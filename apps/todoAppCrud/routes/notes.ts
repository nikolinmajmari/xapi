import { Router } from "../../../xapi/router/router.ts";

import { HttpContextInterface } from "../../../xapi/http/http.lib.ts";

const router = new Router();
var inMemoryDatabase: { id: number; title: string; content: string }[] = [];
var ID = 0;

const createNote = (title: string, content: string) => {
  ID++;
  return {
    id: ID,
    title: title,
    content: content,
  };
};

router.get("/", function (ctx: HttpContextInterface, next: Function) {
  ctx.response.send(JSON.stringify(inMemoryDatabase));
});

router.post("/new", function (ctx: HttpContextInterface, next: Function) {
  const { title, content } = ctx.request.body as { [key: string]: any };
  const note = createNote(title, content);
  inMemoryDatabase.push(note);
  ctx.response.send("created");
});

router.get(
  "/:id(\\d)/edit",
  function (ctx: HttpContextInterface, next: Function) {
    const note = inMemoryDatabase.find(
      (val: { id: number; title: string; content: string }, index: number) => {
        console.log(val, ctx.request.params.id);
        return val.id == parseInt(ctx.request.params.id);
      },
    );
    if (ctx.request.query.property != undefined && note != undefined) {
      const param = ctx.request.query.property;
      switch (param) {
        case "content":
          ctx.response.send(note.content);
          return;
        case "id":
          ctx.response.send((note.id.toString()));
          return;
        case "title":
          ctx.response.send(note.title);
          return;
        default:
          break;
      }
    }
    ctx.response.send(JSON.stringify(note));
  },
);

router.get(
  "/:id(\\d)/:property(title|id|content)",
  function (ctx: HttpContextInterface, next: Function) {
    const note = inMemoryDatabase.find(
      (val: { id: number; title: string; content: string }, index: number) => {
        console.log(val, ctx.request.params.id);
        return val.id == parseInt(ctx.request.params.id);
      },
    );
    const param = ctx.request.params.property;
    if (note != undefined && param != undefined) {
      switch (param) {
        case "content":
          ctx.response.send(note.content);
          return;
        case "id":
          ctx.response.send((note.id.toString()));
          return;
        case "title":
          ctx.response.send(note.title);
          return;
        default:
          ctx.response.send(JSON.stringify(ctx.request.params));
          break;
      }
    } else {
      ctx.response.send("NOt found");
    }
  },
);

router.post(
  "/:id(\\d)/:property(title|id|content)",
  function (ctx: HttpContextInterface, next: Function) {
    const note = inMemoryDatabase.find(
      (val: { id: number; title: string; content: string }, index: number) => {
        console.log(val, ctx.request.params.id);
        return val.id == parseInt(ctx.request.params.id);
      },
    );
    const data = ctx.request.body as string;
    console.log(data);
    const param = ctx.request.params.property;
    if (note != undefined && param != undefined && data != undefined) {
      switch (param) {
        case "content":
          note.content = data;
          ctx.response.send(note.content);
          return;
        case "id":
          ctx.response.send("can not edit id ");
          return;
        case "title":
          note.title = data;
          ctx.response.send(note.title);
          return;
        default:
          ctx.response.send("unsupported type");
          break;
      }
    } else {
      ctx.response.send("NOt found");
    }
  },
);

router.post(
  "/:id(\\d)/edit",
  function (ctx: HttpContextInterface, next: Function) {
    const { title, content } = ctx.request.body as { [key: string]: any };
    console.log("update with ", title, content, ctx.request.body);
    const note = inMemoryDatabase.find(
      (val: { id: number; title: string; content: string }, index: number) => {
        return val.id == parseInt(ctx.request.params.id);
      },
    );
    if (note == undefined) {
      ctx.response.send("not found");
      return;
    }
    note.title = title;
    note.content = content;
    console.log(note);
    ctx.response.send(JSON.stringify(note));
  },
);

router.delete("/:id(\\d)/delete", [
  (ctx: HttpContextInterface, next: Function) => {
    inMemoryDatabase = inMemoryDatabase.filter(
      (
        value: { id: number; title: string; content: string },
        index: number,
      ) => {
        return value.id != parseInt(ctx.request.params.id);
      },
    );
    ctx.response.send(JSON.stringify(inMemoryDatabase));
  },
]);

export default router;
