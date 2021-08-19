import { LayerHandler, RequestHandler, RequestHandlerInterface } from "./router.lib.ts";

function isString(value:string|String) {
	return typeof value === 'string' || value instanceof String;
}


interface RouterInterface{
    get(handler: Router | Function | RequestHandlerInterface):void,
    get(path: string|string[], handler: Router | Function |RequestHandlerInterface):void,
    get(path: string|string[], handler: (Router | Function |RequestHandlerInterface)[]):void;
    post(handler: Router | Function | RequestHandlerInterface):void,
    post(path: string|string[], handler: Router | Function |RequestHandlerInterface):void,
    post(path: string|string[], handler: (Router | Function  |RequestHandlerInterface)[]):void;
    put(handler: Router | Function | RequestHandlerInterface):void,
    put(path: string|string[], handler: Router | Function | RequestHandlerInterface):void,
    put(path:string|string[], handler: (Router | Function | RequestHandlerInterface)[]):void;
    patch(handler: Router | Function | RequestHandlerInterface):void,
    patch(path: string|string[], handler: Router | Function | RequestHandlerInterface):void,
    patch(path: string|string[], handler: (Router | Function | RequestHandlerInterface)[]):void;
    delete(handler: Router | Function | RequestHandlerInterface):void,
    delete(path: string|string[], handler: Router | Function | RequestHandlerInterface):void,
    delete(path: string|string[], handler: (Router | Function | RequestHandlerInterface)[]):void;
    use(handler: Router | Function | RequestHandlerInterface):void,
    use(path: string|string[], handler: Router | Function | RequestHandlerInterface):void,
    use(path: string|string[], handler: (Router | Function | RequestHandlerInterface)[]):void;
}




export class Router implements RouterInterface {
    protected handler: LayerHandler = new LayerHandler();


    get(handler: Router|Function | RequestHandlerInterface): void;
    get(path: string | string[], handler: Function | Router | RequestHandlerInterface): void;
    get(path: string | string[], handler: (Function | Router | RequestHandlerInterface)[]): void;
    get(...params:(string|string[]| Function | Router | RequestHandlerInterface | (Function | Router | RequestHandlerInterface)[])[]): void {
        if (params.length == 1) {
            if (params[0] instanceof Router) {
                this.handler.get("/",params[0].handler);
            } else if(Array.isArray(params[0])) {
                (params[0] as (Router | Function | RequestHandlerInterface)[]).forEach((item: Function | Router | RequestHandlerInterface, index: number) => {
                    if (item instanceof Router) {
                        this.handler.get("/", item.handler);
                    } else {
                        this.handler.get("/", item);
                    }
                });
            }else {
                this.handler.get("/",params[0] as Function|RequestHandlerInterface);
            }
        } else if (params.length == 2) {
            if ((params[0] instanceof String || typeof params[0] == "string") && params[1] instanceof Router) {
                this.handler.get(params[0] as string, params[1].handler);
            } else if ((params[0] instanceof String || typeof params[0] == "string") && Array.isArray(params[1])) {
                (params[1]as (Router|Function | RequestHandlerInterface)[]).forEach((item: (Function | Router | RequestHandlerInterface), index: number) => {
                    if (item instanceof Router) {
                        this.handler.get(params[0] as string,item.handler);
                    } else {
                        this.handler.get(params[0] as string, item);
                    } 
                });
            } else if(Array.isArray(params[0])) {
                if (params[1] instanceof Router) {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        this.handler.get(path, (params[1] as Router).handler);
                    });
                } else if (Array.isArray(params[1])) {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        (params[1] as (Function | RequestHandlerInterface | Router)[]).forEach(
                            (item: Function | Router | RequestHandlerInterface, index: number) => {
                                if (item instanceof Router) {
                                    this.handler.get(path, item.handler);
                                } else {
                                    this.handler.get(path, item);
                                }
                            }
                        );
                    });
                } else {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        this.handler.get(path, (params[1] as (Function|RequestHandlerInterface)));
                    });
                }
            } else if((params[0] instanceof String || typeof params[0] == "string")) {
                this.handler.get(params[0] as string, params[1] as (Function | RequestHandlerInterface));
            } else {
                throw `invalid interface usage, check arguments`;
            }
        } else {
            throw `invalid arguments, only one or two allowed`;
        }
    }
    post(handler: Function | Router): void;
    post(path: string | string[], handler: Function | Router): void;
    post(path: string | string[], handler: (Function | Router)[]): void;
    post(...params:(string|string[]| Function | Router| (Function | Router)[])[]): void {
        if (params.length == 1) {
            if (params[0] instanceof Router) {
                this.handler.post("/",params[0].handler);
            } else if(Array.isArray(params[0])) {
                (params[0] as (Router | Function | RequestHandlerInterface)[]).forEach((item: Function | Router | RequestHandlerInterface, index: number) => {
                    if (item instanceof Router) {
                        this.handler.post("/", item.handler);
                    } else {
                        this.handler.post("/", item);
                    }
                });
            } else {
                this.handler.post("/",params[0] as Function|RequestHandlerInterface);
            }
        } else if (params.length == 2) {
            if (params[0] instanceof String && params[1] instanceof Router) {
                this.handler.post(params[0] as string, params[1].handler);
            } else if (params[0] instanceof String && Array.isArray(params[1])) {
                (params[1]as (Router|Function | RequestHandlerInterface)[]).forEach((item: (Function | Router | RequestHandlerInterface), index: number) => {
                    if (item instanceof Router) {
                        this.handler.post(params[0] as string,item.handler);
                    } else {
                        this.handler.post(params[0] as string, item);
                    } 
                });
            } else if(Array.isArray(params[0])) {
                if (params[1] instanceof Router) {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        this.handler.post(path, (params[1] as Router).handler);
                    });
                } else if (Array.isArray(params[1])) {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        (params[1] as (Function | RequestHandlerInterface | Router)[]).forEach(
                            (item: Function | Router | RequestHandlerInterface, index: number) => {
                                if (item instanceof Router) {
                                    this.handler.post(path, item.handler);
                                } else {
                                    this.handler.post(path, item);
                                }
                            }
                        );
                    });
                } else {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        this.handler.post(path, (params[1] as (Function|RequestHandlerInterface)));
                    });
                }
            } else if(params[0] instanceof String) {
                this.handler.post(params[0] as string, params[1] as (Function | RequestHandlerInterface));
            } else {
                throw `invalid interface usage, check arguments`;
            }
        } else {
            throw `invalid arguments, only one or two allowed`;
        }
    }
    put(handler: Function | Router): void;
    put(path: string | string[], handler: Function | Router): void;
    put(path: string | string[], handler: (Function | Router)[]): void;
    put(...params:(string|string[]| Function | Router| (Function | Router)[])[]): void {
        throw new Error("Method not implemented.");
    }
    patch(handler: Function | Router): void;
    patch(path: string | string[], handler: Function | Router): void;
    patch(path: string | string[], handler: (Function | Router)[]): void;
    patch(...params:(string|string[]| Function | Router| (Function | Router)[])[]): void {
        throw new Error("Method not implemented.");
    }
    delete(handler: Function | Router): void;
    delete(path: string | string[], handler: Function | Router): void;
    delete(path: string | string[], handler: (Function | Router)[]): void;
    delete(...params:(string|string[]| Function | Router| (Function | Router)[])[]): void {
        throw new Error("Method not implemented.");
    }
    use(handler: Function | Router): void;
    use(path: string | string[], handler: Function | Router): void;
    use(path: string | string[], handler: (Function | Router)[]): void;
    use(...params:(string|string[]| Function | Router| (Function | Router)[])[]): void {
        if (params.length == 1) {
            if (params[0] instanceof Router) {
                this.handler.use("/",params[0].handler);
            } else if(Array.isArray(params[0])) {
                (params[0] as (Router | Function | RequestHandlerInterface)[]).forEach((item: Function | Router | RequestHandlerInterface, index: number) => {
                    if (item instanceof Router) {
                        this.handler.use("/", item.handler);
                    } else {
                        this.handler.use("/", item);
                    }
                });
            } else {
                    this.handler.use("/",params[0] as Function|RequestHandlerInterface);
            }
        } else if (params.length == 2) {
            if ((params[0] instanceof String || typeof params[0] == "string") && params[1] instanceof Router) {
                this.handler.use(params[0] as string, params[1].handler);
            } else if ((params[0] instanceof String || typeof params[0] == "string") && Array.isArray(params[1])) {
                (params[1]as (Router|Function | RequestHandlerInterface)[]).forEach((item: (Function | Router | RequestHandlerInterface), index: number) => {
                    if (item instanceof Router) {
                        this.handler.use(params[0] as string,item.handler);
                    } else {
                        this.handler.use(params[0] as string, item);
                    } 
                });
            } else if(Array.isArray(params[0])) {
                if (params[1] instanceof Router) {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        this.handler.use(path, (params[1] as Router).handler);
                    });
                } else if (Array.isArray(params[1])) {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        (params[1] as (Function | RequestHandlerInterface | Router)[]).forEach(
                            (item: Function | Router | RequestHandlerInterface, index: number) => {
                                if (item instanceof Router) {
                                    this.handler.use(path, item.handler);
                                } else {
                                    this.handler.use(path, item);
                                }
                            }
                        );
                    });
                } else {
                    (params[0] as string[]).forEach((path: string, index: number) => {
                        this.handler.use(path, (params[1] as (Function|RequestHandlerInterface)));
                    });
                }
            } else if((params[0] instanceof String || typeof params[0] == "string")) {
                this.handler.use(params[0] as string, params[1] as (Function | RequestHandlerInterface));
            } else {
                throw `invalid interface usage, check arguments`;
            }
        } else {
            throw `invalid arguments, only one or two allowed`;
        }
    }
   
   
}
