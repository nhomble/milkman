import type { Arguments } from "yargs";
import { discoverNames } from "../core/core";
import chalk from "chalk";
type Options = {
  directory: string | undefined;
};

export const command: string = "discover [directory]";
export const desc: string = "discover milk in [directory]";

export const handler = (argv: Arguments<Options>): void => {
  const { directory = "." } = argv;
  const milks = discoverNames(directory);
  const msg = `${milks.join('\n')}`;
  console.log(chalk.green(msg));
};
