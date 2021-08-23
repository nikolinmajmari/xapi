import { HttpContextInterface } from "../http/http.lib";
import { SecurityContextInterface } from "./security";
import { SessionContextInterface, SessionInterface } from "../session/session";
import { ParamParser } from "../router/router.lib";

interface AuthenticatorInterface {
  authenticate(a: any);
  ensureAuthentication();
}

export class SessionPassport implements AuthenticatorInterface {
  private property: string;
  private loadUserByToken;
  private serializeUser;
  private loadUserByCredentials;
  constructor(params: {
    property: string;
    loadUserByToken: Function;
    serializeUser: Function;
    loadUserByCredentials: Function;
  }) {
    this.property = params.property;
    this.loadUserByToken = params.loadUserByToken;
    this.serializeUser = params.serializeUser;
    this.loadUserByCredentials = params.loadUserByCredentials;
  }

  authenticate(params: {
    credentialParser: Function | undefined;
    successRedirect: string;
    failureRedirect: string | undefined;
  }) {
    return (
      ctx: SecurityContextInterface | HttpContextInterface | SessionInterface,
      next: Function,
    ) => {
      let credentials: any;
      if (params.credentialParser != undefined) {
        credentials = params.credentialParser(
          (ctx as HttpContextInterface).request,
        );
      } else {
        credentials = {};
        credentials[this.property] =
          (ctx as HttpContextInterface).request.body[this.property];
        credentials["password"] =
          (ctx as HttpContextInterface).request.body["password"];
      }
      if (credentials) {
        let user = this.loadUserByCredentials(credentials);
        if (user) {
          (ctx as SessionInterface).set(
            "_security_main",
            this.serializeUser(user),
          );
          (ctx as HttpContextInterface).response.send(
            "success for " + params.successRedirect,
          );
        }
      }
      (ctx as HttpContextInterface).response.send(
        "failure for " + params.failureRedirect,
      );
    };
  }

  ensureAuthentication() {
    return (
      ctx:
        | SecurityContextInterface
        | HttpContextInterface
        | SessionContextInterface,
      next: Function,
    ) => {
      let token = (ctx as SessionContextInterface).session?.get(
        "_security_main",
      );
      if (token != null || token != undefined) {
        let user = this.loadUserByToken(token);
        if (user) {
          (ctx as SecurityContextInterface).user = user;
          next();
        }
      }
      (ctx as HttpContextInterface).request.respond({ status: 404 });
    };
  }

  passportSessionParser() {
    return (
      ctx: SecurityContextInterface | HttpContextInterface,
      next: Function,
    ) => {
      let token = (ctx as SessionContextInterface).session?.get(
        "_security_main",
      );
      if (token != null || token != undefined) {
        let user = this.loadUserByToken(token);
        if (user) {
          (ctx as SecurityContextInterface).user = user;
        }
      }
      next();
    };
  }
}
