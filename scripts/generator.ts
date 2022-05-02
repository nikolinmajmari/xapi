export function generator() {
    const cwd = Deno.cwd();

    Deno.mkdir("views");
    Deno.mkdir("routes");
    Deno.mkdir("assets");
    Deno.mkdir("auth");
    Deno.mkdir("models")
    Deno.mkdir("var")
    Deno.writeTextFile("deps.ts",
    `
    export {Application,Router,engines,staticMiddleware,XapiFormDataFiles,xapiDefaultFileManager, FileManager}
    from "https://raw.githubusercontent.com/nikolinmajmari/xapi/main/xapi/app/mod.ts";
    export {SessionProvider, FileAdapter} from "https://raw.githubusercontent.com/nikolinmajmari/xapi/main/xapi/session/mod.ts";
    export {type AuthenticableInterface,Authenticable,SessionAuthContext,SessionAuth,authExtractor} from "https://raw.githubusercontent.com/nikolinmajmari/xapi/main/xapi/security/mod.ts";
    `
    ,{create:true}
    );
    Deno.writeTextFile("app.ts",
    `
import {Application} from "./deps.ts";
import {engines, staticMiddleware} from "./deps.ts";
import homeRouter from "./routes/home.ts";
// cereate the app
const app = new Application();
app.setViewEngine(engines.etaEngine.configure({cache: false}));
// add router
app.use(homeRouter);
// start the web server
app.listen(8000);
    `
    ,{create:true}
    );
    Deno.writeTextFile("routes/home.ts",
    `
    import {Router} from "../deps.ts";
    const router = new Router();
    router.get("/",(ctx,next)=>{
        ctx.res.render("./home.eta",{message:"hellow world"});
    });
    `
    ,{create:true}
    );
    Deno.writeTextFile("views/home.eta",
    `
    <html>
    <head></head>
    <body>
    <main>
    <h3>Xapi App</h3>
    <%= it.message %>
    </main>
    
    </body>
    <footer></footer>
    </html>
    `
    ,{create:true}
    );
}

generator();