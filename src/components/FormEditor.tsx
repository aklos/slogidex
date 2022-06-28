import * as React from "react";
import cx from "classnames";
import Checkbox from "./lib/Checkbox";
import Select from "./lib/Select";
import Input from "./lib/Input";
import Button from "./lib/Button";
import { TrashIcon } from "./lib/icons";

export type InputType = "text" | "number" | "checkbox" | "select";
type InputOption = { label: string; value: string };

export type FormField = {
  id: string;
  name: string;
  label: string;
  inputType: InputType;
  value: string | boolean;
  options?: InputOption[];
};

export default function FormEditor(props: {
  value: FormField[];
  updateSection: (fields: FormField[]) => void;
}) {
  const { value, updateSection } = props;

  const updateField = React.useCallback(
    (fieldId: string, key: string, newValue: string) => {
      const fields = Array.from(value);
      const index = fields.findIndex((f) => f.id === fieldId);

      fields[index][key] = newValue;

      updateSection(fields);
    },
    [value]
  );

  const deleteField = React.useCallback(
    (fieldId: string) => {
      const fields = Array.from(value);
      const index = fields.findIndex((f) => f.id === fieldId);

      fields.splice(index, 1);

      updateSection(fields);
    },
    [value]
  );

  return (
    <div className="pl-2">
      {value.length ? (
        <form>
          {value.map((v, index) => (
            <div
              key={`field-${v.id}`}
              className={cx({
                "mb-4": value.length > 1 && index < value.length - 1,
              })}
            >
              <Field
                {...v}
                onChange={(key: string, value: string) =>
                  updateField(v.id, key, value)
                }
                deleteField={() => deleteField(v.id)}
              />
            </div>
          ))}
        </form>
      ) : (
        <span className="opacity-30">Add form fields...</span>
      )}
    </div>
  );
}

function Field(props) {
  const { name, label, value, inputType, onChange, deleteField } = props;
  const [hovering, toggleHovering] = React.useState(false);

  const inputMapper = (inputType: InputType) => {
    switch (inputType) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(_value) => onChange("value", _value)}
          />
        );
      case "number":
        return (
          <Input
            number
            value={value}
            onChange={(_value) => onChange("value", _value)}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            checked={value}
            onChange={(_checked) => onChange("value", _checked)}
          />
        );
      case "select":
        return (
          <Select
            value={value}
            onChange={(_value) => onChange("value", _value)}
          />
        );
    }
  };

  return (
    <div
      className="relative inline-block pr-8"
      onMouseOver={() => toggleHovering(true)}
      onMouseLeave={() => toggleHovering(false)}
    >
      {/* Main input */}
      {inputType !== "checkbox" ? (
        <div className="mb-1">
          <MinimalInput
            value={label}
            onChange={(_value) => onChange("label", _value)}
          />
        </div>
      ) : null}
      <label
        className={cx({ "w-80 flex items-center": inputType === "checkbox" })}
      >
        <div>{inputMapper(inputType)}</div>
        {inputType === "checkbox" ? (
          <div className="ml-2">
            <MinimalInput
              value={label}
              onChange={(_value) => onChange("label", _value)}
            />
          </div>
        ) : null}
      </label>
      {/* Tool bar */}
      <div
        className={cx(
          "absolute h-full border-l border-gray-400 pl-4 left-full top-1/2 transform -translate-y-1/2 focus-within:block",
          {
            hidden: !hovering,
          }
        )}
      >
        <div className="absolute top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm">
          <label className="flex items-center">
            <div className="mr-2 flex-shrink-0">Field name:</div>
            <div className="w-48">
              <Input
                value={name}
                onChange={(_value) => onChange("name", _value)}
              />
            </div>
          </label>
        </div>
      </div>
      {/* Delete button */}
      <div className={cx("absolute top-0 right-0 mr-2", { hidden: !hovering })}>
        <Button
          small
          className="text-red-500"
          icon={TrashIcon}
          onClick={deleteField}
        />
      </div>
    </div>
  );
}

function MinimalInput(props) {
  const { value, onChange } = props;

  return (
    <input
      type="text"
      className={cx("focus:outline-none", { "font-bold": !!value })}
      value={value}
      placeholder="Field label"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
