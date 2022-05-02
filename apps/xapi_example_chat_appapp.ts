
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
    