import chalk from "chalk";
import { MilkResource } from "./core";

export const newScriptingConsole = function (resource: MilkResource, indents: number = 0) {
  const tabs = "\t".repeat(indents);
  return {
    log: function (s: object | string) {
      console.log(`${tabs}${chalk.blueBright(resource.metadata.name + ">")}`, s);
    },
    warn: function (s: object | string) {
      console.log(`${tabs}${chalk.yellowBright(resource.metadata.name + ">")}`, s);
    },
    error: function (s: object | string) {
      console.log(`${tabs}${chalk.redBright(resource.metadata.name + ">")}`, s);
    },
  };
};

export const tester = function (console: any): any {
  return function (predicate: boolean, message?: string) {
    const msg = message || "";
    if (!predicate) {
      console.error(chalk.redBright(msg));
    } else {
      console.log(chalk.greenBright(msg));
    }
  };
};
