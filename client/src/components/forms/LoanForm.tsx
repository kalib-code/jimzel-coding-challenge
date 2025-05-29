import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { ILoan, ILoanPayment } from "../../interfaces";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

interface LoanFormProps {
  initialValues?: ILoan;
  action: "create" | "edit";
  id?: string;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  initialValues,
  action,
  id,
}) => {
  const navigate = useNavigate();
  const toast = React.useRef<Toast>(null);
  const [showPaymentDialog, setShowPaymentDialog] = React.useState<boolean>(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = React.useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = React.useState<ILoanPayment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = React.useState<number | null>(null);
  const [payments, setPayments] = React.useState<ILoanPayment[]>(
    initialValues?.payments || []
  );

  // Initialize form with correct default values and use a separate state for active status
  const defaultActive = initialValues?.active !== undefined ? initialValues.active : true;
  const [isActiveState, setIsActiveState] = React.useState<boolean>(!!defaultActive);

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ILoan>({
    refineCoreProps: {
      resource: "loans",
      action,
      id,
      redirect: "show",
    },
    defaultValues: {
      ...initialValues,
      active: defaultActive,
    },
    // Add validation rules
    rules: {
      employee_id: {
        required: "Employee is required",
      },
      loan_type_id: {
        required: "Loan type is required",
      },
      issue_date: {
        required: "Issue date is required",
      },
      start_date: {
        required: "Start date is required",
      },
      principal: {
        required: "Principal amount is required",
        min: {
          value: 1,
          message: "Principal must be greater than 0",
        },
      },
      months_to_pay: {
        required: "Months to pay is required",
        min: {
          value: 1,
          message: "Months to pay must be at least 1",
        },
      },
      monthly_payment: {
        required: "Monthly payment is required",
        min: {
          value: 1,
          message: "Monthly payment must be greater than 0",
        },
      },
      running_balance: {
        required: "Starting balance is required",
      },
    },
  });

  const { options: employeeOptions, isLoading: employeesLoading } = useSelect({
    resource: "employees",
    optionLabel: "full_name",
    optionValue: "id",
    filters: [
      {
        field: "active",
        operator: "eq",
        value: true,
      },
    ],
  });

  const { options: loanTypeOptions, isLoading: loanTypesLoading } = useSelect({
    resource: "loan-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: payFrequencyOptions, isLoading: payFrequenciesLoading } = useSelect({
    resource: "pay-frequencies",
    optionLabel: "name",
    optionValue: "id",
  });

  // Handle payment add/edit
  const handlePaymentSubmit = () => {
    if (!currentPayment) return;

    // Validate payment data
    if (!currentPayment.payment_date) {
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Payment date is required',
          life: 3000,
        });
      }
      return;
    }

    if (!currentPayment.amount_paid || currentPayment.amount_paid <= 0) {
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Amount paid must be greater than 0',
          life: 3000,
        });
      }
      return;
    }

    if (currentPayment.id) {
      // Edit existing payment
      setPayments(
        payments.map((p) =>
          p.id === currentPayment.id ? currentPayment : p
        )
      );
    } else {
      // Add new payment with temporary ID
      const tempId = Date.now(); // Use timestamp as temporary ID
      setPayments([...payments, { ...currentPayment, id: tempId }]);
    }

    setShowPaymentDialog(false);
    setCurrentPayment(null);

    if (toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `Payment ${currentPayment.id ? 'updated' : 'added'} successfully`,
        life: 3000,
      });
    }
  };

  const handleAddPayment = () => {
    setCurrentPayment({
      id: 0,
      loan_id: parseInt(id || "0"),
      payment_date: new Date().toISOString().split('T')[0],
      amount_paid: 0,
      remarks: "",
    });
    setShowPaymentDialog(true);
  };

  const handleEditPayment = (payment: ILoanPayment) => {
    setCurrentPayment({ ...payment });
    setShowPaymentDialog(true);
  };

  const handleRemovePayment = (paymentId: number) => {
    // Set the payment ID to delete and show confirmation dialog
    setPaymentToDelete(paymentId);
    setShowDeleteConfirmDialog(true);
  };

  const confirmDeletePayment = () => {
    if (paymentToDelete === null) return;

    setPayments(payments.filter((p) => p.id !== paymentToDelete));
    setShowDeleteConfirmDialog(false);
    setPaymentToDelete(null);

    if (toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Payment removed successfully',
        life: 3000,
      });
    }
  };

  const paymentDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setShowPaymentDialog(false)}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={handlePaymentSubmit}
      />
    </>
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return "";
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value);
  };

  const onSubmit = (data: ILoan) => {
    // Add payments to the data
    data.payments = payments;

    // Use our separate state variable for active status
    data.active = isActiveState;

    console.log("Submitting loan with active status:", data.active);
    onFinish(data);
  };

  const calculateLoanAmount = () => {
    const principal = watch("principal") || 0;
    const interest = watch("interest") || 0;
    return principal + interest;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
      
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">
          {action === "create" ? "Create Loan" : "Edit Loan"}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            type="button"
            className="p-button-outlined p-button-danger"
            onClick={() => navigate("/loans")}
          />
          <Button
            label="Save"
            icon="pi pi-save"
            type="submit"
            loading={formLoading}
          />
        </div>
      </div>

      <TabView>
        <TabPanel header="Loan Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Loan Details</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="loan_account_id" className="block mb-2">
                      Loan Account ID
                    </label>
                    <InputText
                      id="loan_account_id"
                      className="w-full"
                      disabled={action === "edit"}
                      {...register("loan_account_id")}
                      placeholder={action === "create" ? "Auto-generated" : ""}
                    />
                    <small className="text-gray-500">
                      {action === "create" && "Will be auto-generated if left empty"}
                    </small>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="active" className="block mb-2">
                      Status
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="active"
                        checked={isActiveState}
                        onChange={(e) => {
                          setIsActiveState(e.checked);
                          setValue("active", e.checked);
                        }}
                      />
                      <label htmlFor="active" className="ml-2">
                        Active {isActiveState ? "(Yes)" : "(No)"}
                      </label>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="employee_id" className="block mb-2">
                      Employee*
                    </label>
                    <Dropdown
                      id="employee_id"
                      options={employeeOptions}
                      value={watch("employee_id")}
                      onChange={(e) => setValue("employee_id", e.value)}
                      className={`w-full ${errors.employee_id ? "p-invalid" : ""}`}
                      placeholder="Select employee"
                      loading={employeesLoading}
                    />
                    {errors.employee_id && (
                      <small className="p-error">
                        {errors.employee_id.message}
                      </small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="loan_type_id" className="block mb-2">
                      Loan Type*
                    </label>
                    <Dropdown
                      id="loan_type_id"
                      options={loanTypeOptions}
                      value={watch("loan_type_id")}
                      onChange={(e) => setValue("loan_type_id", e.value)}
                      className={`w-full ${errors.loan_type_id ? "p-invalid" : ""}`}
                      placeholder="Select loan type"
                      loading={loanTypesLoading}
                    />
                    {errors.loan_type_id && (
                      <small className="p-error">
                        {errors.loan_type_id.message}
                      </small>
                    )}
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="loan_reference" className="block mb-2">
                      Loan Reference
                    </label>
                    <InputText
                      id="loan_reference"
                      className="w-full"
                      {...register("loan_reference")}
                    />
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="particulars" className="block mb-2">
                      Particulars
                    </label>
                    <InputText
                      id="particulars"
                      className="w-full"
                      {...register("particulars")}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Loan Schedule</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="issue_date" className="block mb-2">
                      Issue Date*
                    </label>
                    <Calendar
                      id="issue_date"
                      value={watch("issue_date") ? new Date(watch("issue_date") as string) : undefined}
                      onChange={(e) => setValue("issue_date", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className={`w-full ${errors.issue_date ? "p-invalid" : ""}`}
                    />
                    {errors.issue_date && (
                      <small className="p-error">{errors.issue_date.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="start_date" className="block mb-2">
                      Start Date*
                    </label>
                    <Calendar
                      id="start_date"
                      value={watch("start_date") ? new Date(watch("start_date") as string) : undefined}
                      onChange={(e) => setValue("start_date", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className={`w-full ${errors.start_date ? "p-invalid" : ""}`}
                    />
                    {errors.start_date && (
                      <small className="p-error">{errors.start_date.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="deduction_start_date" className="block mb-2">
                      Deduction Start Date
                    </label>
                    <Calendar
                      id="deduction_start_date"
                      value={watch("deduction_start_date") ? new Date(watch("deduction_start_date") as string) : undefined}
                      onChange={(e) => setValue("deduction_start_date", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="pay_frequency_id" className="block mb-2">
                      Pay Frequency
                    </label>
                    <Dropdown
                      id="pay_frequency_id"
                      options={payFrequencyOptions}
                      value={watch("pay_frequency_id")}
                      onChange={(e) => setValue("pay_frequency_id", e.value)}
                      className="w-full"
                      placeholder="Select pay frequency"
                      loading={payFrequenciesLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="months_to_pay" className="block mb-2">
                      Months to Pay*
                    </label>
                    <InputNumber
                      id="months_to_pay"
                      value={watch("months_to_pay")}
                      onValueChange={(e) => setValue("months_to_pay", e.value || 0)}
                      className={`w-full ${errors.months_to_pay ? "p-invalid" : ""}`}
                      min={1}
                      showButtons
                    />
                    {errors.months_to_pay && (
                      <small className="p-error">{errors.months_to_pay.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="deduct_per_pay" className="block mb-2">
                      Deduct per Pay
                    </label>
                    <InputNumber
                      id="deduct_per_pay"
                      value={watch("deduct_per_pay")}
                      onValueChange={(e) => setValue("deduct_per_pay", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12">
              <Card>
                <h3 className="text-lg font-semibold mb-3">Loan Amount</h3>
                <div className="grid">
                  <div className="col-12 md:col-3 field">
                    <label htmlFor="principal" className="block mb-2">
                      Principal Amount*
                    </label>
                    <InputNumber
                      id="principal"
                      value={watch("principal")}
                      onValueChange={(e) => setValue("principal", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.principal ? "p-invalid" : ""}`}
                    />
                    {errors.principal && (
                      <small className="p-error">{errors.principal.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-3 field">
                    <label htmlFor="interest" className="block mb-2">
                      Interest
                    </label>
                    <InputNumber
                      id="interest"
                      value={watch("interest")}
                      onValueChange={(e) => setValue("interest", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-3 field">
                    <label htmlFor="loan_amount" className="block mb-2">
                      Total Loan Amount
                    </label>
                    <InputNumber
                      id="loan_amount"
                      value={calculateLoanAmount()}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className="w-full"
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-3 field">
                    <label htmlFor="monthly_payment" className="block mb-2">
                      Monthly Payment*
                    </label>
                    <InputNumber
                      id="monthly_payment"
                      value={watch("monthly_payment")}
                      onValueChange={(e) => setValue("monthly_payment", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.monthly_payment ? "p-invalid" : ""}`}
                    />
                    {errors.monthly_payment && (
                      <small className="p-error">{errors.monthly_payment.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-3 field">
                    <label htmlFor="running_balance" className="block mb-2">
                      Starting Balance*
                    </label>
                    <InputNumber
                      id="running_balance"
                      value={watch("running_balance")}
                      onValueChange={(e) => setValue("running_balance", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.running_balance ? "p-invalid" : ""}`}
                    />
                    {errors.running_balance && (
                      <small className="p-error">{errors.running_balance.message}</small>
                    )}
                    <small className="text-gray-500">
                      {action === "create" && "Initial balance, usually equal to principal + interest"}
                    </small>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        {action === "edit" && (
          <TabPanel header="Payment History">
            <Card>
              <div className="flex justify-content-between mb-4">
                <h3 className="text-lg font-semibold">Payments</h3>
                <Button 
                  label="Add Payment" 
                  icon="pi pi-plus"
                  onClick={handleAddPayment}
                />
              </div>
              
              <DataTable
                value={payments}
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
                <Column
                  header="Actions"
                  body={(rowData: ILoanPayment) => (
                    <div className="flex gap-2">
                      <Button
                        icon="pi pi-pencil"
                        rounded
                        text
                        severity="success"
                        onClick={() => handleEditPayment(rowData)}
                      />
                      <Button
                        icon="pi pi-trash"
                        rounded
                        text
                        severity="danger"
                        onClick={() => handleRemovePayment(rowData.id)}
                      />
                    </div>
                  )}
                />
              </DataTable>
            </Card>
          </TabPanel>
        )}
      </TabView>
      
      {/* Payment Dialog */}
      <Dialog
        visible={showPaymentDialog}
        style={{ width: '450px' }}
        header="Payment Details"
        modal
        className="p-fluid"
        footer={paymentDialogFooter}
        onHide={() => setShowPaymentDialog(false)}
      >
        <div className="field">
          <label htmlFor="payment_date" className="block mb-2">
            Payment Date*
          </label>
          <Calendar
            id="payment_date"
            value={currentPayment?.payment_date ? new Date(currentPayment.payment_date) : null}
            onChange={(e) => setCurrentPayment(prev => prev ? {...prev, payment_date: e.value?.toISOString().split('T')[0] || ''} : null)}
            dateFormat="yy-mm-dd"
            className="w-full"
          />
        </div>
        <div className="field">
          <label htmlFor="amount_paid" className="block mb-2">
            Amount Paid*
          </label>
          <InputNumber
            id="amount_paid"
            value={currentPayment?.amount_paid}
            onValueChange={(e) => setCurrentPayment(prev => prev ? {...prev, amount_paid: e.value || 0} : null)}
            mode="currency"
            currency="PHP"
            locale="en-PH"
            className="w-full"
          />
        </div>
        <div className="field">
          <label htmlFor="remarks" className="block mb-2">
            Remarks
          </label>
          <InputText
            id="remarks"
            value={currentPayment?.remarks || ''}
            onChange={(e) => setCurrentPayment(prev => prev ? {...prev, remarks: e.target.value} : null)}
            className="w-full"
          />
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={showDeleteConfirmDialog}
        style={{ width: '450px' }}
        header="Confirm Deletion"
        modal
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setShowDeleteConfirmDialog(false);
                setPaymentToDelete(null);
              }}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={confirmDeletePayment}
            />
          </>
        }
        onHide={() => {
          setShowDeleteConfirmDialog(false);
          setPaymentToDelete(null);
        }}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>Are you sure you want to delete this payment record?</span>
        </div>
      </Dialog>
    </form>
  );
};