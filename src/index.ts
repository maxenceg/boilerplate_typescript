import { PAYMENTS } from "./stub_test";
import { Category, Payment } from "./types";

class PaymentServiceMock {
  public getAll(): Payment[] {
    return PAYMENTS;
  }
}

const paymentServiceMock = new PaymentServiceMock();

export function fetchUserPayments(userId: number): {
  currentMonthPayments: Payment[];
  lastMonthPayments: Payment[];
} {
  const payments = paymentServiceMock.getAll();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  return {
    currentMonthPayments: payments.filter(
      ({ userId: paymentUserId, date }) =>
        paymentUserId === userId &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
    ),
    lastMonthPayments: payments.filter(
      ({ userId: paymentUserId, date }) =>
        paymentUserId === userId &&
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
    ),
  };
}

type CategoryExpense = {
  category: Category;
  totalAmount: number;
};

// Note: this function coud be tested independently
function getAmountSpentByCategory(payments: Payment[]): CategoryExpense[] {
  return payments.reduce<CategoryExpense[]>((acc, payment) => {
    const { category, price } = payment;

    const existingCategory = acc.find(
      (categoryExpense) => categoryExpense.category === category
    );

    if (!existingCategory) {
      return [...acc, { category, totalAmount: price }];
    }

    return acc.map((categoryExpense) => {
      if (categoryExpense.category === category) {
        return {
          ...categoryExpense,
          totalAMount: categoryExpense.totalAmount + price,
        };
      }

      return categoryExpense;
    });
  }, []);
}

export function compareUserConsumption({
  userId,
}: {
  userId: number;
}): CategoryExpense[] {
  const { currentMonthPayments, lastMonthPayments } = fetchUserPayments(userId);

  const spentAmountCurrentMonth =
    getAmountSpentByCategory(currentMonthPayments);
  const spentAmountLastMonth = getAmountSpentByCategory(lastMonthPayments);

  return spentAmountCurrentMonth.filter((categoryExpense) => {
    const { category, totalAmount } = categoryExpense;
    const lastMonthExpense = spentAmountLastMonth.find(
      (lastMonthCategoryExpense) =>
        lastMonthCategoryExpense.category === category
    );

    return (
      !lastMonthExpense || totalAmount > 1.5 * lastMonthExpense.totalAmount
    );
  });
}

export function composeExceedingExpensesEmail({
  userId,
}: {
  userId: number;
}): string | null {
  const exceedingExpenses = compareUserConsumption({ userId });

  if (!exceedingExpenses.length) {
    return null;
  }

  const message = `Hello card user!

We have detected unusually high spending on your card in these categories:

${exceedingExpenses
  .map(
    ({ category, totalAmount }) => `* You spent $${totalAmount} on ${category}`
  )
  .join("\n")}

Love,

The Credit Card Company`;

  return message;
}
