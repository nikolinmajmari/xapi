import { AuthContextInterface } from "../context/auth_context_interface.ts";

export interface StrategyInterface {
  entry(auth: AuthContextInterface): void;
}
