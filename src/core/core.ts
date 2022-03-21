import { glob } from "glob";
import { load } from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import chalk from "chalk";
import { createSchedule } from "./schedule";

/**
 * find names of all resources
 * @param root directory to begin search
 * @returns array of names
 */
export const discoverNames = function (root: string): string[] {
  const paths = createSchedule(discoverMilk(root)).map(
    (res) => `${res.metadata.name}`
  );
  return paths;
};

export type MilkMetadata = {
  name: string;
  path: string;
  labels: Map<String, String>;
};

export type MilkResource = {
  apiVersion: "milk/alphav1";
  metadata: MilkMetadata;
  kind: "Request" | "Script";
  spec: RequestSpec | ScriptSpec;
};

export type ScriptSpec = {
  dependsOn: string[];
  script: string;
};

export type RequestSpec = {
  scheme: "http" | "https";
  host: string;
  route: string;
  method: "GET" | "POST";
  dependsOn: string[];
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
  // TODO check for dupe names
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

  resource.metadata.path = path;
  return resource;
};

export const execute = async function (
  resources: MilkResource[]
): Promise<Map<String, any>> {
  const m = new Map<string, any>();
  await executeWithContext(resources, m);
  return m;
};

const executeWithContext = function (
  resources: MilkResource[],
  context: Map<string, any>
): Promise<any> {
  const asyncs: CallableFunction[] = createSchedule(resources).map(
    (resource) => {
      switch (resource.kind) {
        case "Request":
          return async () => {
            return executeRequest(resource, context);
          };
        case "Script":
          return async () => {
            executeScript(resource, context);
          };
      }
    }
  );
  return asyncs.reduce(
    (promise, func) =>
      promise.then(() =>
        func()
      ),
    Promise.resolve()
  );
};

export const executeScript = function (
  resource: MilkResource,
  context: Map<string, any>
): Promise<any> {
  const spec = resource.spec as ScriptSpec;
  const newConsole = {
    log: function (s: object) {
      console.log(`${chalk.blueBright(resource.metadata.name + ">")}`, s);
    },
    warn: function (s: object) {
      console.log(`${chalk.yellowBright(resource.metadata.name + ">")}`, s);
    },
    error: function (s: object) {
      console.log(`${chalk.redBright(resource.metadata.name + ">")}`, s);
    },
  };
  Function("context", "console", spec.script)(context, newConsole);
  return Promise.resolve(context);
};

export const executeRequest = async function (
  resource: MilkResource,
  context: Map<string, any>
): Promise<any> {
  const spec = resource.spec as RequestSpec;
  const uri = `${spec.scheme}://${spec.host}${spec.route}`;
  switch (spec.method) {
    case "GET":
      return axios.get(uri).then((response) => {
        context.set("response", response);
        context.set("status", response.status);
      });
  }
  return context;
};
