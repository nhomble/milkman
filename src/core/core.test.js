import { it, describe } from "@jest/globals";
import { discoverMilk, discoverNames, execute } from "./core";

describe("discovery", () => {
  it("find all examples", () => {
    const all = discoverNames("./examples");
    expect(all).toEqual(["hello", "hello-2", "hello-3", "hello-4"]);
  });
  it("find subset of examples", () => {
    const all = discoverNames("./examples/a-request");
    expect(all).toEqual(["hello"]);
  });
});

describe("run", () => {
  it("200 from google.com", async () => {
    const milks = discoverMilk("./examples/a-request");
    const context = execute(milks);
    const c = await context;
    expect(c.get("status")).toBe(200);
  });
});
