import { it, describe } from "@jest/globals";
import { discoverMilk, discoverNames, execute } from "./core";

describe("discovery", () => {
  it("find all examples", () => {
    const all = discoverNames("./examples/a-request");
    expect(all).toEqual(["hello"]);
  });
});
