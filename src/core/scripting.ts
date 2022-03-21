import chalk from "chalk";
import { MilkResource } from "./core";

export const newScriptingConsole = function (resource: MilkResource) {
  return {
    log: function (s: object) {
      console.log(`${chalk.blueBright(resource.metadata.name + ">")}`, s);
    },
    warn: function (s: object) {
      console.log(`${chalk.yellowBright(resource.metadata.name + ">")}`, s);
    },
    error: function (s: object) {
      console.log(`${chalk.redBright(resource.metadata.name + ">")}`, s);
    },
  };
};
