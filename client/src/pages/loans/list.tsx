import React from "react";
import { useList } from "@refinedev/core";
import { ILoan } from "../../interfaces";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

export const LoanList: React.FC = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const { data, isLoading } = useList<ILoan>({
    resource: "loans",
  });

  const loans = data?.data || [];

  // Format date
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

  const actionBodyTemplate = (rowData: ILoan) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => navigate(`/loans/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="success"
          onClick={() => navigate(`/loans/${rowData.id}/edit`)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: ILoan) => {
    return (
      <Tag 
        severity={rowData.active ? "success" : "danger"}
        value={rowData.active ? "Active" : "Inactive"}
      />
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h5 className="m-0">Loans</h5>
      <span>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">Loans</h1>
        <Button
          label="Create Loan"
          icon="pi pi-plus"
          onClick={() => navigate("/loans/create")}
        />
      </div>

      <Card>
        <DataTable
          value={loans}
          loading={isLoading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No loans found"
          className="p-datatable-gridlines"
          responsiveLayout="scroll"
        >
          <Column field="loan_account_id" header="Loan ID" sortable />
          <Column field="loan_type_name" header="Loan Type" sortable />
          <Column 
            field="empl_id" 
            header="Employee" 
            sortable 
            body={(rowData) => `${rowData.first_name} ${rowData.last_name} (${rowData.empl_id})`}
          />
          <Column 
            field="issue_date" 
            header="Issue Date" 
            sortable 
            body={(rowData) => formatDate(rowData.issue_date)}
          />
          <Column 
            field="principal" 
            header="Principal" 
            sortable 
            body={(rowData) => formatCurrency(rowData.principal)}
          />
          <Column 
            field="running_balance" 
            header="Balance" 
            sortable 
            body={(rowData) => formatCurrency(rowData.running_balance)}
          />
          <Column field="active" header="Status" body={statusBodyTemplate} sortable />
          <Column body={actionBodyTemplate} headerStyle={{ width: "8rem" }} />
        </DataTable>
      </Card>
    </div>
  );
};