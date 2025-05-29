import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import { IDepartment } from "../../interfaces";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router";
import { Checkbox } from "primereact/checkbox";

interface DepartmentFormProps {
  initialValues?: IDepartment;
  action: "create" | "edit";
  id?: string;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  initialValues,
  action,
  id,
}) => {
  const navigate = useNavigate();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IDepartment>({
    refineCoreProps: {
      resource: "departments",
      action,
      id,
      redirect: "show",
    },
    defaultValues: initialValues,
  });

  const onSubmit = (data: IDepartment) => {
    onFinish(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">
          {action === "create" ? "Create Department" : "Edit Department"}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            type="button"
            className="p-button-outlined p-button-danger"
            onClick={() => navigate("/departments")}
          />
          <Button
            label="Save"
            icon="pi pi-save"
            type="submit"
            loading={formLoading}
          />
        </div>
      </div>

      <Card>
        <div className="grid">
          <div className="col-12 md:col-4 field">
            <label htmlFor="code_id" className="block mb-2">
              Department Code*
            </label>
            <InputText
              id="code_id"
              className={`w-full ${errors.code_id ? "p-invalid" : ""}`}
              {...register("code_id", { required: "Code is required" })}
            />
            {errors.code_id && (
              <small className="p-error">{errors.code_id.message}</small>
            )}
          </div>
          <div className="col-12 md:col-8 field">
            <label htmlFor="name" className="block mb-2">
              Department Name*
            </label>
            <InputText
              id="name"
              className={`w-full ${errors.name ? "p-invalid" : ""}`}
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <small className="p-error">{errors.name.message}</small>
            )}
          </div>
          <div className="col-12 field">
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <InputTextarea
              id="description"
              className="w-full"
              rows={5}
              {...register("description")}
            />
          </div>
          <div className="col-12 field">
            <div className="flex align-items-center">
              <Checkbox
                inputId="can_transfer"
                checked={watch("can_transfer")}
                onChange={(e) => setValue("can_transfer", e.checked)}
              />
              <label htmlFor="can_transfer" className="ml-2">
                Can Transfer
              </label>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};