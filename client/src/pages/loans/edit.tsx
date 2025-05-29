import React from "react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { ILoan } from "../../interfaces";
import { LoanForm } from "../../components/forms/LoanForm";

export const LoanEdit: React.FC = () => {
  const { id } = useParams();
  const { queryResult } = useShow<ILoan>({
    resource: "loans",
    id,
  });

  const { data, isLoading } = queryResult;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <LoanForm action="edit" id={id} initialValues={data?.data} />;
};