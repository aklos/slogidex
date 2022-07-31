import React from "react";
import Button from "../lib/Button";
import { v4 as uuidv4 } from "uuid";
import * as Icon from "react-bootstrap-icons";
import Modal from "../lib/Modal";
import Input from "../lib/Input";
import Selectable from "../lib/Selectable";
import Checkbox from "../lib/Checkbox";

type Props = {
  value: string;
  editing: boolean;
  updateStep: (key: keyof Types.Step, value: string) => void;
};

export default function Form(props: Props) {
  const { value, editing, updateStep } = props;
  const data = JSON.parse(value || "[]") as Types.Field[];

  const deleteField = React.useCallback(
    (id: string) => {
      const index = data.findIndex((f) => f.id === id);
      data.splice(index, 1);
      updateStep("value", JSON.stringify(data));
    },
    [value]
  );

  const updateField = React.useCallback(
    (id: string, key: keyof Types.Field, v: string) => {
      const index = data.findIndex((f) => f.id === id);
      (data[index] as any)[key] = v;
      updateStep("value", JSON.stringify(data));
    },
    [value]
  );

  return (
    <div className="px-8 py-4">
      <div className="mx-auto my-0 max-w-prose">
        {data.map((f: Types.Field) => (
          <Field
            key={f.id}
            {...f}
            editing={editing}
            updateField={(key: keyof Types.Field, value: string) =>
              updateField(f.id, key, value)
            }
            deleteField={() => deleteField(f.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Field(
  props: Types.Field & {
    editing: boolean;
    updateField: (key: keyof Types.Field, value: string) => void;
    deleteField: () => void;
  }
) {
  const { editing, type, label, value, name, updateField, deleteField } = props;

  return (
    <div className="mb-4">
      <label>
        <div className="mb-1 flex items-center justify-between">
          <div>
            {editing ? (
              <Selectable className="mr-4">
                <input
                  type="text"
                  placeholder="Field label"
                  value={label}
                  className="bg-transparent"
                  onChange={(e) => updateField("label", e.target.value)}
                />
              </Selectable>
            ) : (
              <span>{label}</span>
            )}
            {editing ? (
              <Selectable>
                <input
                  type="text"
                  placeholder="field_name"
                  value={name}
                  className="bg-transparent font-mono"
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Selectable>
            ) : null}
          </div>
          {editing ? (
            <div>
              <Button
                Icon={Icon.X}
                className="bg-transparent text-red-500"
                onClick={deleteField}
              />
            </div>
          ) : null}
        </div>
        {type === "text" ? (
          <Input value={value} onChange={(v) => updateField("value", v)} />
        ) : null}
        {type === "number" ? (
          <Input
            type="number"
            value={value}
            onChange={(v) => updateField("value", v)}
          />
        ) : null}
        {type === "check" ? (
          <Checkbox
            checked={!!value}
            onChange={() => updateField("value", value ? "" : "true")}
          />
        ) : null}
      </label>
    </div>
  );
}
