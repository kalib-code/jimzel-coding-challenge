import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import { IReference } from "../../interfaces/reference";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router";

interface ReferenceFormProps {
  initialValues?: IReference;
  action: "create" | "edit";
  id?: string;
  resource: string;
  resourceLabel: string;
}

export const ReferenceForm: React.FC<ReferenceFormProps> = ({
  initialValues,
  action,
  id,
  resource,
  resourceLabel,
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
  } = useForm<IReference>({
    refineCoreProps: {
      resource,
      action,
      id,
      redirect: "list",
    },
    defaultValues: initialValues,
  });

  const onSubmit = (data: IReference) => {
    onFinish(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">
          {action === "create" ? `Create ${resourceLabel}` : `Edit ${resourceLabel}`}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            type="button"
            className="p-button-outlined p-button-danger"
            onClick={() => navigate(`/${resource}`)}
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
          <div className="col-12 md:col-6 field">
            <label htmlFor="code_id" className="block mb-2">
              Code*
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
          <div className="col-12 md:col-6 field">
            <label htmlFor="name" className="block mb-2">
              Name*
            </label>
            <InputText
              id="name"
              className={`w-full ${errors.name ? "p-invalid" : ""}`}
              {...register("name", { required: "Name is required" })}
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
                inputId="active"
                checked={watch("active") !== false}
                onChange={(e) => setValue("active", e.checked)}
              />
              <label htmlFor="active" className="ml-2">
                Active
              </label>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};