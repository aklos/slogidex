import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";

export default function Toggle(props: {
  value: boolean;
  onChange: (v: boolean) => void;
  label?: any;
  large?: boolean;
}) {
  const { value, onChange, label, large } = props;
  return (
    <label
      className={cx("flex items-center px-2 rounded-sm cursor-pointer", {
        "py-1": !large,
        "py-1.5 text-base": large,
        "border-gray-300 dark:border-gray-400/30": !value,
        "bg-black/10 dark:bg-white/10": value,
      })}
    >
      <input
        className="hidden"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="mr-2">
        {value ? <Icons.CheckSquareFill /> : <Icons.Square />}
      </div>
      <div className="font-bold">{label}</div>
    </label>
  );
}
