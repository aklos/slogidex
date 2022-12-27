import React from "react";
import Input from "../lib/Input";
import Toggle from "../lib/Toggle";
import PathInput from "../lib/PathInput";
import Select from "../lib/Select";

interface Props {
  content: Types.FormContent;
  valueData?: Types.FieldStates;
  updateFieldValue: (fieldId: string, value: string | boolean) => void;
}

export default function FormWidget(props: Props) {
  const { content, valueData, updateFieldValue } = props;

  return (
    <div className="max-w-prose">
      {content.fields.length ? (
        content.fields.map((f: Types.FieldInterface) => (
          <Field
            key={f.id}
            data={f}
            value={valueData ? valueData[f.id] : undefined}
            update={(value: string | boolean) => {
              updateFieldValue(f.id, value);
            }}
          />
        ))
      ) : (
        <div className="italic">Add form fields...</div>
      )}
    </div>
  );
}

function Field(props: {
  data: Types.FieldInterface;
  value?: boolean | string;
  update: (value: string | boolean) => void;
}) {
  const { data, value, update } = props;

  return (
    <div className="mb-4 last:mb-0 text-sm">
      {data.type === "number" || data.type === "text" ? (
        <Input
          label={data.label || <em>Field label</em>}
          type={data.type}
          value={(value as string) || (data.defaultValue as string) || ""}
          onChange={update}
          placeholder={data.placeholder}
        />
      ) : null}
      {data.type === "check" ? (
        <Toggle
          label={data.label || <em>Field label</em>}
          value={(value as boolean) || (data.defaultValue as boolean) || false}
          onChange={update}
          large
        />
      ) : null}
      {data.type === "file" ? (
        <PathInput
          label={data.label || <em>Field label</em>}
          value={(value as string) || (data.defaultValue as string) || ""}
          onChange={update}
          directory={data.directory}
          placeholder={data.placeholder}
          large
        />
      ) : null}
      {data.type === "select" ? (
        <Select
          label={data.label || <em>Field label</em>}
          value={(value as string) || (data.defaultValue as string) || ""}
          onChange={update}
          placeholder={data.placeholder}
          options={data.options || []}
          large
        />
      ) : null}
    </div>
  );
}
