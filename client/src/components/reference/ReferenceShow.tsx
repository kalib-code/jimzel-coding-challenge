import React from "react";
import { useShow } from "@refinedev/core";
import { IReference } from "../../interfaces/reference";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

interface ReferenceShowProps {
  resource: string;
  resourceLabel: string;
}

export const ReferenceShow: React.FC<ReferenceShowProps> = ({ resource, resourceLabel }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { queryResult } = useShow<IReference>({
    resource,
    id,
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h3 className="m-0">{record?.name}</h3>
        <div className="flex gap-2">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            className="p-button-outlined"
            onClick={() => navigate(`/${resource}`)}
          />
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={() => navigate(`/${resource}/${id}/edit`)}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card className="mb-4" title={renderHeader()} subTitle={`Code: ${record?.code_id}`}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="flex justify-content-end mb-3">
              <Tag
                severity={record?.active !== false ? "success" : "danger"}
                value={record?.active !== false ? "Active" : "Inactive"}
              />
            </div>

            <div className="grid">
              <div className="col-12">
                <h4>Description</h4>
                <p>{record?.description || "No description provided."}</p>
              </div>
            </div>

            <Divider />

            <div className="grid">
              <div className="col-12 md:col-6">
                <h4>Created At</h4>
                <p>
                  {record?.created_at
                    ? new Date(record.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="col-12 md:col-6">
                <h4>Updated At</h4>
                <p>
                  {record?.updated_at
                    ? new Date(record.updated_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};