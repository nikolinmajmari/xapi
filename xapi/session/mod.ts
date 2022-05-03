import {RequestSession, SessionContext} from "./session.ts";

export {FileAdapter} from "./file_adapter.ts";
export {InMemorySessionAdapter} from "./adapter.ts";
export {HttpCookie, getCookies, setCookie} from "./cookie.ts";

export {RequestSession, SessionProvider, SessionContext} from "./session.ts";

const session = (ctx: any): RequestSession | undefined => {
  return (ctx as SessionContext).session;
};

export {session};
