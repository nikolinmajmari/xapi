import { HttpContext, HttpContextInterface, Response } from "../http/http.lib";

export interface SecurityContextInterface {
  user: UserInterface;
  getUser();
  isGranted(role: string | string[]): boolean;
}

class SecurityContext extends HttpContext implements SecurityContextInterface {
  user: UserInterface;
  getUser() {
    return this.user;
  }

  isGranted(role: string | string[]): boolean {
    if (typeof role == "string") {
      return this.user.roles.includes(role);
    }
    for (let r of role) {
      if (this.user.roles.includes(r)) {
        return true;
      }
    }
    return false;
  }
}

export interface UserInterface {
  id: number;
  roles: string[];
  getId();
  getIdentifier(): any;
}

class AccessDeniedException {
  message: string;
  context: SecurityContext;

  toString() {
    return `${this.message} ${this.context.user}`;
  }
}
