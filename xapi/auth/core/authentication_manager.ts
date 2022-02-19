import { AuthenticationManagerInterface } from "./authentication_manager_interface.ts";
import { Auth } from "./context/auth.ts";
import { AuthContextInterface } from "./context/auth_context_interface.ts";
import UserInterface from "./credentials/user_interface.ts";
import { StateFullStrategy } from "./strategy/statefull_strategy.ts";
import { StrategyInterface } from "./strategy/strategy_interface.ts";

export default class AuthenticationManager
  implements AuthenticationManagerInterface {
  constructor(
    private strategy: StrategyInterface,
    private key: string,
  ) {}
  middleware(): (ctx: AuthContextInterface, next: Function) => void {
    return (ctx: AuthContextInterface, next: Function) => {
      console.log("silent authentication");
      if (this.strategy instanceof StateFullStrategy) {
        const token = this.strategy.load(ctx);
        ctx.auth = new Auth(token, this);
      }
      next();
    };
  }
  ensureAuthenticated(): (ctx: AuthContextInterface, next: Function) => void {
    return (ctx: AuthContextInterface, next: Function) => {
      console.log("ensure is authenticatied");
      next();
    };
  }
  ensureHasAttribute(): (ctx: AuthContextInterface, next: Function) => void {
    return (ctx: AuthContextInterface, next: Function) => {
      console.log("rnsure has attribute, authorization");
      next();
    };
  }
  authenticate(
    _user: UserInterface,
  ): (ctx: AuthContextInterface, next: Function) => void {
    return (ctx: AuthContextInterface, next: Function) => {
      console.log("authenticate request and return response");
      next();
    };
  }
}
