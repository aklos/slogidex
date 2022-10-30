import React from "react";
import cx from "classnames";

type Props = {
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export default function Input(props: Props) {
  const {
    type,
    placeholder,
    required,
    disabled,
    defaultValue,
    value,
    className,
    onChange,
  } = props;

  return (
    <input
      type={type || "text"}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      defaultValue={defaultValue}
      value={value}
      onInput={
        type === "number"
          ? (e) => {
              let v = (e.target as any).value as string;
              v = v.replace(/[^0-9\.]/g, "");
              (e.target as any).value = v;
            }
          : undefined
      }
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className={cx(
        "px-3 py-1 w-full rounded-sm drop-shadow-sm",
        "dark:bg-black",
        className,
        {
          "bg-gray-100": disabled,
        }
      )}
    />
  );
}
