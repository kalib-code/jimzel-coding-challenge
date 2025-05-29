import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { UseFormReturn } from "@refinedev/react-hook-form";

interface EditModalProps {
  title: string;
  visible: boolean;
  onHide: () => void;
  formHook: UseFormReturn<any, any, undefined>;
  renderFormFields: () => React.ReactNode;
}

export const EditModal: React.FC<EditModalProps> = ({
  title,
  visible,
  onHide,
  formHook,
  renderFormFields,
}) => {
  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    reset,
  } = formHook;

  const handleFormSubmit = (data: any) => {
    return onFinish(data);
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "50vw" }}
      onHide={handleClose}
      footer={
        <div>
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={handleClose}
            className="p-button-text"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleSubmit(handleFormSubmit)}
            loading={formLoading}
            autoFocus
          />
        </div>
      }
    >
      <div className="p-fluid">{renderFormFields()}</div>
    </Dialog>
  );
};