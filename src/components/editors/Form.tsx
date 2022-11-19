import React from "react";
import cx from "classnames";
import Input from "../lib/Input";
import Toggle from "../lib/Toggle";
import PathInput from "../lib/PathInput";
import Select from "../lib/Select";

export default function Form(props: {
  data: Types.Step;
  stepValue: Types.StepInstanceValue | null;
  update: (value: string) => void;
  updateValue: (fieldValue: Types.FieldValue) => void;
}) {
  const { data, stepValue, update, updateValue } = props;
  const fields: Types.FieldInterface[] = JSON.parse(data.content || "[]");

  const setFieldValue = React.useCallback(
    (id: string, value: string | boolean) => {
      // const _stepValue = Object.assign({}, stepValue);

      // const index = _stepValue.fieldValues?.findIndex((f) => f.id === id);

      // if (index === undefined || !_stepValue.fieldValues) {
      //   _stepValue.fieldValues = [
      //     {
      //       id,
      //       value,
      //     },
      //   ];
      // } else if (index === -1) {
      //   _stepValue.fieldValues.push({ id, value });
      // } else {
      //   _stepValue.fieldValues[index] = { id, value };
      // }

      updateValue({ id, value });
    },
    [stepValue]
  );

  return (
    <div className="p-2 max-w-prose">
      {fields.length ? (
        fields.map((f: Types.FieldInterface) => (
          <Field
            key={f.id}
            data={f}
            update={(v) => setFieldValue(f.id, v)}
            value={stepValue?.fieldValues?.find((_f) => _f.id === f.id) || null}
          />
        ))
      ) : (
        <div className={cx("text-[#aaa]")}>
          <div className="italic">Add form fields...</div>
        </div>
      )}
    </div>
  );
}

function Field(props: {
  data: Types.FieldInterface;
  value: Types.FieldValue | null;
  update: (value: string | boolean) => void;
}) {
  const { data, value, update } = props;

  return (
    <div className="mb-4 last:mb-0 text-sm">
      {data.type === "number" || data.type === "text" ? (
        <Input
          label={data.label || <em>Field label</em>}
          value={
            (value?.value as string) || (data.defaultValue as string) || ""
          }
          onChange={update}
          placeholder={data.placeholder}
        />
      ) : null}
      {data.type === "check" ? (
        <Toggle
          label={data.label || <em>Field label</em>}
          value={
            (value?.value as boolean) || (data.defaultValue as boolean) || false
          }
          onChange={update}
        />
      ) : null}
      {data.type === "file" ? (
        <PathInput
          label={data.label || <em>Field label</em>}
          value={
            (value?.value as string) || (data.defaultValue as string) || ""
          }
          onChange={update}
          directory={data.directory}
          placeholder={data.placeholder}
        />
      ) : null}
      {data.type === "select" ? (
        <Select
          label={data.label || <em>Field label</em>}
          value={
            (value?.value as string) || (data.defaultValue as string) || ""
          }
          onChange={update}
          placeholder={data.placeholder}
          options={data.options || []}
        />
      ) : null}
    </div>
  );
}
