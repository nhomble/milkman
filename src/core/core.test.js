import { it } from "@jest/globals";
import { describe } from "yargs";
import { discoverMilk, discoverNames, execute } from "./core";

describe("discovery", () => {
  it("find all examples", () => {
    const all = discoverNames("./examples");
    expect(all).toEqual(["hello"]);
  });
});
