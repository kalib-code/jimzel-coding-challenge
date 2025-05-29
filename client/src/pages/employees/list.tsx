import { useList } from "@refinedev/core";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useNavigate } from "react-router";
import { IEmployee } from "../../interfaces";

export const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState<Record<string, any>>({
    q: "",
    active: true,
  });

  const { data, isLoading } = useList<IEmployee>({
    resource: "employees",
    filters: [
      {
        field: "search",
        operator: "eq",
        value: filters.q,
      },
      {
        field: "active",
        operator: "eq",
        value: filters.active,
      },
    ],
    sorters: [
      {
        field: "last_name",
        order: "asc",
      },
    ],
  });

  const employees = data?.data || [];

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      q: value,
    }));
  };

  const handleActiveFilter = (value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      active: value,
    }));
  };

  const actionBodyTemplate = (rowData: IEmployee) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => navigate(`/employees/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="success"
          onClick={() => navigate(`/employees/${rowData.id}/edit`)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: IEmployee) => {
    return (

     <Badge
       severity={rowData.active ? "success" : "danger"}
       value={rowData.active ? "Active" : "Inactive"}
     />
    );
  };

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">Employees</h1>
        <Button
          label="Create Employee"
          icon="pi pi-plus"
          onClick={() => navigate("/employees/create")}
        />
      </div>

      <Card className="mb-4">
        <div className="flex justify-content-between">
          <div className="p-input-icon-left w-full md:w-6">
            <i className="pi pi-search" />
            <InputText
              value={filters.q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or ID"
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="All"
              className={!filters.active ? "p-button-primary" : "p-button-outlined"}
              onClick={() => handleActiveFilter(undefined)}
            />
            <Button
              label="Active"
              className={filters.active === true ? "p-button-primary" : "p-button-outlined"}
              onClick={() => handleActiveFilter(true)}
            />
            <Button
              label="Inactive"
              className={filters.active === false ? "p-button-primary" : "p-button-outlined"}
              onClick={() => handleActiveFilter(false)}
            />
          </div>
        </div>
      </Card>

      <DataTable
        value={employees}
        loading={isLoading}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="No employees found"
        className="p-datatable-gridlines"
        responsiveLayout="scroll"
      >
        <Column field="empl_id" header="ID" sortable />
        <Column
          header="Name"
          body={(rowData) =>
            `${rowData.first_name} ${rowData.middle_name || ""} ${
              rowData.last_name
            } ${rowData.suffix || ""}`
          }
          sortable
          sortField="last_name"
        />
        <Column field="department_name" header="Department" sortable />
        <Column field="position_title" header="Position" sortable />
        <Column field="employment_type" header="Employment Type" sortable />
        <Column field="active" header="Status" body={statusBodyTemplate} sortable />
        <Column body={actionBodyTemplate} headerStyle={{ width: "8rem" }} />
      </DataTable>
    </div>
  );
};
