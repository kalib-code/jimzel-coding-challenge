import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";

interface FormFieldProps {
  type: "text" | "textarea" | "dropdown" | "date" | "number" | "checkbox" | "radio";
  label: string;
  name: string;
  error?: any;
  register: any;
  setValue?: any;
  rules?: any;
  options?: { label: string; value: any }[];
  defaultValue?: any;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  rows?: number;
  min?: number;
  max?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  name,
  error,
  register,
  setValue,
  rules = {},
  options = [],
  defaultValue,
  placeholder,
  disabled = false,
  onChange,
  rows = 5,
  min,
  max,
}) => {
  const handleDropdownChange = (e: { value: any }) => {
    setValue?.(name, e.value);
    onChange?.(e);
  };

  const handleCalendarChange = (e: { value: any }) => {
    setValue?.(name, e.value);
    onChange?.(e);
  };

  const handleNumberChange = (e: { value: any }) => {
    setValue?.(name, e.value);
    onChange?.(e);
  };

  const handleCheckboxChange = (e: { checked: boolean }) => {
    setValue?.(name, e.checked);
    onChange?.(e);
  };

  const handleRadioChange = (e: { value: any }) => {
    setValue?.(name, e.value);
    onChange?.(e);
  };

  const renderField = () => {
    switch (type) {
      case "text":
        return (
          <InputText
            id={name}
            defaultValue={defaultValue}
            className={classNames({ "p-invalid": error })}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name, rules)}
          />
        );
      case "textarea":
        return (
          <InputTextarea
            id={name}
            rows={rows}
            defaultValue={defaultValue}
            className={classNames({ "p-invalid": error })}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name, rules)}
          />
        );
      case "dropdown":
        return (
          <Dropdown
            id={name}
            options={options}
            defaultValue={defaultValue}
            className={classNames({ "p-invalid": error })}
            placeholder={placeholder || "Select an option"}
            disabled={disabled}
            onChange={handleDropdownChange}
            {...register(name, rules)}
          />
        );
      case "date":
        return (
          <Calendar
            id={name}
            defaultValue={defaultValue}
            className={classNames({ "p-invalid": error })}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleCalendarChange}
            {...register(name, rules)}
          />
        );
      case "number":
        return (
          <InputNumber
            id={name}
            defaultValue={defaultValue}
            className={classNames({ "p-invalid": error })}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            onChange={handleNumberChange}
            {...register(name, rules)}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            id={name}
            checked={defaultValue}
            onChange={handleCheckboxChange}
            disabled={disabled}
            {...register(name, rules)}
          />
        );
      case "radio":
        return options.map((option) => (
          <div key={option.value} className="field-radiobutton mb-2">
            <RadioButton
              id={`${name}_${option.value}`}
              name={name}
              value={option.value}
              onChange={handleRadioChange}
              checked={defaultValue === option.value}
              disabled={disabled}
              {...register(name, rules)}
            />
            <label htmlFor={`${name}_${option.value}`} className="ml-2">
              {option.label}
            </label>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="field mb-4">
      <label htmlFor={name} className="font-bold mb-2 block">
        {label}
      </label>
      {renderField()}
      {error && <small className="p-error block mt-1">{error.message}</small>}
    </div>
  );
};