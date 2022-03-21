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
  it("three", () => {
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
    const third = {
        metadata: {
          name: "third",
        },
        spec: {
          dependsOn: ["second"],
        },
      };
    const out = createSchedule([third, second, first]);
    expect(out).toEqual([first, second, third]);
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
      new Error("No path found! This means you have unsatisfied `dependsOn` from a cyclic or missing dependencies!")
    );
  });
});
