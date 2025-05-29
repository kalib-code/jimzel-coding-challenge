import React from "react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { DepartmentForm } from "../../components/forms/DepartmentForm";
import { IDepartment } from "../../interfaces";

export const DepartmentEdit: React.FC = () => {
  const { id } = useParams();
  const { queryResult } = useShow<IDepartment>({
    resource: "departments",
    id,
  });

  const { data, isLoading } = queryResult;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <DepartmentForm action="edit" id={id} initialValues={data?.data} />;
};