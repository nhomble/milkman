import type { Arguments } from "yargs";
import { execute, discoverMilk } from "../core/core";
import chalk from "chalk";
type Options = {
  directory: string | undefined;
};

export const command: string = "run [directory]";
export const desc: string = "run milk in [directory]";

export const handler = (argv: Arguments<Options>): Promise<any> => {
  const { directory = "." } = argv;
  const milks = discoverMilk(directory);
  return execute(milks);
};
