import { glob } from "glob";
import { load } from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import chalk from "chalk";

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

export const createSchedule = function (
  resources: MilkResource[]
): MilkResource[] {
  const name_to_resource = new Map<string, MilkResource>();

  const all_names = resources.map((resource) => {
    const n = resource.metadata.name;
    name_to_resource.set(n, resource);
    return n;
  });
  const graph = new Map<string, string[]>();
  const in_degrees = new Map<string, number>();
  // init the data structures
  all_names.forEach((name) => {
    graph.set(name, []);
    in_degrees.set(name, 0);
  });

  // dependency graph
  resources.forEach((resource) => {
    const dependsOn = resource.spec.dependsOn || [];
    const name = resource.metadata.name;
    dependsOn.forEach((dependency) => {
      // update edges
      const all_deps = graph.get(dependency) || [];
      all_deps?.push(name);
      graph.set(dependency, all_deps);

      // edges are directional, keep track of indegrees to a node
      // for every dependency from `dependsOn` the current resource
      // `name` must increment the indegree
      in_degrees.set(name, (in_degrees.get(name) || 0) + 1);
    });
  });

  // bfs respecting indegree

  const ret: string[] = [];
  const working: string[] = [];
  in_degrees.forEach((value, key) => {
    if (value == 0) {
      working.push(key);
    }
  });
  while (working.length > 0) {
    const curr = working.shift()!;
    ret.push(curr);

    const children = graph.get(curr)!;
    children.forEach((child) => {
      const i = in_degrees.get(child)!;
      in_degrees.set(child, i - 1);

      if (i - 1 == 0 && ret.indexOf(child) == -1) {
        working.push(child);
      }
    });
  }
  return ret.map((n) => name_to_resource.get(n)!);
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
