import { HttpContext, HttpContextInterface, Response } from "../http/http.lib";

interface SecurityContextInterface {
  user: UserInterface;
  getUser();
}

class SecurityContext implements SecurityContextInterface {
  user: UserInterface;
  getUser() {
    throw new Error("Method not implemented.");
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
  request: any;
  response: Response;
}

interface UserInterface {
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
