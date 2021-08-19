import { Router } from "./xapi/router/router.ts";
import Application from "./xapi/app/application.ts";
import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";

const app = new Application();


const usersRouter = new Router();

usersRouter.use((req: ServerRequest, next: Function) => {
    console.log("users auth middleware");
    next();
});
usersRouter.get("/", (req: ServerRequest, next: Function) => {
    req.respond({ body: "users route" });
});
usersRouter.get("/new", (req: ServerRequest, next: Function) => {
    req.respond({ body: "users/new route" });
});
usersRouter.get("/new/more", (req: ServerRequest, next: Function) => {
    req.respond({ body: "users/new/more route" });
});
usersRouter.get("/delete", (req: ServerRequest, next: Function) => {
    req.respond({ body: "users/delete route" });
});



app.use((req: ServerRequest, next: Function) => {
    console.log("session middlwware");
    next();
});
app.use((req: ServerRequest, next: Function) => {
    console.log("static middleware");
    next();
});
app.use((req: ServerRequest, next: Function) => {
    console.log("authentication middleware");
    next();
});

app.get("/login", (req: ServerRequest, next: Function) => {
    req.respond({body:"this is login path"});
});

app.use("/users", usersRouter);
app.get("/forms", (req: ServerRequest, next: Function) => {
    req.respond({body:"this is /forms path"});
});


app.listen();