import { it, describe } from "@jest/globals";
import { duplicates } from "./utils";

describe("dupes tests", () => {
  it("empty array", () => {
    expect(duplicates([])).toEqual([]);
  });
  it("singleton", () => {
    expect(duplicates(["a"])).toEqual([]);
  });
  it("unique", () => {
    expect(duplicates(["a", "b"])).toEqual([]);
  });
  it("all dupes", () => {
    expect(duplicates(["a", "a", "a"])).toEqual(["a"]);
  });
  it("some dupes", () => {
    expect(duplicates(["a", "a", "b"])).toEqual(["a"]);
  });
});
