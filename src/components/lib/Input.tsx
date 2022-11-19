import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Button from "./Button";

interface Props {
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
  Icon?: Icons.Icon;
  label?: any;
  placeholder?: string;
}

export default function Input(props: Props) {
  const { value, onChange, Icon, type, label, placeholder } = props;

  return (
    <label className="w-full">
      {label ? <div className="mb-0.5 font-bold">{label}</div> : null}
      <div
        className={cx(
          "border rounded-sm",
          "pl-2 relative flex items-center",
          "bg-white dark:bg-black dark:border-black overflow-hidden"
        )}
      >
        {Icon && !value ? (
          <div className="mr-2">
            <Icon />
          </div>
        ) : null}
        <input
          className="w-full py-1 flex-grow focus:outline-none bg-inherit"
          type={type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {value ? (
          <div>
            <Button Icon={Icons.BackspaceFill} onClick={() => onChange("")} />
          </div>
        ) : null}
      </div>
    </label>
  );
}
