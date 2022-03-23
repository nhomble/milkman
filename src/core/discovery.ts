import glob from "glob";
import path from "path";
import { MilkResource } from "./core";
import { parseYamlResource } from "./parser";
import { createSchedule } from "./schedule";
import { duplicates } from "./utils";

/**
 * find names of all resources
 * @param root directory to begin search
 * @returns array of names
 */
export const discoverNames = function (
  root: string,
  environment: string
): string[] {
  const paths = createSchedule(discoverMilk(root, environment)).map(
    (res) => `${res.metadata.name}`
  );
  return paths;
};

/**
 * find paths for all discovered resources
 * @param root directory to begin search
 * @returns
 */
export const discoverResources = function (root: string): string[] {
  const p = path.resolve(root);
  const pattern = `${p}/**/*.yml`;
  return glob.sync(pattern);
};

export const discoverMilk = function (
  root: string,
  environment: string
): MilkResource[] {
  const all = discoverResources(root)
    .map((path) => {
      return parseYamlResource(path);
    })
    .filter((resource) => {
      const { environment: e = "" } = resource?.metadata?.labels;
      return e == "" || environment == "" || e == environment;
    });
  const dupes = duplicates(all.map((r) => r.metadata.name));
  if (dupes.length > 0) {
    throw new Error(`You have duplicate resources names=${dupes}`);
  }
  return all;
};
