import React from "react";
import * as Icons from "react-bootstrap-icons";

export default function Toggle(props: {
  value: boolean;
  onChange: (v: boolean) => void;
  label?: any;
}) {
  const { value, onChange, label } = props;
  return (
    <label className="flex items-center px-2 py-1 rounded-sm border-gray-300/20">
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
