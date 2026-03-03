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
