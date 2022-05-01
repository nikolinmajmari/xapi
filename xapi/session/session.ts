import {Context, ContextInterface} from "../app/mod.ts";
import {getCookies, HttpCookie, setCookie} from "./cookie.ts";
import {SessionAdapterInterface} from "./adapter.ts";
import {FunctionHandler} from "../app/lib/router.ts";

const SESSION_ID_KEY = "xapi_session_id";

const generator = (_old = null) => {
  return "_" + Math.random().toString(36);
};

export class SessionProvider {
  #adapter: SessionAdapterInterface;
  #secret: string;
  constructor(config: {
    adapter: SessionAdapterInterface;
    lifetime: number;
    secret: string;
  }) {
    this.#adapter = config.adapter;
    this.#secret = config.secret;
  }

  of(ctx: ContextInterface): RequestSession | undefined {
    return (ctx as unknown as SessionContext).session;
  }

  inject(): FunctionHandler {
    return async (ctx, next) => {
      try {
        const cookies = getCookies(ctx.req);
        let sessionId: string | undefined = cookies[SESSION_ID_KEY];
        if (sessionId == undefined) {
          sessionId = generator();
        }
        console.log("sessionid", sessionId);
        (ctx as SessionContext).session = new RequestSession(
          this.#adapter,
          sessionId
        );
        setCookie(ctx.res, new HttpCookie(SESSION_ID_KEY, sessionId));
      } catch (e) {
        console.log("session could not be injected", e.toString());
      }
      await next();
    };
  }
}

export class RequestSession {
  #adapter: SessionAdapterInterface;
  #id: string;
  #store: {[key:string]:string}|undefined = undefined;
  get id(): string {
    return this.#id;
  }
  constructor(adapter: SessionAdapterInterface, id: string) {
    this.#adapter = adapter;
    this.#id = id;
  }

  async initializeStore():Promise<void> {
    if (this.#store == undefined) {
      const sessionStr  = await this.#adapter.load(this.#id);
      if(sessionStr!=""){
        this.#store = JSON.parse(sessionStr??"");
      }else{
        this.#store = {};
      }
    }
  }

  async set(key: string, value: string, flush: boolean = false): Promise<void> {
    await this.initializeStore();
    console.log("the store",this.#store)
    this.#store![key] = value;
    if (flush) {
      this.flush();
    }
  }

  async clear(key:string,flush = false):Promise<void>{
    await this.initializeStore();
    if(Object.prototype.hasOwnProperty.call(this.#store!,key)){
      delete this.#store![key];
    }
    if (flush) {
      this.flush();
    }
  }

  async get(key: string): Promise<any> {
    await this.initializeStore();
    return this.#store![key];
  }

  async flush() {
    await this.#adapter.store(this.#id, JSON.stringify(this.#store));
  }
}

export class SessionContext extends Context {
  session: RequestSession | undefined;
}
