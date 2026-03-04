export type Payment = {
  id: string;
  month: number;
  year: number;
  amountPaid: number;
  date: string;
  mode: "Cash" | "UPI" | "Bank";
};

export type Student = {
  id: number;
  name: string;
  phone: string;
  roomType: string;
  monthlyFee: number;
  payments: Payment[];
};

export type SortField = "name" | "monthlyFee" | "paid" | "due";
