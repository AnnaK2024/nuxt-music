import { describe, it, expect } from "vitest";
import { formatTime} from "../time";

describe("formatTime", () => {
  it("форматирует секунды в mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(3599)).toBe("59:59");
  });
});