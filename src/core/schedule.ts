import { MilkResource } from "./core";

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
  if (ret.length != resources.length) {
    throw new Error("No path found! This means you have unsatisfied `dependsOn` from a cyclic or missing dependencies!");
  }
  return ret.map((n) => name_to_resource.get(n)!);
};
