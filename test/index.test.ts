import { compareUserConsumption, composeExceedingExpensesEmail } from "../src";

describe("compare user consumption", () => {
  test("compareUserConsumption should return empty categories for unexisting user", () => {
    const result = compareUserConsumption({ userId: 404 });

    expect(result).toEqual([]);
  });

  test("compareUserConsumption should return empty categories", () => {
    const result = compareUserConsumption({ userId: 1 });

    expect(result).toEqual([
      {
        category: "Restaurants",
        totalAmount: 90,
      },
      {
        category: "Golf",
        totalAmount: 90,
      },
    ]);
  });
});

describe("compose exceeding expenses email", () => {
  test("should not send email for normal consumption", () => {
    const email = composeExceedingExpensesEmail({ userId: 3 });

    expect(email).toEqual(null);
  });
});
