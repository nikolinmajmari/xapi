export interface IXapiConfg {
  serverName: string;
  port: number;
  env: AppEnv;
  logPath: string;
  sessionPath: string;
}

export type AppEnv = "prod" | "dev";

export default {
  logPath: "/var/log",
  port: 8000,
  serverName: "localhost",
  env: "prod",
  sessionPath: "/var/session",
} as IXapiConfg;
