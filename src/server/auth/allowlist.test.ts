import { describe, expect, it } from "vitest";
import { isAllowedAdmin } from "./allowlist";

describe("isAllowedAdmin", () => {
  it("accepts the allowlisted id as string or number", () => {
    expect(isAllowedAdmin("12345", "12345")).toBe(true);
    expect(isAllowedAdmin(12345, "12345")).toBe(true);
    expect(isAllowedAdmin(12345, " 12345 ")).toBe(true);
  });

  it("rejects any other id", () => {
    expect(isAllowedAdmin("99999", "12345")).toBe(false);
    expect(isAllowedAdmin("123456", "12345")).toBe(false);
  });

  it("fails closed when no admin is configured", () => {
    expect(isAllowedAdmin("12345", undefined)).toBe(false);
    expect(isAllowedAdmin("12345", "")).toBe(false);
    expect(isAllowedAdmin("", "")).toBe(false);
  });

  it("rejects missing or non-scalar ids", () => {
    expect(isAllowedAdmin(undefined, "12345")).toBe(false);
    expect(isAllowedAdmin(null, "12345")).toBe(false);
    expect(isAllowedAdmin({ id: "12345" }, "12345")).toBe(false);
  });
});
