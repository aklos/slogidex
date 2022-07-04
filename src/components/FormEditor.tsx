import * as React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Checkbox from "./lib/Checkbox";
import Select from "./lib/Select";
import Input from "./lib/Input";
import Button from "./lib/Button";
import { PlusIcon, TrashIcon } from "./lib/icons";
import Modal from "./lib/Modal";

export type InputType = "text" | "number" | "checkbox" | "select";
type InputOption = { id: string; label: string; value: string };

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

  const addOption = React.useCallback(
    (fieldId: string, label: string, optionValue: string) => {
      const fields = Array.from(value);
      const index = fields.findIndex((f) => f.id === fieldId);
      const options = fields[index].options;

      if (options) {
        (fields[index].options as any).push({
          id: uuidv4(),
          label,
          value: optionValue,
        });
      } else {
        fields[index].options = [
          {
            id: uuidv4(),
            label,
            value: optionValue,
          },
        ];
      }

      updateSection(fields);
    },
    [value]
  );

  const updateOption = React.useCallback(
    (fieldId: string, optionId: string, key: string, optionValue: string) => {
      const fields = Array.from(value);
      const index = fields.findIndex((f) => f.id === fieldId);
      const optionIndex = fields[index].options?.findIndex(
        (opt) => opt.id === optionId
      );

      if (optionIndex !== undefined) {
        (fields[index].options as any)[optionIndex][key] = optionValue;
        updateSection(fields);
      }
    },
    [value]
  );

  const deleteOption = React.useCallback(
    (fieldId: string, optionId: string) => {
      const fields = Array.from(value);
      const index = fields.findIndex((f) => f.id === fieldId);
      const optionIndex = fields[index].options?.findIndex(
        (opt) => opt.id === optionId
      );

      if (optionIndex !== undefined) {
        fields[index].options?.splice(optionIndex, 1);
        updateSection(fields);
      }
    },
    [value]
  );

  return (
    <div className="pl-2">
      {value.length ? (
        <div>
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
                addOption={(label: string, optionValue: string) =>
                  addOption(v.id, label, optionValue)
                }
                updateOption={(
                  optionId: string,
                  key: string,
                  optionValue: string
                ) => updateOption(v.id, optionId, key, optionValue)}
                deleteOption={(optionId: string) =>
                  deleteOption(v.id, optionId)
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <span className="opacity-30">Add form fields...</span>
      )}
    </div>
  );
}

function Field(props) {
  const {
    name,
    label,
    value,
    options,
    inputType,
    onChange,
    deleteField,
    addOption,
    updateOption,
    deleteOption,
  } = props;
  const [hovering, toggleHovering] = React.useState(false);
  const [optionModal, toggleOptionModal] = React.useState(false);

  const inputMapper = () => {
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
            options={options}
          />
        );
    }
  };

  return (
    <div
      className="relative inline-block pr-12"
      onMouseOver={() => toggleHovering(true)}
      onMouseLeave={() => toggleHovering(false)}
    >
      {/* Main input */}
      {inputType !== "checkbox" ? (
        <div className="mb-1 relative">
          <MinimalInput
            value={label}
            onChange={(_value) => onChange("label", _value)}
          />
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-xs italic pointer-events-none">
            {name ? (
              <span className="opacity-30">Name: {name}</span>
            ) : (
              <span className="text-red-500">Not named!</span>
            )}
          </div>
        </div>
      ) : null}
      <label
        className={cx({
          "w-80 flex items-center": inputType === "checkbox",
        })}
      >
        <div className="w-80">{inputMapper()}</div>
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
          "absolute h-full border-l pl-4 left-full top-1/2 transform -translate-y-1/2 focus-within:block",
          {
            hidden: !hovering,
          }
        )}
      >
        <div className="absolute top-1/2 transform -translate-y-1/2 px-2 py-1">
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
          hint="Remove field"
          icon={TrashIcon}
          onClick={deleteField}
        />
      </div>
      {/* Add select option button */}
      {inputType === "select" ? (
        <>
          {optionModal ? (
            <Modal onClose={() => toggleOptionModal(false)}>
              {options?.map((opt) => (
                <div className="flex items-center mb-4">
                  <div className="mr-2">
                    <Input
                      placeholder="Label"
                      value={opt.label}
                      onChange={(_value) =>
                        updateOption(opt.id, "label", _value)
                      }
                    />
                  </div>
                  <div className="mr-2">
                    <Input
                      placeholder="Value"
                      value={opt.value}
                      onChange={(_value) =>
                        updateOption(opt.id, "value", _value)
                      }
                    />
                  </div>
                  <div>
                    <Button
                      icon={TrashIcon}
                      onClick={() => deleteOption(opt.id)}
                    />
                  </div>
                </div>
              ))}
              <div className="p-2 bg-gray-50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    const data = new FormData(e.target as any);

                    addOption(data.get("label"), data.get("value"));

                    (e.target as any).reset();
                  }}
                >
                  <div className="mb-2">Add new option</div>
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Input name="label" placeholder="Label" />
                    </div>
                    <div className="mr-2">
                      <Input name="value" placeholder="Value" />
                    </div>
                    <div>
                      <Button label="Add" type="submit" />
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
          ) : null}
          <div
            className={cx("absolute bottom-0 right-0 mr-2", {
              hidden: !hovering,
            })}
          >
            <Button
              small
              icon={PlusIcon}
              hint="Add select option"
              onClick={() => toggleOptionModal(true)}
            />
          </div>
        </>
      ) : null}
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
