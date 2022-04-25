import {Router} from "../deps.ts";

interface Note {
  id: number;
  title: string;
  content: string;
}

const router = new Router();
let db: Note[] = [];

/**
 * return all notes
 */
router.get("/", async (ctx, next) => {
  await ctx.response.json(db);
});

/**
 * return a specific note
 */
router.get("/:id(\\d+)", async (ctx, next) => {
  const note = db.find((e) => e.id == ctx.request.params.id);
  if (note != undefined) {
    return await ctx.response.json(note);
  }
  next();
});

/**
 * add an specific note
 */
router.post("/", async (ctx, next) => {
  await ctx.request.body.parseJson();
  const json = ctx.request.body.json;
  db.push({
    id: db.length,
    title: json.title,
    content: json.content,
  } as Note);
  ctx.response.send("200");
});

/**
 * update specific note
 */
router.patch("/:id(\\d+)", async (ctx, next) => {
  await ctx.request.body.parseJson();
  const json = ctx.request.body.json;
  console.log("patxh");
  const note = db.findLast((val) => val.id == ctx.request.params.id);
  if (note != undefined) {
    if (typeof json.title == "string") {
      note.title = json.title;
    }
    if (typeof json.content == "string") {
      note.content = json.content ?? note.content;
    }
    ctx.response.send("200");
  }
  next();
});

/**
 * delete specific note
 */
router.delete("/:id(\\d+)", async (ctx, next) => {
  const note = db.find((val) => val.id == ctx.request.params.id);
  if (note != undefined) {
    db = db.filter((val) => val.id != ctx.request.params.id);
    return await ctx.response.send("200");
  }
  next();
});

export default router;
