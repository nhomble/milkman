import type { Arguments } from "yargs";
import { discoverNames } from "../core/core";
import chalk from "chalk";
type Options = {
  directory: string | undefined;
  environment: string | undefined;
};

export const command: string = "discover [directory] --environment [environment]";
export const desc: string =
  "discover milk in [directory] with optional [environment] filter";

export const handler = (argv: Arguments<Options>): void => {
  const { directory = "", environment = "" } = argv
  const milks = discoverNames(directory, environment);
  const msg = `${milks.join("\n")}`;
  console.log(chalk.green(msg));
};
