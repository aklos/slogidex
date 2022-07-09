import React from "react";
import cx from "classnames";

type Props = {
  number?: boolean;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: any;
};

export default function Input(props: Props) {
  const { number, name, placeholder, value, onChange } = props;

  return (
    <input
      name={name}
      type={number ? "number" : "text"}
      className={cx(
        "px-2 py-1 border border-gray-400 bg-white dark:bg-gray-500 dark:border-0 rounded-md w-full"
      )}
      value={value !== undefined ? value : undefined}
      placeholder={placeholder}
      onChange={!!onChange ? (e) => onChange(e.target.value) : undefined}
    />
  );
}
