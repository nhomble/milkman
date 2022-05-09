import { it, describe } from "@jest/globals";
import { templateRequest, templateString } from "./templating";

describe("against strings", () => {
  const m = {
    key: "value",
  };
  it("just template", () => {
    expect(templateString("{{key}}", m)).toBe("value");
  });
  it("no template", () => {
    expect(templateString("hey")).toBe("hey");
  });
  it("empty", () => {
    expect(templateString("")).toBe("");
  });
  it("undefined", () => {
    expect(templateString(undefined)).toBe("");
  });
});

describe("request", () => {
  const req = {
    method: "{{method}}",
  };
  it("method", () => {
    expect(templateRequest(req, { method: "GET" }).method).toBe("GET");
  });
  it("no template", () => {
    expect(templateRequest({ method: "GET", url: "/foo" }, {})).toEqual({
      method: "GET",
      url: "/foo",
      data: "",
      headers: {},
    });
  });
});
