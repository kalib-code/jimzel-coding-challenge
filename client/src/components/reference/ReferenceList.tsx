import React from "react";
import { useTable, ColumnDef, flexRender } from "@refinedev/react-table";
import { getDefaultFilter, useMany } from "@refinedev/core";
import { IReference } from "../../interfaces/reference";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useNavigate } from "react-router";
import { Tag } from "primereact/tag";

interface ReferenceListProps {
  resource: string;
  resourceLabel: string;
}

export const ReferenceList: React.FC<ReferenceListProps> = ({ resource, resourceLabel }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState<Record<string, any>>({
    q: "",
  });

  const { tableQueryResult, data, isLoading } = useTable<IReference>({
    resource,
    filters: [
      {
        field: "q",
        operator: "contains",
        value: filters.q,
      },
    ],
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const records = data?.data || [];

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      q: value,
    }));
  };

  const actionBodyTemplate = (rowData: IReference) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => navigate(`/${resource}/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="success"
          onClick={() => navigate(`/${resource}/${rowData.id}/edit`)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: IReference) => {
    return (
      <Tag 
        severity={rowData.active !== false ? "success" : "danger"} 
        value={rowData.active !== false ? "Active" : "Inactive"} 
      />
    );
  };

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">{resourceLabel}</h1>
        <Button
          label={`Create ${resourceLabel}`}
          icon="pi pi-plus"
          onClick={() => navigate(`/${resource}/create`)}
        />
      </div>

      <Card className="mb-4">
        <div className="p-input-icon-left w-full md:w-6">
          <i className="pi pi-search" />
          <InputText
            value={filters.q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search"
            className="w-full"
          />
        </div>
      </Card>

      <DataTable
        value={records}
        loading={isLoading}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage={`No ${resourceLabel.toLowerCase()} found`}
        className="p-datatable-gridlines"
        responsiveLayout="scroll"
      >
        <Column field="code_id" header="Code" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="description" header="Description" sortable />
        <Column field="active" header="Status" body={statusBodyTemplate} sortable />
        <Column body={actionBodyTemplate} headerStyle={{ width: "8rem" }} />
      </DataTable>
    </div>
  );
};