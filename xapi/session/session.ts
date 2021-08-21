import { HttpContext } from "../http/http.lib.ts";
import {
  Cookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.105.0/http/cookie.ts";

const SESSION_ID_KEY = "xapi_session_id";
import { HttpCookie } from "./cookie.ts";
import { ServerRequest } from "https://deno.land/std@0.105.0/http/server.ts";
import { SessionAdapterInterface } from "./adapter";

var session: Session<SessionAdapterInterface>;

var generator = (old = null) => {
  return "_" + Math.random().toString(36).substr(2, 36);
};

export class SessionContext extends HttpContext {
  session?: RequestSession;
  static createSession<T extends SessionAdapterInterface>(
    params: { secret: string; adapter: T; lifetime: number },
  ) {
    session = new Session<T>(params);
    console.log("initialize session");
    return (ctx: SessionContext, next: Function) => {
      let sessionId = null;
      let cookies = getCookies(ctx.request);
      sessionId = cookies.secret;
      if (sessionId == undefined || session == null) {
        sessionId = generator();
        let cookie: HttpCookie = new HttpCookie("secret", sessionId);
        console.log(cookie);
        setCookie(ctx.response, cookie);
      }
      ctx.session = new RequestSession(sessionId);
      next();
    };
  }
}

class Session<T extends SessionAdapterInterface> {
  private secret?: string = SESSION_ID_KEY;
  private adapter?: T;
  private lifetime?: number = 1000;
  constructor(params: { secret: string; adapter: T; lifetime: number }) {
    this.secret = params.secret;
    this.adapter = params.adapter;
    this.lifetime = params.lifetime;
  }
  get(key: string): string | null {
    return this.adapter?.load(key) ?? null;
  }
  set(key: string, value: string): void {
    return this.adapter?.store(key, value);
  }
}

export class RequestSession {
  private sessionId: string;
  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }
  get(key: string): string | null {
    return session.get(this.sessionId + key);
  }
  set(key: string, value: string) {
    return session.set(this.sessionId + key, value);
  }
}

export default SessionContext.createSession;
