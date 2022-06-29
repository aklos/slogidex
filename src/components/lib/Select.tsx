import * as React from "react";
import Button from "./Button";

export default function Select(props) {
  const { value, options, onChange } = props;
  return (
    <select
      className="px-2 py-1 border border-gray-400 rounded-md w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">---</option>
      {options.map((opt) => (
        <option key={`option-${opt.id}`} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
