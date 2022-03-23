import { glob } from "glob";
import { load } from "js-yaml";
import * as fs from "fs";
import { MilkResource } from "./core";
export const parseYamlResource = function (path: string): MilkResource {
  const data = fs.readFileSync(path, "utf8");
  const resource = load(data) as MilkResource;

  if (!resource.apiVersion) {
    throw new Error(`${path} does not have apiVersion defined`);
  }
  if (!resource.metadata.name) {
    throw new Error(`${path} does not have metadata.name defined`);
  }
  if (!resource.kind) {
    throw new Error(`${path} does not have kind defined`);
  }

  resource.metadata.labels = resource.metadata.labels || new Map<string, any>();
  resource.metadata.path = path;
  return resource;
};
