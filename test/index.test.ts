import { compareUserConsumption } from "../src";

describe("compare user consumption", () => {
  test("compareUserConsumption should return empty categories for unexisting user", () => {
    const result = compareUserConsumption({ userId: 404 });

    expect(result).toEqual([]);
  });
});
