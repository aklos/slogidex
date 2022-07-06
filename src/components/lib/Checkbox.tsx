import React from "react";
import { CheckboxCompleteIcon, CheckboxIcon } from "./icons";

type Props = {
  label?: string;
  checked?: boolean;
  onChange?: any;
};

export default function Checkbox(props: Props) {
  const { label, checked, onChange } = props;

  return (
    <label className="flex items-center cursor-pointer">
      <div className="w-5 h-5">
        {checked ? CheckboxCompleteIcon : CheckboxIcon}
      </div>
      <input
        className="hidden"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {!!label ? <span className="ml-2">{label}</span> : null}
    </label>
  );
}
