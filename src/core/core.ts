import { glob } from "glob";
import { load } from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

/**
 * find names of all resources
 * @param root directory to begin search
 * @returns array of names
 */
export const discoverNames = function (root: string): string[] {
  const paths = discoverMilk(root).map((res) => res.metadata.name);
  return paths;
};

export type MilkMetadata = {
  name: string;
  labels: Map<String, String>;
};

export type MilkResource = {
  apiVersion: "milk/alphav1";
  metadata: MilkMetadata;
  kind: "Request" | "Script";
  spec: RequestSpec | ScriptSpec;
};

export type ScriptSpec = {};

export type RequestSpec = {
  scheme: "http" | "htt[s";
  host: string;
  route: string;
  method: "GET" | "POST";
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

export const discoverMilk = function (root: string): MilkResource[] {
  return discoverResources(root).map((path) => {
    return parseYamlResource(path);
  });
};

const parseYamlResource = function (path: string): MilkResource {
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

  return resource;
};

export const execute = function (resources: MilkResource[]): void {
  const context = executeWithContext(resources, new Map<string, any>());
  console.log(context);
};

const executeWithContext = function (
  resources: MilkResource[],
  context: Map<string, object>
): Map<string, object> {
  resources.forEach((resource) => {
    switch (resource.kind) {
      case "Request":
        context = executeRequest(resource, context);
      default:
    }
  });
  return context;
};

export const executeRequest = function (
  resource: MilkResource,
  context: Map<string, any>
): Map<string, any> {
  const spec = resource.spec as RequestSpec;
  const uri = `${spec.scheme}://${spec.host}${spec.route}`;
  switch (spec.method) {
    case "GET":
      axios.get(uri).then((response) => {
        context.set("response", response);
        context.set("status", response.status);
      });
      break;
  }
  return context;
};
