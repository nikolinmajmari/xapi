import { HttpContext, HttpContextInterface } from "../http/http.lib.ts";
import { getCookies, HttpCookie, setCookie } from "./cookie.ts";

const SESSION_ID_KEY = "xapi_session_id";
import { ServerRequest } from "https://deno.land/std@0.105.0/http/server.ts";
import { SessionAdapterInterface } from "./adapter.ts";

var session: Session<SessionAdapterInterface>;

var generator = (old = null) => {
  return "_" + Math.random().toString(36).substr(2, 36);
};

export interface SessionContextInterface extends HttpContextInterface {
  session?: RequestSession;
}

class SessionContext extends HttpContext implements SessionContextInterface {
  session?: RequestSession;
  static createSession<T extends SessionAdapterInterface>(
    params: { secret: string; adapter: T; lifetime: number },
  ) {
    session = new Session<T>(params);
    return (ctx: SessionContext, next: Function) => {
      let sessionId = null;
      let cookies = getCookies((ctx as HttpContext).request);
      sessionId = cookies.secret;
      if (sessionId == undefined || session == null) {
        sessionId = generator();
        let cookie: HttpCookie = new HttpCookie("secret", sessionId);
        setCookie((ctx as HttpContextInterface).response, cookie);
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

class RequestSession implements SessionInterface {
  private sessionId: string;
  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }
  get(key: string): string | null {
    return session.get(this.sessionId + key);
  }
  set(key: string, value: string): void {
    return session.set(this.sessionId + key, value);
  }
  getSessionId() {
    return this.sessionId;
  }
}

export interface SessionInterface {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export default SessionContext.createSession;
