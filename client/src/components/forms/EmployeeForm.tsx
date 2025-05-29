import { useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { useNavigate } from "react-router";
import { IEmployee } from "../../interfaces";

interface EmployeeFormProps {
  initialValues?: IEmployee;
  action: "create" | "edit";
  id?: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  action,
  id,
}) => {
  const navigate = useNavigate();
  // Track active status with a separate state
  const [isActiveState, setIsActiveState] = React.useState<boolean>(
    initialValues?.active === undefined ? true : !!initialValues.active
  );
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IEmployee>({
    refineCoreProps: {
      resource: "employees",
      action,
      id,
      redirect: "show",
    },
    defaultValues: initialValues,
    mode: "onChange", // Enable live validation as fields change
  });

  const { options: departmentOptions, isLoading: departmentsLoading } = useSelect({
    resource: "departments",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: positionOptions, isLoading: positionsLoading } = useSelect({
    resource: "positions",
    optionLabel: "title",
    optionValue: "id",
  });

  const { options: employmentTypeOptions, isLoading: employmentTypesLoading } = useSelect({
    resource: "employment-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: vendorOptions, isLoading: vendorsLoading } = useSelect({
    resource: "vendors",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: bankOptions, isLoading: banksLoading } = useSelect({
    resource: "banks",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: payFrequencyOptions, isLoading: payFrequenciesLoading } = useSelect({
    resource: "pay-frequencies",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: rateTypeOptions, isLoading: rateTypesLoading } = useSelect({
    resource: "rate-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const sexOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const onSubmit = (data: IEmployee) => {
    // Use our separate state variable for active status
    data.active = isActiveState;
    console.log("Submitting employee with active status:", data.active);
    onFinish(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">
          {action === "create" ? "Create Employee" : "Edit Employee"}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            type="button"
            className="p-button-outlined p-button-danger"
            onClick={() => navigate("/employees")}
          />
          <Button
            label="Save"
            icon="pi pi-save"
            type="submit"
            loading={formLoading}
          />
        </div>
      </div>

      <TabView>
        <TabPanel header="Personal Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="empl_id" className="block mb-2">
                      Employee ID*
                    </label>
                    <InputText
                      id="empl_id"
                      className={`w-full ${errors.empl_id ? "p-invalid" : ""}`}
                      {...register("empl_id", {
                        required: "Employee ID is required",
                        minLength: {
                          value: 3,
                          message: "Employee ID must be at least 3 characters"
                        },
                        maxLength: {
                          value: 20,
                          message: "Employee ID must not exceed 20 characters"
                        }
                      })}
                    />
                    {errors.empl_id && (
                      <small className="p-error">{errors.empl_id.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="active" className="block mb-2">
                      Status
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="active"
                        checked={isActiveState}
                        onChange={(e) => {
                          setIsActiveState(e.checked);
                          setValue("active", e.checked);
                          console.log("Setting active status to:", e.checked);
                        }}
                      />
                      <label htmlFor="active" className="ml-2">
                        Active {isActiveState ? "(Yes)" : "(No)"}
                      </label>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="first_name" className="block mb-2">
                      First Name*
                    </label>
                    <InputText
                      id="first_name"
                      className={`w-full ${errors.first_name ? "p-invalid" : ""}`}
                      {...register("first_name", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters"
                        },
                        maxLength: {
                          value: 50,
                          message: "First name must not exceed 50 characters"
                        },
                        pattern: {
                          value: /^[A-Za-z\s\-'\.]+$/,
                          message: "First name must contain only letters, spaces, hyphens, apostrophes, and periods"
                        }
                      })}
                    />
                    {errors.first_name && (
                      <small className="p-error">
                        {errors.first_name.message}
                      </small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="middle_name" className="block mb-2">
                      Middle Name
                    </label>
                    <InputText
                      id="middle_name"
                      className={`w-full ${errors.middle_name ? "p-invalid" : ""}`}
                      {...register("middle_name", {
                        maxLength: {
                          value: 50,
                          message: "Middle name must not exceed 50 characters"
                        },
                        pattern: {
                          value: /^[A-Za-z\s\-'\.]*$/,
                          message: "Middle name must contain only letters, spaces, hyphens, apostrophes, and periods"
                        }
                      })}
                    />
                    {errors.middle_name && (
                      <small className="p-error">{errors.middle_name.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="last_name" className="block mb-2">
                      Last Name*
                    </label>
                    <InputText
                      id="last_name"
                      className={`w-full ${errors.last_name ? "p-invalid" : ""}`}
                      {...register("last_name", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters"
                        },
                        maxLength: {
                          value: 50,
                          message: "Last name must not exceed 50 characters"
                        },
                        pattern: {
                          value: /^[A-Za-z\s\-'\.]+$/,
                          message: "Last name must contain only letters, spaces, hyphens, apostrophes, and periods"
                        }
                      })}
                    />
                    {errors.last_name && (
                      <small className="p-error">{errors.last_name.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="suffix" className="block mb-2">
                      Suffix
                    </label>
                    <InputText
                      id="suffix"
                      className={`w-full ${errors.suffix ? "p-invalid" : ""}`}
                      {...register("suffix", {
                        maxLength: {
                          value: 10,
                          message: "Suffix must not exceed 10 characters"
                        }
                      })}
                    />
                    {errors.suffix && (
                      <small className="p-error">{errors.suffix.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="sex" className="block mb-2">
                      Gender
                    </label>
                    <Dropdown
                      id="sex"
                      options={sexOptions}
                      value={watch("sex")}
                      onChange={(e) => setValue("sex", e.value)}
                      className="w-full"
                      placeholder="Select gender"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="birthday" className="block mb-2">
                      Birthday
                    </label>
                    <Calendar
                      id="birthday"
                      value={watch("birthday") ? new Date(watch("birthday") as string) : undefined}
                      onChange={(e) => setValue("birthday", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="kasam_bahay" className="block mb-2">
                      Kasam-bahay
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="kasam_bahay"
                        checked={watch("kasam_bahay")}
                        onChange={(e) => setValue("kasam_bahay", e.checked)}
                      />
                      <label htmlFor="kasam_bahay" className="ml-2">
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
                <div className="grid">
                  <div className="col-12 field">
                    <label htmlFor="email" className="block mb-2">
                      Email
                    </label>
                    <InputText
                      id="email"
                      className={`w-full ${errors.email ? "p-invalid" : ""}`}
                      {...register("email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address format"
                        }
                      })}
                    />
                    {errors.email && (
                      <small className="p-error">{errors.email.message}</small>
                    )}
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="phone_no" className="block mb-2">
                      Phone
                    </label>
                    <InputText
                      id="phone_no"
                      className={`w-full ${errors.phone_no ? "p-invalid" : ""}`}
                      {...register("phone_no", {
                        pattern: {
                          value: /^[\d\s\+\-\(\)]{7,20}$/,
                          message: "Phone number must be 7-20 digits, may include spaces, +, -, (, )"
                        }
                      })}
                    />
                    {errors.phone_no && (
                      <small className="p-error">{errors.phone_no.message}</small>
                    )}
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="address" className="block mb-2">
                      Address
                    </label>
                    <InputText
                      id="address"
                      className={`w-full ${errors.address ? "p-invalid" : ""}`}
                      {...register("address", {
                        maxLength: {
                          value: 200,
                          message: "Address must not exceed 200 characters"
                        }
                      })}
                    />
                    {errors.address && (
                      <small className="p-error">{errors.address.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-4 field">
                    <label htmlFor="city" className="block mb-2">
                      City
                    </label>
                    <InputText
                      id="city"
                      className={`w-full ${errors.city ? "p-invalid" : ""}`}
                      {...register("city", {
                        maxLength: {
                          value: 50,
                          message: "City must not exceed 50 characters"
                        }
                      })}
                    />
                    {errors.city && (
                      <small className="p-error">{errors.city.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-4 field">
                    <label htmlFor="province" className="block mb-2">
                      Province
                    </label>
                    <InputText
                      id="province"
                      className={`w-full ${errors.province ? "p-invalid" : ""}`}
                      {...register("province", {
                        maxLength: {
                          value: 50,
                          message: "Province must not exceed 50 characters"
                        }
                      })}
                    />
                    {errors.province && (
                      <small className="p-error">{errors.province.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-4 field">
                    <label htmlFor="zip" className="block mb-2">
                      Zip
                    </label>
                    <InputText
                      id="zip"
                      className={`w-full ${errors.zip ? "p-invalid" : ""}`}
                      {...register("zip", {
                        pattern: {
                          value: /^[\d\-]{4,10}$/,
                          message: "Zip code must be 4-10 digits, may include hyphens"
                        }
                      })}
                    />
                    {errors.zip && (
                      <small className="p-error">{errors.zip.message}</small>
                    )}
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="location" className="block mb-2">
                      Work Location
                    </label>
                    <InputText
                      id="location"
                      className={`w-full ${errors.location ? "p-invalid" : ""}`}
                      {...register("location")}
                    />
                    {errors.location && (
                      <small className="p-error">{errors.location.message}</small>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Employment Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Employment Details</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="department_id" className="block mb-2">
                      Department
                    </label>
                    <Dropdown
                      id="department_id"
                      options={departmentOptions}
                      value={watch("department_id")}
                      onChange={(e) => setValue("department_id", e.value)}
                      className="w-full"
                      placeholder="Select department"
                      loading={departmentsLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="position_id" className="block mb-2">
                      Position
                    </label>
                    <Dropdown
                      id="position_id"
                      options={positionOptions}
                      value={watch("position_id")}
                      onChange={(e) => setValue("position_id", e.value)}
                      className="w-full"
                      placeholder="Select position"
                      loading={positionsLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="employment_type_id" className="block mb-2">
                      Employment Type
                    </label>
                    <Dropdown
                      id="employment_type_id"
                      options={employmentTypeOptions}
                      value={watch("employment_type_id")}
                      onChange={(e) => setValue("employment_type_id", e.value)}
                      className="w-full"
                      placeholder="Select employment type"
                      loading={employmentTypesLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="vendor_id" className="block mb-2">
                      Vendor
                    </label>
                    <Dropdown
                      id="vendor_id"
                      options={vendorOptions}
                      value={watch("vendor_id")}
                      onChange={(e) => setValue("vendor_id", e.value)}
                      className="w-full"
                      placeholder="Select vendor"
                      loading={vendorsLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="date_hired" className="block mb-2">
                      Date Hired
                    </label>
                    <Calendar
                      id="date_hired"
                      value={watch("date_hired") ? new Date(watch("date_hired") as string) : undefined}
                      onChange={(e) => setValue("date_hired", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="regularized_date" className="block mb-2">
                      Regularized Date
                    </label>
                    <Calendar
                      id="regularized_date"
                      value={watch("regularized_date") ? new Date(watch("regularized_date") as string) : undefined}
                      onChange={(e) => setValue("regularized_date", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="separated_date" className="block mb-2">
                      Separation Date
                    </label>
                    <Calendar
                      id="separated_date"
                      value={watch("separated_date") ? new Date(watch("separated_date") as string) : undefined}
                      onChange={(e) => setValue("separated_date", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="minimum_earner" className="block mb-2">
                      Minimum Earner
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="minimum_earner"
                        checked={watch("minimum_earner")}
                        onChange={(e) => setValue("minimum_earner", e.checked)}
                      />
                      <label htmlFor="minimum_earner" className="ml-2">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="contract_start" className="block mb-2">
                      Contract Start
                    </label>
                    <Calendar
                      id="contract_start"
                      value={watch("contract_start") ? new Date(watch("contract_start") as string) : undefined}
                      onChange={(e) => setValue("contract_start", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="contract_end" className="block mb-2">
                      Contract End
                    </label>
                    <Calendar
                      id="contract_end"
                      value={watch("contract_end") ? new Date(watch("contract_end") as string) : undefined}
                      onChange={(e) => setValue("contract_end", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Government IDs</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="ctc_valid_id" className="block mb-2">
                      CTC/Valid ID
                    </label>
                    <InputText
                      id="ctc_valid_id"
                      className={`w-full ${errors.ctc_valid_id ? "p-invalid" : ""}`}
                      {...register("ctc_valid_id", {
                        maxLength: {
                          value: 50,
                          message: "CTC/Valid ID must not exceed 50 characters"
                        }
                      })}
                    />
                    {errors.ctc_valid_id && (
                      <small className="p-error">{errors.ctc_valid_id.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="place_issued" className="block mb-2">
                      Place Issued
                    </label>
                    <InputText
                      id="place_issued"
                      className={`w-full ${errors.place_issued ? "p-invalid" : ""}`}
                      {...register("place_issued")}
                    />
                    {errors.place_issued && (
                      <small className="p-error">{errors.place_issued.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="ctc_date" className="block mb-2">
                      CTC Date
                    </label>
                    <Calendar
                      id="ctc_date"
                      value={watch("ctc_date") ? new Date(watch("ctc_date") as string) : undefined}
                      onChange={(e) => setValue("ctc_date", e.value?.toISOString().split('T')[0])}
                      dateFormat="yy-mm-dd"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="amount_paid" className="block mb-2">
                      Amount Paid
                    </label>
                    <InputNumber
                      id="amount_paid"
                      value={watch("amount_paid")}
                      onValueChange={(e) => setValue("amount_paid", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      min={0}
                      className={`w-full ${errors.amount_paid ? "p-invalid" : ""}`}
                    />
                    {errors.amount_paid && (
                      <small className="p-error">{errors.amount_paid.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="tax_id" className="block mb-2">
                      TAX ID
                    </label>
                    <InputText
                      id="tax_id"
                      className={`w-full ${errors.tax_id ? "p-invalid" : ""}`}
                      {...register("tax_id", {
                        maxLength: {
                          value: 20,
                          message: "Tax ID must not exceed 20 characters"
                        },
                        pattern: {
                          value: /^[\d\-]*$/,
                          message: "Tax ID must contain only digits and hyphens"
                        }
                      })}
                    />
                    {errors.tax_id && (
                      <small className="p-error">{errors.tax_id.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="tax_withheld" className="block mb-2">
                      TAX Withheld
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="tax_withheld"
                        checked={watch("tax_withheld")}
                        onChange={(e) => setValue("tax_withheld", e.checked)}
                      />
                      <label htmlFor="tax_withheld" className="ml-2">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="sss_gsis_no" className="block mb-2">
                      SSS/GSIS No.
                    </label>
                    <InputText
                      id="sss_gsis_no"
                      className={`w-full ${errors.sss_gsis_no ? "p-invalid" : ""}`}
                      {...register("sss_gsis_no", {
                        maxLength: {
                          value: 20,
                          message: "SSS/GSIS number must not exceed 20 characters"
                        },
                        pattern: {
                          value: /^[\d\-]*$/,
                          message: "SSS/GSIS number must contain only digits and hyphens"
                        }
                      })}
                    />
                    {errors.sss_gsis_no && (
                      <small className="p-error">{errors.sss_gsis_no.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="sss_gsis_withheld" className="block mb-2">
                      SSS/GSIS Withheld
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="sss_gsis_withheld"
                        checked={watch("sss_gsis_withheld")}
                        onChange={(e) => setValue("sss_gsis_withheld", e.checked)}
                      />
                      <label htmlFor="sss_gsis_withheld" className="ml-2">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="phic_id" className="block mb-2">
                      PHIC ID
                    </label>
                    <InputText
                      id="phic_id"
                      className={`w-full ${errors.phic_id ? "p-invalid" : ""}`}
                      {...register("phic_id", {
                        maxLength: {
                          value: 20,
                          message: "PHIC ID must not exceed 20 characters"
                        }
                      })}
                    />
                    {errors.phic_id && (
                      <small className="p-error">{errors.phic_id.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="phic_withheld" className="block mb-2">
                      PHIC Withheld
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="phic_withheld"
                        checked={watch("phic_withheld")}
                        onChange={(e) => setValue("phic_withheld", e.checked)}
                      />
                      <label htmlFor="phic_withheld" className="ml-2">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="hdmf_id" className="block mb-2">
                      HDMF ID
                    </label>
                    <InputText
                      id="hdmf_id"
                      className={`w-full ${errors.hdmf_id ? "p-invalid" : ""}`}
                      {...register("hdmf_id", {
                        maxLength: {
                          value: 20,
                          message: "HDMF ID must not exceed 20 characters"
                        }
                      })}
                    />
                    {errors.hdmf_id && (
                      <small className="p-error">{errors.hdmf_id.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="hdmf_withheld" className="block mb-2">
                      HDMF Withheld
                    </label>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId="hdmf_withheld"
                        checked={watch("hdmf_withheld")}
                        onChange={(e) => setValue("hdmf_withheld", e.checked)}
                      />
                      <label htmlFor="hdmf_withheld" className="ml-2">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="hdmf_account" className="block mb-2">
                      HDMF Account
                    </label>
                    <InputText
                      id="hdmf_account"
                      className={`w-full ${errors.hdmf_account ? "p-invalid" : ""}`}
                      {...register("hdmf_account")}
                    />
                    {errors.hdmf_account && (
                      <small className="p-error">{errors.hdmf_account.message}</small>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Compensation Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Compensation Details</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="rate_type_id" className="block mb-2">
                      Rate Type
                    </label>
                    <Dropdown
                      id="rate_type_id"
                      options={rateTypeOptions}
                      value={watch("rate_type_id")}
                      onChange={(e) => setValue("rate_type_id", e.value)}
                      className="w-full"
                      placeholder="Select rate type"
                      loading={rateTypesLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="pay_frequency_id" className="block mb-2">
                      Pay Frequency
                    </label>
                    <Dropdown
                      id="pay_frequency_id"
                      options={payFrequencyOptions}
                      value={watch("pay_frequency_id")}
                      onChange={(e) => setValue("pay_frequency_id", e.value)}
                      className="w-full"
                      placeholder="Select pay frequency"
                      loading={payFrequenciesLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="base_monthly_pay" className="block mb-2">
                      Base Monthly Pay
                    </label>
                    <InputNumber
                      id="base_monthly_pay"
                      value={watch("base_monthly_pay")}
                      onValueChange={(e) => setValue("base_monthly_pay", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      min={0}
                      className={`w-full ${errors.base_monthly_pay ? "p-invalid" : ""}`}
                    />
                    {errors.base_monthly_pay && (
                      <small className="p-error">{errors.base_monthly_pay.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="days_per_month" className="block mb-2">
                      Days per Month
                    </label>
                    <InputNumber
                      id="days_per_month"
                      value={watch("days_per_month")}
                      onValueChange={(e) => setValue("days_per_month", e.value || 0)}
                      className={`w-full ${errors.days_per_month ? "p-invalid" : ""}`}
                      minFractionDigits={1}
                      maxFractionDigits={2}
                      min={0}
                      max={31}
                    />
                    {errors.days_per_month && (
                      <small className="p-error">{errors.days_per_month.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="hours_per_day" className="block mb-2">
                      Hours per Day
                    </label>
                    <InputNumber
                      id="hours_per_day"
                      value={watch("hours_per_day")}
                      onValueChange={(e) => setValue("hours_per_day", e.value || 0)}
                      className={`w-full ${errors.hours_per_day ? "p-invalid" : ""}`}
                      minFractionDigits={1}
                      maxFractionDigits={2}
                      min={0}
                      max={24}
                    />
                    {errors.hours_per_day && (
                      <small className="p-error">{errors.hours_per_day.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="daily_rate" className="block mb-2">
                      Daily Rate
                    </label>
                    <InputNumber
                      id="daily_rate"
                      value={watch("daily_rate")}
                      onValueChange={(e) => setValue("daily_rate", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      min={0}
                      className={`w-full ${errors.daily_rate ? "p-invalid" : ""}`}
                    />
                    {errors.daily_rate && (
                      <small className="p-error">{errors.daily_rate.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="hourly_rate" className="block mb-2">
                      Hourly Rate
                    </label>
                    <InputNumber
                      id="hourly_rate"
                      value={watch("hourly_rate")}
                      onValueChange={(e) => setValue("hourly_rate", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      min={0}
                      className={`w-full ${errors.hourly_rate ? "p-invalid" : ""}`}
                    />
                    {errors.hourly_rate && (
                      <small className="p-error">{errors.hourly_rate.message}</small>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Allowances</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="cola" className="block mb-2">
                      Cost of Living Allowance
                    </label>
                    <InputNumber
                      id="cola"
                      value={watch("cola")}
                      onValueChange={(e) => setValue("cola", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.cola ? "p-invalid" : ""}`}
                      min={0}
                    />
                    {errors.cola && (
                      <small className="p-error">{errors.cola.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="representation_allowance" className="block mb-2">
                      Representation Allowance
                    </label>
                    <InputNumber
                      id="representation_allowance"
                      value={watch("representation_allowance")}
                      onValueChange={(e) => setValue("representation_allowance", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.representation_allowance ? "p-invalid" : ""}`}
                      min={0}
                    />
                    {errors.representation_allowance && (
                      <small className="p-error">{errors.representation_allowance.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="housing_allowance" className="block mb-2">
                      Housing Allowance
                    </label>
                    <InputNumber
                      id="housing_allowance"
                      value={watch("housing_allowance")}
                      onValueChange={(e) => setValue("housing_allowance", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.housing_allowance ? "p-invalid" : ""}`}
                      min={0}
                    />
                    {errors.housing_allowance && (
                      <small className="p-error">{errors.housing_allowance.message}</small>
                    )}
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="transportation_allowance" className="block mb-2">
                      Transportation Allowance
                    </label>
                    <InputNumber
                      id="transportation_allowance"
                      value={watch("transportation_allowance")}
                      onValueChange={(e) => setValue("transportation_allowance", e.value || 0)}
                      mode="currency"
                      currency="PHP"
                      locale="en-PH"
                      className={`w-full ${errors.transportation_allowance ? "p-invalid" : ""}`}
                      min={0}
                    />
                    {errors.transportation_allowance && (
                      <small className="p-error">{errors.transportation_allowance.message}</small>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12">
              <Card>
                <h3 className="text-lg font-semibold mb-3">Banking Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="bank_id" className="block mb-2">
                      Bank
                    </label>
                    <Dropdown
                      id="bank_id"
                      options={bankOptions}
                      value={watch("bank_id")}
                      onChange={(e) => setValue("bank_id", e.value)}
                      className="w-full"
                      placeholder="Select bank"
                      loading={banksLoading}
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="bank_account" className="block mb-2">
                      Bank Account
                    </label>
                    <InputText
                      id="bank_account"
                      className={`w-full ${errors.bank_account ? "p-invalid" : ""}`}
                      {...register("bank_account", {
                        pattern: {
                          value: /^[\d\-]*$/,
                          message: "Bank account must contain only digits and hyphens"
                        }
                      })}
                    />
                    {errors.bank_account && (
                      <small className="p-error">{errors.bank_account.message}</small>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </form>
  );
};
