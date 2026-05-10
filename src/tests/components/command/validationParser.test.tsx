import { describe, it, expect } from "vitest";
import {
  isValidNodeLabel,
  isValidNodeId
} from "../../../components/command/validationParser";

describe("isValidNodeLabel", () => {
  it("accepts a correctly-prefixed label", () => {
    expect(isValidNodeLabel("n/Web Server")).toBe(true);
  });
 
  it("rejects a label that does not start with n/", () => {
    expect(isValidNodeLabel("Internet")).toBe(false);
  });
 
  it("rejects an empty string", () => {
    expect(isValidNodeLabel("")).toBe(false);
  });
});
 
describe("isValidNodeId", () => {
  it("accepts a correctly-prefixed id", () => {
    expect(isValidNodeId("n#67")).toBe(true);
  });
 
  it("rejects an id that does not start with n#", () => {
    expect(isValidNodeId("n/67")).toBe(false);
  });
 
  it("rejects an id that does not contain a number after n#", () => {
    expect(isValidNodeId("n#hello")).toBe(false);
  });
 
  it("rejects an empty string", () => {
    expect(isValidNodeId("")).toBe(false);
  });
});
