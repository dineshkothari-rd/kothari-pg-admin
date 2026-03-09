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

  fatherName?: string;
  age?: number;

  parentPhone?: string;

  village?: string;
  tehsil?: string;
  district?: string;
  state?: string;

  occupation?: string;
  occupationAddress?: string;
  occupationPhone?: string;

  referenceName?: string;
  referencePhone?: string;

  idProofType?: string;
  idProofNumber?: string;

  roomType: string;
  monthlyFee: number;

  payments: Payment[];
};

export type SortField = "name" | "monthlyFee" | "paid" | "due";
