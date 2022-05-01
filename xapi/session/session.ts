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
  #store: any = undefined;
  get id(): string {
    return this.#id;
  }
  constructor(adapter: SessionAdapterInterface, id: string) {
    this.#adapter = adapter;
    this.#id = id;
  }

  async set(key: string, value: string, flush: boolean = false): Promise<void> {
    if (this.#store == undefined) {
      this.#store = await this.#adapter.load(this.#id);
    }
    this.#store[key] = value;
    if (flush) {
      this.flush();
    }
  }

  async clear(key:string,flush = false):Promise<void>{
    if (this.#store == undefined) {
      this.#store = await this.#adapter.load(this.#id);
    }
    delete this.#store[key];
    if (flush) {
      this.flush();
    }
  }

  async get(key: string): Promise<any> {
    if (this.#store == undefined) {
      let str = await this.#adapter.load(this.#id);
      if (str == "") {
        str = "{}";
      }
      console.log("to json", str);
      this.#store = JSON.parse(str ?? "{}");
    }
    return this.#store[key];
  }

  async flush() {
    await this.#adapter.store(this.#id, JSON.stringify(this.#store));
  }
}

export class SessionContext extends Context {
  session: RequestSession | undefined;
}
