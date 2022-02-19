import { HttpContextInterface } from "../../../http/http.lib.ts";
import { Auth } from "./auth.ts";

export interface AuthContextInterface extends HttpContextInterface {
  auth: Auth;
}
