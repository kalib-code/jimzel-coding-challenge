import React from "react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { EmployeeForm } from "../../components/forms/EmployeeForm";
import { IEmployee } from "../../interfaces";

export const EmployeeEdit: React.FC = () => {
  const { id } = useParams();
  const { queryResult } = useShow<IEmployee>({
    resource: "employees",
    id,
  });

  const { data, isLoading } = queryResult;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <EmployeeForm action="edit" id={id} initialValues={data?.data} />;
};