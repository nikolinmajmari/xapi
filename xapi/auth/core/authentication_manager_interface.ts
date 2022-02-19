import { AuthContextInterface } from "./context/auth_context_interface.ts";
import UserInterface from "./credentials/user_interface.ts";

export interface AuthenticationManagerInterface {
  middleware(): (ctx: AuthContextInterface, next: Function) => void;
  ensureAuthenticated(): (ctx: AuthContextInterface, next: Function) => void;
  ensureHasAttribute(): (ctx: AuthContextInterface, next: Function) => void;
  authenticate(
    user: UserInterface,
  ): (ctx: AuthContextInterface, next: Function) => void;
}
