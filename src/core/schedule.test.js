import { it, describe } from "@jest/globals";
import { createSchedule } from "./schedule";

describe("schedule", () => {
  it("empty", () => {
    const out = createSchedule([]);
    expect(out).toEqual([]);
  });
  it("singleton", () => {
    const single = {
      metadata: {
        name: "single",
      },
      spec: {
        dependsOn: [],
      },
    };
    const out = createSchedule([single]);
    expect(out).toEqual([single]);
  });
  it("two", () => {
    const first = {
      metadata: {
        name: "first",
      },
      spec: {
        dependsOn: [],
      },
    };
    const second = {
      metadata: {
        name: "second",
      },
      spec: {
        dependsOn: ["first"],
      },
    };
    const out = createSchedule([second, first]);
    expect(out).toEqual([first, second]);
  });
  it("deadlock", () => {
    const first = {
      metadata: {
        name: "first",
      },
      spec: {
        dependsOn: ["second"],
      },
    };
    const second = {
      metadata: {
        name: "second",
      },
      spec: {
        dependsOn: ["first"],
      },
    };
    expect(() => createSchedule([second, first])).toThrow(
      new Error("Detected a cyclic dependency!")
    );
  });
});
