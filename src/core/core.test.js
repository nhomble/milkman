import { it, describe } from "@jest/globals";
import { discoverMilk, discoverNames, execute } from "./core";

describe("discovery", () => {
  it("find all google examples", () => {
    const all = discoverNames("./examples/google");
    expect(all).toEqual(["hello", "log"]);
  });
  it("find subset of google examples", () => {
    const all = discoverNames("./examples/google/subset");
    expect(all).toEqual(["hello"]);
  });
});

describe("run", () => {
  it("200 from google.com", async () => {
    const milks = discoverMilk("./examples/google");
    const context = execute(milks);
    const c = await context;
    expect(c.get("status")).toBe(200);
  });
});
