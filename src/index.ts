import { PAYMENTS } from "./stub_test";
import { Payment } from "./types";

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
