import { AuthenticationManagerInterface } from "../authentication_manager_interface.ts";
import TokenInterface from "../credentials/token_interface.ts";
import UserInterface from "../credentials/user_interface.ts";

export class Auth {
  private token: TokenInterface | undefined;
  private manager: AuthenticationManagerInterface;
  constructor(
    token: TokenInterface | undefined,
    manager: AuthenticationManagerInterface,
  ) {
    this.token = token;
    this.manager = manager;
  }

  getUser() {
    return this.token?.getUser();
  }
  getBadges() {
    return this.token?.getBadges();
  }
  getToken() {
    return this.token;
  }
  getManager() {
    return this.manager;
  }
  isAuthenticated() {
    return this.token != undefined;
  }
}
