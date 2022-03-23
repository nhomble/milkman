import type { Arguments, CommandBuilder } from "yargs";
import { execute } from "../core/core";
import { discoverMilk } from "../core/discovery";
type Options = {
  directory: string | undefined;
  environment: string | undefined;
};

export const command: string = "run [directory] [environment]";
export const desc: string =
  "run milk in [directory] and filter optionally against [environment]";
export const builder: CommandBuilder = {
  environment: {
    demandOption: false,
  },
};
export const handler = (argv: Arguments<Options>): Promise<any> => {
  const { directory = "", environment = "" } = argv;
  const milks = discoverMilk(directory, environment);
  return execute(milks);
};
