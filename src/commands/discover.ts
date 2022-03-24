import type { Arguments, CommandBuilder } from "yargs";
import { execute } from "../core/core";
import { discoverMilk, discoverNames } from "../core/discovery";
type Options = {
  directory: string | undefined;
  environment: string | undefined;
};

export const command: string = "discover [directory] [environment]";
export const desc: string =
  "discover milk resources in [directory] and filter optionally against [environment]";
export const builder: CommandBuilder = {
  environment: {
    demandOption: false,
  },
};
export const handler = (argv: Arguments<Options>) => {
  const { directory = "", environment = "" } = argv;
  const milks = discoverNames(directory, environment);
  console.log(milks);
};
