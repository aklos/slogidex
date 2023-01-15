import React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Button from "../lib/Button";
import Input from "../lib/Input";
import Select from "../lib/Select";
import Editable from "../lib/Editable";
import Toggle from "../lib/Toggle";
import PathInput from "../lib/PathInput";
import {
  ArrowsExpand,
  CardList,
  Folder,
  Fonts,
  GripHorizontal,
  Hash,
  Plus,
  ToggleOff,
  Trash3,
} from "react-bootstrap-icons";

interface Props {
  step: Types.Step;
  update: (step: Types.Step) => void;
}

export default function FormContext(props: Props) {
  const { step, update } = props;
  const [fieldType, setFieldType] = React.useState<Types.FieldType>("text");
  const [toggledFields, setToggledFields] = React.useState<string[]>([]);
  const content = step.content as Types.FormContent;

  const updateContent = (value: Types.FormContent) => {
    step.content = value;
    update(step);
  };

  const addField = React.useCallback(
    (type: Types.FieldType) => {
      content.fields.push({
        id: uuidv4(),
        type,
        name: "",
        label: "",
        options: type === "select" ? [] : undefined,
      });

      updateContent(content);
    },
    [step]
  );

  const updateField = React.useCallback(
    (id: string, key: string, value: string | boolean) => {
      const fieldIndex = content.fields.findIndex((f) => f.id === id);
      (content.fields[fieldIndex] as any)[key] = value;
      updateContent(content);
    },
    [step]
  );

  const toggleField = React.useCallback(
    (id: string) => {
      const _toggledFields = Array.from(toggledFields);

      if (_toggledFields.includes(id)) {
        const index = _toggledFields.findIndex((f) => f === id);
        _toggledFields.splice(index, 1);
      } else {
        _toggledFields.push(id);
      }

      setToggledFields(_toggledFields);
    },
    [toggledFields, step]
  );

  const deleteField = React.useCallback(
    (id: string) => {
      const fieldIndex = content.fields.findIndex(
        (f: Types.FieldInterface) => f.id === id
      );
      content.fields.splice(fieldIndex, 1);
      updateContent(content);
    },
    [step]
  );

  const addOption = React.useCallback(
    (fieldId: string) => {
      const fieldIndex = content.fields.findIndex(
        (f: Types.FieldInterface) => f.id === fieldId
      );

      const field = content.fields[fieldIndex];

      if (!field || !field.options) {
        return;
      }

      field.options.push({
        value: "",
        label: "",
      });

      content.fields[fieldIndex] = field;

      updateContent(content);
    },
    [step]
  );

  const editOption = React.useCallback(
    (fieldId: string, index: number, key: string, value: string) => {
      const fieldIndex = content.fields.findIndex(
        (f: Types.FieldInterface) => f.id === fieldId
      );

      const field = content.fields[fieldIndex];

      if (!field || !field.options) {
        return;
      }

      (field.options[index] as any)[key] = value;
      content.fields[fieldIndex] = field;

      updateContent(content);
    },
    [step]
  );

  const deleteOption = React.useCallback(
    (fieldId: string, index: number) => {
      const fieldIndex = content.fields.findIndex(
        (f: Types.FieldInterface) => f.id === fieldId
      );

      const field = content.fields[fieldIndex];

      if (!field || !field.options) {
        return;
      }

      field.options.splice(index, 1);
      content.fields[fieldIndex] = field;

      updateContent(content);
    },
    [step]
  );

  return (
    <div className="max-h-screen flex flex-col">
      <div className="p-2 border-b border-gray-300 dark:border-black flex items-end">
        <div className="w-full">
          <Select
            label="Add a new form field"
            value={fieldType}
            onChange={(value: string) => setFieldType(value as Types.FieldType)}
            options={[
              { value: "text", label: "Text field" },
              { value: "number", label: "Number field" },
              { value: "file", label: "Path field" },
              { value: "check", label: "Toggle field" },
              { value: "select", label: "Select field" },
            ]}
          />
        </div>
        <div className="ml-2 flex-shrink-0">
          <Button
            Icon={Plus}
            label="Add"
            onClick={() => addField(fieldType)}
            title="Add new field"
          />
        </div>
      </div>
      <ul className="h-full overflow-auto">
        {content.fields.map((f) => (
          <li
            key={f.id}
            className="odd:bg-black/5 even:bg-black/10 dark:odd:bg-white/5 dark:even:bg-white/10 border-b dark:border-black"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="pl-2">
                  {f.type === "text" ? <Fonts /> : null}
                  {f.type === "number" ? <Hash /> : null}
                  {f.type === "file" ? <Folder /> : null}
                  {f.type === "check" ? <ToggleOff /> : null}
                  {f.type === "select" ? <CardList /> : null}
                </div>
                <Editable
                  placeholder="Field label"
                  onChange={(value: string) =>
                    updateField(f.id, "label", value === "<br>" ? "" : value)
                  }
                >
                  {f.label}
                </Editable>
              </div>
              <div className="grid grid-cols-1 text-xs pr-2">
                <Button
                  Icon={Trash3}
                  destructive
                  onClick={() => deleteField(f.id)}
                  title="Delete field"
                />
              </div>
            </div>
            <div className="flex justify-center border-t dark:border-black">
              <Button
                Icon={ArrowsExpand}
                onClick={() => toggleField(f.id)}
                title="Toggle field properties"
              />
            </div>
            <div
              className={cx("overflow-hidden transition-height duration-200", {
                "h-auto p-2": toggledFields.includes(f.id),
                "h-0 p-0": !toggledFields.includes(f.id),
              })}
            >
              <div className="mb-2">
                <Input
                  label="Name"
                  value={f.name || ""}
                  onChange={(value: string) => updateField(f.id, "name", value)}
                  placeholder="Identifier for scripts"
                />
              </div>
              {f.type !== "check" ? (
                <div className="mb-2">
                  <Input
                    label="Placeholder"
                    value={f.placeholder || ""}
                    onChange={(value: string) =>
                      updateField(f.id, "placeholder", value)
                    }
                    placeholder="Describe the input"
                  />
                </div>
              ) : null}
              <div className="mb-2">
                {f.type === "text" || f.type === "number" ? (
                  <Input
                    label="Default value"
                    type={f.type === "number" ? "number" : "text"}
                    value={(f.defaultValue as string) || ""}
                    onChange={(value: string) =>
                      updateField(f.id, "defaultValue", value)
                    }
                  />
                ) : null}
                {f.type === "check" ? (
                  <Toggle
                    value={(f.defaultValue as boolean) || false}
                    onChange={(value: boolean) =>
                      updateField(f.id, "defaultValue", value)
                    }
                    label="Checked by default"
                  />
                ) : null}
                {f.type === "select" ? (
                  <Select
                    label="Default value"
                    placeholder="---"
                    value={f.defaultValue as string}
                    onChange={(v) => updateField(f.id, "defaultValue", v)}
                    options={f.options || []}
                  />
                ) : null}
                {f.type === "file" ? (
                  <>
                    <Toggle
                      value={f.directory || false}
                      onChange={(value: boolean) =>
                        updateField(f.id, "directory", value)
                      }
                      label="Directory path?"
                    />
                    <PathInput
                      value={(f.defaultValue as string) || ""}
                      onChange={(value: string) =>
                        updateField(f.id, "defaultValue", value)
                      }
                      directory={f.directory}
                      label="Default path"
                    />
                  </>
                ) : null}
              </div>
              <div>
                {f.type === "select" ? (
                  <div>
                    <div className="font-bold mb-1">Options</div>
                    <div className="text-xs">
                      {f.options?.map((o, index) => (
                        <div
                          key={`${f.id}_opt_${index}`}
                          className="flex items-center dark:bg-stone-700 p-2 mb-2"
                        >
                          <div className="grid grid-cols-2 gap-2 mr-2">
                            <Input
                              value={o.value}
                              onChange={(v: string) =>
                                editOption(f.id, index, "value", v)
                              }
                              label="Value"
                            />
                            <Input
                              value={o.label}
                              onChange={(v: string) =>
                                editOption(f.id, index, "label", v)
                              }
                              label="Label"
                            />
                          </div>
                          <Button
                            Icon={Trash3}
                            destructive
                            onClick={() => deleteOption(f.id, index)}
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      Icon={Plus}
                      label="Add option"
                      title="Add a select option"
                      onClick={() => addOption(f.id)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
