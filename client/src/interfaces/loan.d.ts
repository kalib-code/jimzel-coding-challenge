export interface ILoanPayment {
  id: number;
  loan_id: number;
  payment_date: string;
  amount_paid: number;
  remarks?: string;
  created_at?: string;
  updated_by?: string;
  ip_address?: string;
  updated_at?: string;
}

export interface ILoan {
  id: number;
  loan_account_id: string;
  employee_id: number;
  first_name?: string;
  last_name?: string;
  empl_id?: string;
  loan_type_id: number;
  loan_type_name?: string;
  issue_date: string;
  start_date: string;
  principal: number;
  interest: number;
  loan_amount?: number;
  months_to_pay: number;
  monthly_payment: number;
  running_balance: number;
  deduction_start_date?: string;
  deduct_per_pay?: number;
  pay_frequency_id?: number;
  pay_frequency_name?: string;
  loan_reference?: string;
  particulars?: string;
  active: boolean;
  created_at?: string;
  updated_by?: string;
  ip_address?: string;
  updated_at?: string;
  payments?: ILoanPayment[];
}