import React from "react";

type Props = {
  value: string;
  options: { id: string; value: string; label: string }[];
  onChange: any;
};

export default function Select(props: Props) {
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
