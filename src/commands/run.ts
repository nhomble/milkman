import type { Arguments, CommandBuilder } from "yargs";
import { execute } from "../core/core";
import { discoverMilk } from "../core/discovery";
import chalk from "chalk";

type Options = {
  directory: string | undefined;
  environment: string | undefined;
  showContext: boolean;
};

export const command: string = "run [directory] [environment] [show-map]";
export const desc: string =
  "run milk in [directory] and filter optionally against [environment]";
export const builder: CommandBuilder = {
  environment: {
    demandOption: false,
  },
  showContext: {
    alias: ["show-context"],
  },
};
export const handler = (argv: Arguments<Options>): Promise<any> => {
  const { directory = "", environment = "", showContext = false } = argv;
  const milks = discoverMilk(directory, environment);
  return execute(milks).then((m) => {
    if (showContext) {
      prettyPrint(m);
    }
  });
};

const prettyPrint = function (m: Map<string, any>) {
  m.forEach((value: any, key: string) => {
    if (typeof value != "object") {
      console.log(chalk.yellow("context>"), key, chalk.yellow("--"), value);
    }
  });
};
