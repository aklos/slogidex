import React from "react";
import cx from "classnames";

type Props = {
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function TextArea(props: Props) {
  const { placeholder, required, disabled, defaultValue, value, onChange } =
    props;

  return (
    <textarea
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className={cx(
        "px-3 py-1 w-full h-40 border border-gray-400 rounded-sm drop-shadow-sm resize-none",
        {
          "bg-gray-100": disabled,
        }
      )}
    />
  );
}
