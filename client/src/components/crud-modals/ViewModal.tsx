import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface ViewModalProps {
  title: string;
  visible: boolean;
  onHide: () => void;
  children: React.ReactNode;
}

export const ViewModal: React.FC<ViewModalProps> = ({
  title,
  visible,
  onHide,
  children,
}) => {
  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
      footer={
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
        />
      }
    >
      <div className="p-4">{children}</div>
    </Dialog>
  );
};