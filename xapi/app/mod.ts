export {Router} from "./lib/router.ts";
export {Application} from "./lib/app.ts";
export {Context} from "./lib/context.ts";
export type {ContextInterface} from "./lib/context.ts";

import staticMiddleware from "./lib/static.ts";
import etaEngine from "./lib/template/eta.ts";
const engines = {etaEngine};
export {engines};
export {staticMiddleware};

export {XapiFormDataFiles} from "./lib/file.ts";

import manager, {FileManager} from "./lib/file_manager.ts";
export {manager as xapiDefaultFileManager, FileManager};
