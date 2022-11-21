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
  large?: boolean;
}

export default function Input(props: Props) {
  const { value, onChange, Icon, type, label, placeholder, large } = props;
  const [focused, setFocused] = React.useState(false);

  return (
    <label className="w-full">
      {label ? (
        <div
          className={cx("font-bold", {
            "mb-0.5": !large,
            "text-base mb-1": large,
          })}
        >
          {label}
        </div>
      ) : null}
      <div
        className={cx(
          "border rounded-sm",
          "pl-2 relative flex items-center",
          "transition duration-200",
          "bg-white dark:bg-black/40 overflow-hidden",
          {
            "border-gray-300 dark:border-black/20": !focused,
            "border-gray-400 dark:border-gray-400/30": focused,
          }
        )}
      >
        {Icon && !value ? (
          <div className="mr-2">
            <Icon />
          </div>
        ) : null}
        <input
          className={cx(
            "w-full flex-grow focus:outline-none bg-transparent placeholder:opacity-60 placeholder:italic",
            {
              "appearance-none": type === "number",
              "py-1": !large,
              "py-1.5 text-base": large,
            }
          )}
          type={type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value ? (
          <div>
            <Button Icon={Icons.BackspaceFill} onClick={() => onChange("")} />
          </div>
        ) : null}
        {type === "number" ? (
          <div className="flex items-center text-base">
            <Button
              Icon={Icons.Plus}
              onClick={() => onChange((+value + 1).toString())}
            />
            <Button
              Icon={Icons.Dash}
              onClick={() => onChange((+value - 1).toString())}
            />
          </div>
        ) : null}
      </div>
    </label>
  );
}
