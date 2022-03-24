#!/usr/bin/env node

import yargs from "yargs";

import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  .demandCommand()
  .showHelpOnFail(false)
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: 'help' })
  .usage('$0 <cmd> [args]')
  .argv;