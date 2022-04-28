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
  await ctx.res.json(db);
});

router.get("/new", async (ctx, next) => {
  await ctx.res.html("hey papa papa");
});

/**
 * return a specific note
 */
router.get("/:id(\\d+)", async (ctx, next) => {
  const note = db.find((e) => e.id == ctx.req.params.id);
  if (note != undefined) {
    return await ctx.res.json(note);
  }
  next();
});

/**
 * add an specific note
 */
router.post("/", async (ctx, next) => {
  await ctx.req.body.parseJson();
  const json = ctx.req.body.json;
  db.push({
    id: db.length,
    title: json.title,
    content: json.content,
  } as Note);
  ctx.res.text("200");
});

/**
 * update specific note
 */
router.patch("/:id(\\d+)", async (ctx, next) => {
  await ctx.req.body.parseJson();
  const json = ctx.req.body.json;
  console.log("patxh");
  const note = db.findLast((val) => val.id == ctx.req.params.id);
  if (note != undefined) {
    if (typeof json.title == "string") {
      note.title = json.title;
    }
    if (typeof json.content == "string") {
      note.content = json.content ?? note.content;
    }
    ctx.res.body("200").sent();
  }
  next();
});

/**
 * delete specific note
 */
router.delete("/:id(\\d+)", async (ctx, next) => {
  const note = db.find((val) => val.id == ctx.req.params.id);
  if (note != undefined) {
    db = db.filter((val) => val.id != ctx.req.params.id);
    return await ctx.res.body("200").sent();
  }
  next();
});

export default router;
