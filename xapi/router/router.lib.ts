import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";
import { HttpMethod } from "../http/http.lib.ts";



export interface RequestHandlerInterface {
    handle(request: ServerRequest): void;
    setSuccessor(successor: RequestHandlerInterface): RequestHandlerInterface;
}


export class RequestHandler implements RequestHandlerInterface{
    constructor() { }
    handle(request: any): void {
    }
    setSuccessor(successor: RequestHandlerInterface): RequestHandlerInterface {
        throw new Error("Method not implemented.");
    }
}

interface LayerInterface{
    get(path: string, handler: RequestHandlerInterface | Function):void;
    post(path: string, handler: RequestHandlerInterface | Function):void;
    put(path: string, handler: RequestHandlerInterface | Function):void;
    patch(path: string, handler: RequestHandlerInterface | Function):void;
    delete(path: string, handler: RequestHandlerInterface | Function):void;
    use(path: string, handler: RequestHandlerInterface | Function):void;
}


/**
 * Function handler, encapsulates the request handler function middlware 
 * ---start--- example 
 * let handler = new FunctionHandler(
 *      async (req,next)=>{
 *          if(req.url == "/"){
 *              req.respond({body:"success"});
 *          }else{
 *              console.log("passing to next middleware");
 *              next();
 *          }
 *      }
 * );
 * handler.setSuccessor(new FunctionHandler((req,next)=>console.log("last middleware called")));
 * handler.handle(request)
 * ---end--- example 
 * 
 * @property handler
 * @property successor 
 * @constructor FunctionHandler
 * @method setSuccessor
 * @method handle
 */
export class FunctionHandler extends RequestHandler{
    private handler: Function;
    private successor?: RequestHandlerInterface;
    constructor(handler: Function) {
        super();
        this.handler = handler;
    }
    /**
     * Set next request handler to be called 
     * @param successor 
     * @returns 
     */
    setSuccessor(successor: RequestHandlerInterface): RequestHandlerInterface {
        this.successor = successor;
        return this;
    }

    /**
     * Handle request with current handler, call the middleware function 
     * @param request 
     */
    async handle(request: ServerRequest) {
        await this.handler(request, async() => await this.invokeSuccessor(request));
    }

    /**
     * Call the next request handler if there is one 
     * @param request 
     * @returns 
     */
    async invokeSuccessor(request: ServerRequest) {
        if (this.successor != null) {
            await this.successor.handle(request);
        }
    }
}

/**
 * Registers handelers for an middleware layer of a certain path 
 * 
 * 
 * @property route
 * @property handlers 
 * @property methods 
 */
export class LayerHandler extends RequestHandler implements LayerInterface {
    private route: Route;
    private successor?: RequestHandlerInterface;
    private handelers: RequestHandlerInterface[];
    private methods: HttpMethod[];

    setRoute(route?: Route) {
        if (route != null) {
            this.route = route;
        }
        
        //console.log("set route for ",this.handelers);
        this.handelers.forEach(element => {
            if (element instanceof ChainHandler) {
                element.setRoute(this.route);
            }
        });
    }

    constructor() {
        super();
        this.route = new Route(HttpMethod.ALL, "/");
        this.handelers = [];
        this.methods = [];
    }
    get(path: string, handler: Function | RequestHandlerInterface): void {
        console.log("LayerHandler:get route: ",this.route.getPattern(),"  path: ",path);
        if (path == "/" || path=="") {
            if (handler instanceof Function) {
                this.handelers.push(new FunctionHandler(handler));
                this.methods.push(HttpMethod.GET);
            } else if (handler instanceof LayerHandler) {
                // todo force the method on the next layer 
                this.handelers.push(...handler.handelers);
                this.methods.push(...handler.methods);
            } else {
                this.handelers.push(handler);
                this.methods.push(HttpMethod.GET);
            }
        } else {
            let chainHandler:ChainHandler;
            if (this.handelers.length > 0 && this.handelers[this.handelers.length - 1] instanceof ChainHandler) {
                chainHandler = this.handelers[this.handelers.length - 1] as ChainHandler;
            } else {
                chainHandler = new ChainHandler();
                this.handelers.push(chainHandler);
                this.methods.push(HttpMethod.ALL);
            }
            chainHandler.use(path, handler,HttpMethod.GET);
        }
    }
    post(path: string, handler: Function | RequestHandlerInterface): void {
        
        if (handler instanceof Function) {
            this.handelers.push(new FunctionHandler(handler));
        } else {
            this.handelers.push(handler)
        }
        this.methods.push(HttpMethod.POST);
    }
    put(path: string, handler: Function | RequestHandlerInterface): void {
        
        if (handler instanceof Function) {
            this.handelers.push(new FunctionHandler(handler));
        } else {
            this.handelers.push(handler)
        }
        this.methods.push(HttpMethod.PUT);
    }
    patch(path: string, handler: Function | RequestHandlerInterface): void {
        if (handler instanceof Function) {
            this.handelers.push(new FunctionHandler(handler));
        } else {
            this.handelers.push(handler)
        }
        this.methods.push(HttpMethod.PATCH);
    }
    delete(path: string = "/", handler: Function | RequestHandlerInterface): void{
        if (handler instanceof Function) {
            this.handelers.push(new FunctionHandler(handler));
        } else {
            this.handelers.push(handler)
        }
        this.methods.push(HttpMethod.DELETE);
    }
    use(path: string="/", handler: Function | RequestHandlerInterface): void{
        if (path == "/" || path=="") {
            if (handler instanceof Function) {
                this.handelers.push(new FunctionHandler(handler));
                this.methods.push(HttpMethod.ALL);
            } else if (handler instanceof LayerHandler) {
                // todo force the method on the next layer 
                this.handelers.push(...handler.handelers);
                this.methods.push(...handler.methods);
            } else {
                this.handelers.push(handler);
                this.methods.push(HttpMethod.ALL);
            }
        } else {
            let chainHandler:ChainHandler;
            if (this.handelers.length > 0 && this.handelers[this.handelers.length - 1] instanceof ChainHandler) {
                chainHandler = this.handelers[this.handelers.length - 1] as ChainHandler;
            } else {
                chainHandler = new ChainHandler();
                this.handelers.push(chainHandler);
                this.methods.push(HttpMethod.ALL);
            }
            if (handler instanceof Function) {
                chainHandler.use(path, new FunctionHandler(handler));
            } else {
                chainHandler.use(path, handler);   
            }
        }
    }

    async handle(request: ServerRequest): Promise<void> {
        let strict = this.route?.isStrictMatch(request.url) ?? false;
        console.log(`LayerHandler:handle strict:${strict} basepath:${this.route?.getPattern()} for uri ${request.url}`);
        console.log(this.route.getPattern(), this.methods);
        if (strict) {
            if (this.handelers.length > 0) {
                await this.handelers[0].handle(request);
            }
            if (this.successor != null) {
                await this.successor.handle(request);
            }
        } else {
            for (let i = 0; i < this.handelers.length;i++){
                if (this.methods[i] == HttpMethod.ALL) {
                    return this.handelers[i].handle(request);
                }
            }
            if (this.successor!=null) {
                this.successor.handle(request);
            } else {
                throw "Not handler middleware";
            }
        }
    }

    chainHandlers() {
        if (this.handelers.length > 0) {
            for (let i = 0; i < this.handelers.length - 1; i++){
                if (this.methods[i] == HttpMethod.ALL && this.methods[i + 1] == HttpMethod.GET) {
                    let chainedSuccessor = new ChainedSuccessor(this);
                    chainedSuccessor.setGetSuccessor(this.handelers[i + 1]);
                    let search = i + 2;
                    let allSuccessor: RequestHandlerInterface;
                    for (; search < this.handelers.length;i++){
                        if (this.methods[search] == HttpMethod.ALL) {
                            break;
                        }
                    }
                    if (search < this.handelers.length) {
                        chainedSuccessor.setSuccessor(this.handelers[search]);
                    } else if(this.successor) {
                        chainedSuccessor.setSuccessor(this.successor);
                    } else {
                        throw "missing successor for layer";
                    }
                    this.handelers[i].setSuccessor(chainedSuccessor);
                } else {
                    this.handelers[i].setSuccessor(this.handelers[i + 1]);   
                }
            }
            if (this.successor != null) {
                this.handelers[this.handelers.length - 1].setSuccessor(this.successor);
            }
        }
    }

    setSuccessor(successor: RequestHandlerInterface): LayerHandler {
        this.successor = successor;
        this.chainHandlers();
        return this;
    }
    async invokeSuccessor(request: ServerRequest):Promise<void>{
         if (this.successor != null) {
            await this.successor.handle(request);
        }
    }

    getRoute() {
        return this.route;
    }
}

class ChainedSuccessor extends RequestHandler {

    handle(request: any): void {
        console.log(`callin successor ${request.method}  basepath ${this.layer?.getRoute()?.getPattern()}  url ${ request.url}  ${this.layer?.getRoute()?.isStrictMatch(request.url)}`);
        console.log(`${HttpMethod.GET}`);
        if (request.method == HttpMethod.GET && this.layer?.getRoute()?.isStrictMatch(request.url)) {
            console.log("get successor");
            if (this.getSuccessor != null) {
                this.getSuccessor.handle(request);
            } else if(this.successor!=null) {
                this.successor.handle(request);
            } else {
                throw "Error";
            }
        } else if (request.method == HttpMethod.POST && this.layer?.getRoute()?.isStrictMatch(request.url)) {
            if (this.postSuccessor != null) {
                this.postSuccessor.handle(request);
            } else if(this.successor!=null) {
                this.successor.handle(request);
            } else {
                throw "Error";
            }
        } else {
            this.successor?.handle(request);
        }
    }
    setSuccessor(successor: RequestHandlerInterface): RequestHandlerInterface {
        this.successor = successor;
        return this;
    }

    constructor(parent: LayerHandler) {
        super();
        this.layer = parent;
    }
    setGetSuccessor(successor: RequestHandlerInterface) {
        this.getSuccessor = successor;
    }

    setPostSuccessor(successor: RequestHandlerInterface) {
        this.postSuccessor = successor;
    }

    private getSuccessor?: RequestHandlerInterface;
    private postSuccessor?: RequestHandlerInterface;
    private patchSuccessor?: RequestHandlerInterface;
    private successor?: RequestHandlerInterface;
    private layer?: LayerHandler;
}

class ChainHandler extends RequestHandler {

    private isRegex: boolean = false;
    private baseRoute?: Route;
    private successor?: RequestHandlerInterface;
    private routes: Map<string, LayerHandler> = new Map();

    use(path:string, handler: RequestHandlerInterface|Function,method:HttpMethod=HttpMethod.ALL) {
        const basePath = path.split("/").slice(1, 2).join("/");
        const deepPath = "/"+path.split("/").slice(2).join("/");
        if (!this.routes.has(basePath)) {
            this.routes.set(basePath,new LayerHandler());
            // todo set base path for the layer 
        }
        // todo remove debug
        console.log(`[ChainHandler::use] basePath: ${basePath}  deepPath: ${deepPath} method: ${method}`);
        switch (method) {
            case HttpMethod.ALL:
                (this.routes.get(basePath) as LayerHandler).use(deepPath, handler)
                break;
            case HttpMethod.GET:
                (this.routes.get(basePath) as LayerHandler).get(deepPath, handler)
                break
        };
    }

    setRoute(route: Route) {
        this.baseRoute = route;
        for (let key of this.routes.keys()) {
            let deepRoute: Route = new Route(HttpMethod.ALL, key);
            deepRoute.bindToParent(this.baseRoute);
            this.routes.get(key)?.setRoute(deepRoute);
        }
    }

    handle(request: any): void {
        console.log(`MapHandler:handle paths:${[...this.routes.keys()]} basepath:${this.baseRoute?.getPattern()} for uri ${request.url}`);
        let pattern = this.baseRoute?.getPattern() ?? "";
        let key = request.url.replace(pattern, "").split("/")[0];
        console.log("found key ", request.url.replace(pattern, ""),key, " on map handler");
        let handler = this.routes.get(key) ?? this.successor;
        //console.log(handler);
        if (handler != null ) {
            handler.handle(request);
        }else {
            throw "Not handled middleware";
        }
    }
    setSuccessor(successor: RequestHandlerInterface): RequestHandlerInterface {
        this.successor = successor;
        for (let [key, value] of this.routes) {
            value.setSuccessor(successor);
        }
        return this;
    }
}


class Route {
    constructor(
        private method: HttpMethod,
        private pattern: string,
        private regex?: RegExp,
        private strictMatch?: RegExp,
        private lossyMatch?: RegExp,
        private isRegex:boolean=false
    ) {
        
    };
    
    bindToParent(parent: Route) {
        this.pattern = parent.pattern + this.pattern+"/";
        this.strictMatch = new RegExp(`^${this.pattern}$`);
        this.lossyMatch = new RegExp(`^${this.pattern}`);
    }

    isStrictMatch(uri: string) {
        console.log("checking ", this.strictMatch, "uri", uri,this.strictMatch?.test(uri)??false,this.strictMatch?.test(uri+"/")??false);
        return (this.strictMatch?.test(uri)||this.strictMatch?.test(uri+"/"))??false;
    }

    isLossyMatch(uri: string) {
        return this.lossyMatch?.test(uri)??false;
    }

    canHandle(request:ServerRequest) {
        return request.method == this.method || this.method == HttpMethod.ALL;
    }

    getPattern():string {
        return this.pattern;
    }
}


class XapiUri{
    private chunks: string[];
    constructor(chunks: string[]=[]) {
        this.chunks = chunks;
    }

    slice() {
        if(this.chunks[0]=="")
            return new XapiUri(this.chunks.slice(2));
        return new XapiUri(this.chunks.slice(1));
    }
}

