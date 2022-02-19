import AuthenticationManager from "./core/authentication_manager.ts";
import { AuthenticationManagerInterface } from "./core/authentication_manager_interface.ts";
import { SessionStrategy } from "./strategy/session_strategy.ts";

interface JsonStrategyParams {
  key: string;
}
export default class Authentication {
  static sessionStrategy(
    params: JsonStrategyParams,
  ): AuthenticationManagerInterface {
    return new AuthenticationManager(
      new SessionStrategy(params.key),
      params.key,
    );
  }
}
