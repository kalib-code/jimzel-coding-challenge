import React from "react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { IDepartment } from "../../interfaces";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { Card } from "primereact/card";

export const DepartmentShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { queryResult } = useShow<IDepartment>({
    resource: "departments",
    id,
  });

  const { data, isLoading } = queryResult;
  const department = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!department) {
    return <div>Department not found</div>;
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">{department.name}</h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={() => navigate(`/departments/${id}/edit`)}
          />
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            className="p-button-outlined"
            onClick={() => navigate("/departments")}
          />
        </div>
      </div>

      <Card>
        <div className="grid">
          <div className="col-12 md:col-4">
            <p className="text-sm text-gray-500">Department Code</p>
            <p className="font-medium">{department.code_id}</p>
          </div>
          <div className="col-12 md:col-8">
            <p className="text-sm text-gray-500">Department Name</p>
            <p className="font-medium">{department.name}</p>
          </div>
          <div className="col-12">
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{department.description || "-"}</p>
          </div>
          <div className="col-12 md:col-4">
            <p className="text-sm text-gray-500">Can Transfer</p>
            <p className="font-medium">{department.can_transfer ? "Yes" : "No"}</p>
          </div>
          <div className="col-12 md:col-4">
            <p className="text-sm text-gray-500">Last Updated By</p>
            <p className="font-medium">{department.updated_by || "-"}</p>
          </div>
          <div className="col-12 md:col-4">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{formatDate(department.updated_at)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};