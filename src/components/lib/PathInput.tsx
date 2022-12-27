import React from "react";
import { open } from "@tauri-apps/api/dialog";
import * as Icons from "react-bootstrap-icons";
import Button from "./Button";
import Input from "./Input";

export default function PathInput(props: {
  value: string;
  onChange: (v: string) => void;
  label?: any;
  directory?: boolean;
  placeholder?: string;
  large?: boolean;
}) {
  const { value, onChange, label, placeholder, directory, large } = props;

  return (
    <div className="flex items-end">
      <div className="w-full mr-2">
        <Input
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
        />
      </div>
      <div className="flex-shrink-0 mb-[1px]">
        <Button
          Icon={Icons.Folder}
          label="Browse"
          onClick={async () => {
            const filepath = await open({ directory });
            onChange(filepath as string);
          }}
        />
      </div>
    </div>
  );
}
