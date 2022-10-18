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

  // TODO: This test is dangerous because the order of categories is important
  // We could check the string contains (.toContain()) the expected categories
  // and not to contain the other categories
  test("should not send email for excessive consumption", () => {
    const email = composeExceedingExpensesEmail({ userId: 1 });

    expect(email).toBe(`Hello card user!

We have detected unusually high spending on your card in these categories:

* You spent $90 on Restaurants
* You spent $90 on Golf

Love,

The Credit Card Company`);
  });
});
