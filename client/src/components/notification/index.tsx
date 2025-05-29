import React from "react";
import { useNotification } from "@refinedev/core";
import { Toast } from "primereact/toast";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, close } = useNotification();
  const toast = React.useRef<Toast>(null);

  React.useEffect(() => {
    open?.({
      key: "notification",
      message: "",
      description: "",
      type: "success",
      undoableTimeout: 5000,
    });

    // Handle notification display
    const handleNotification = (params: any) => {
      const { message, description, type } = params;
      
      if (toast.current) {
        toast.current.show({
          severity: type === "success" ? "success" : type === "error" ? "error" : "info",
          summary: message,
          detail: description,
          life: 5000
        });
      }
    };

    window.addEventListener("notification", (e: any) => handleNotification(e.detail));

    return () => {
      window.removeEventListener("notification", (e: any) => handleNotification(e.detail));
    };
  }, [open, close]);

  return (
    <>
      <Toast ref={toast} position="top-right" />
      {children}
    </>
  );
};