import type { Student } from "./types";

export interface BillData {
  name: string;
  phone: string;
  monthlyFee: number;
  paidAmount: number;
}

export const sendWhatsAppBill = ({
  name,
  phone,
  monthlyFee,
  paidAmount,
}: BillData) => {
  const due = monthlyFee - paidAmount;

  const message = `
Hello ${name},

Kothari PG - Monthly Fee Details

Total Fee: ₹${monthlyFee}
Paid: ₹${paidAmount}
Due: ₹${due}

${due > 0 ? "Please clear the pending amount." : "All fees paid."}

Thank you.
  `;

  const cleanedPhone = phone.replace(/\D/g, "");

  const url = `https://wa.me/91${cleanedPhone}?text=${encodeURIComponent(
    message,
  )}`;

  window.open(url, "_blank");
};

export const currentMonth = new Date().getMonth() + 1;
export const currentYear = new Date().getFullYear();

export const getCurrentMonthPaid = (student: Student) => {
  const payment = student.payments.find(
    (p) => p.month === currentMonth && p.year === currentYear,
  );

  return payment ? payment.amountPaid : 0;
};

export const getPaymentProgress = (student: Student) => {
  const paid = getCurrentMonthPaid(student);
  return (paid / student.monthlyFee) * 100;
};

export const formatPaymentDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
