import React from "react";
import cx from "classnames";
import { Icon } from "react-bootstrap-icons";

interface Props {
  Icon?: Icon;
  type?: "number" | "text";
  label?: any;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function Input(props: Props) {
  const { Icon, type, label, value, placeholder, onChange } = props;

  return (
    <label className="block">
      {label ? <div className="mb-1">{label}</div> : null}
      <div className="relative">
        <input
          className={cx(
            "w-full px-2 py-0.5 border dark:border-stone-900",
            "focus:outline-none focus:border-gray-300 dark:focus:border-gray-800",
            "rounded-sm dark:bg-black/50",
            {
              "pl-7": !!Icon,
            }
          )}
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {Icon ? (
          <div
            className={cx(
              "absolute left-0 top-1/2 transform -translate-y-1/2 p-2",
              "opacity-40"
            )}
          >
            <Icon />
          </div>
        ) : null}
      </div>
    </label>
  );
}
