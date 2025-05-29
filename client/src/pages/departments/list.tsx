import React from "react";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { IDepartment } from "../../interfaces";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";

export const DepartmentList: React.FC = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const { data, isLoading } = useList<IDepartment>({
    resource: "departments",
  });

  const departments = data?.data || [];

  const actionBodyTemplate = (rowData: IDepartment) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => navigate(`/departments/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="success"
          onClick={() => navigate(`/departments/${rowData.id}/edit`)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h5 className="m-0">Departments</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
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
        <h1 className="text-xl font-bold">Departments</h1>
        <Button
          label="Create Department"
          icon="pi pi-plus"
          onClick={() => navigate("/departments/create")}
        />
      </div>

      <Card>
        <DataTable
          value={departments}
          loading={isLoading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No departments found"
          className="p-datatable-gridlines"
          responsiveLayout="scroll"
        >
          <Column field="code_id" header="Code" sortable />
          <Column field="name" header="Name" sortable />
          <Column field="description" header="Description" sortable />
          <Column body={actionBodyTemplate} headerStyle={{ width: "8rem" }} />
        </DataTable>
      </Card>
    </div>
  );
};