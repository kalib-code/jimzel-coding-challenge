import React from "react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { ILoan, ILoanPayment } from "../../interfaces";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

export const LoanShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { queryResult } = useShow<ILoan>({
    resource: "loans",
    id,
  });

  const { data, isLoading } = queryResult;
  const loan = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!loan) {
    return <div>Loan not found</div>;
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (value?: number) => {
    if (value === undefined) return "";
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value);
  };

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">
          Loan: {loan.loan_account_id}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={() => navigate(`/loans/${id}/edit`)}
          />
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            className="p-button-outlined"
            onClick={() => navigate("/loans")}
          />
        </div>
      </div>

      <TabView>
        <TabPanel header="Loan Details">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Loan ID</p>
                    <p className="font-medium">{loan.loan_account_id}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Status</p>
                    <p>
                      <Tag 
                        severity={loan.active ? "success" : "danger"}
                        value={loan.active ? "Active" : "Inactive"}
                      />
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Loan Type</p>
                    <p className="font-medium">{loan.loan_type_name}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Reference</p>
                    <p className="font-medium">{loan.loan_reference || "-"}</p>
                  </div>
                  <div className="col-12">
                    <p className="text-sm text-gray-500">Employee</p>
                    <p className="font-medium">
                      {loan.first_name} {loan.last_name} ({loan.empl_id})
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Loan Schedule</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="font-medium">{formatDate(loan.issue_date)}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(loan.start_date)}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Deduction Start</p>
                    <p className="font-medium">
                      {formatDate(loan.deduction_start_date) || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Pay Frequency</p>
                    <p className="font-medium">{loan.pay_frequency_name || "-"}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12">
              <Card>
                <h3 className="text-lg font-semibold mb-3">Loan Amount</h3>
                <div className="grid">
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Principal</p>
                    <p className="font-medium">{formatCurrency(loan.principal)}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Interest</p>
                    <p className="font-medium">{formatCurrency(loan.interest)}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{formatCurrency(loan.loan_amount)}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="font-medium">{formatCurrency(loan.running_balance)}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Months to Pay</p>
                    <p className="font-medium">{loan.months_to_pay}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="font-medium">{formatCurrency(loan.monthly_payment)}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Deduction per Pay</p>
                    <p className="font-medium">{formatCurrency(loan.deduct_per_pay)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Payment History">
          <Card>
            <DataTable
              value={loan.payments || []}
              emptyMessage="No payment records found"
              className="p-datatable-gridlines"
              responsiveLayout="scroll"
            >
              <Column field="id" header="Payment ID" />
              <Column
                field="payment_date"
                header="Payment Date"
                body={(rowData: ILoanPayment) => formatDate(rowData.payment_date)}
                sortable
              />
              <Column
                field="amount_paid"
                header="Amount Paid"
                body={(rowData: ILoanPayment) => formatCurrency(rowData.amount_paid)}
                sortable
              />
              <Column field="remarks" header="Remarks" />
            </DataTable>
          </Card>
        </TabPanel>
      </TabView>
    </div>
  );
};