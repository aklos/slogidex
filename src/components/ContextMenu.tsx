import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Context from "../context";
import Button from "./lib/Button";
import Input from "./lib/Input";
import Select from "./lib/Select";
import Editable from "./lib/Editable";
import Toggle from "./lib/Toggle";
import PathInput from "./lib/PathInput";

export default function ContextMenu() {
  const context = React.useContext(Context);
  const [width, setWidth] = React.useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateStep = React.useCallback(
    (content: string) => {
      const step = Object.assign({}, context.selectedStep);
      step.content = content;
      context.selectStep(step, context.selectedStepUpdate);
      if (context.selectedStepUpdate) {
        context.selectedStepUpdate(content);
      }
    },
    [context.selectedStep]
  );

  const updateArgs = React.useCallback(
    (args: string[]) => {
      const step = Object.assign({}, context.selectedStep);
      step.args = args;
      context.selectStep(step, context.selectedStepUpdate);
      if (context.selectedStepUpdate) {
        context.selectedStepUpdate(args);
      }
    },
    [context.selectedStep]
  );

  return (
    <div
      className={cx(
        "flex-grow flex-shrink-0",
        "dark:bg-stone-900 bg-stone-100 dark:border-black border-l text-sm",
        "transition-width duration-200",
        {
          "w-80": context.selectedStep || width >= 1366 + 320,
          "w-10": !context.selectedStep && width < 1366 + 320,
        }
      )}
    >
      {context.currentDocument?.locked ? null : (
        <>
          {context.selectedStep?.type === "form" &&
          context.selectedStepUpdate ? (
            <FormStepContext data={context.selectedStep} update={updateStep} />
          ) : null}
          {context.selectedStep?.type === "script" &&
          context.selectedStepUpdate ? (
            <ScriptStepContext
              data={context.selectedStep}
              update={updateArgs}
            />
          ) : null}
        </>
      )}
      {context.currentInstance || context.selectedStep?.type === "markdown" ? (
        <div>
          {context.currentDocument ? (
            <HeaderLinks steps={context.currentDocument?.steps} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HeaderLinks(props: { steps: Types.Step[] }) {
  const { steps } = props;
  return <ul></ul>;
}

function ScriptStepContext(props: {
  data: Types.Step;
  update: (args: string[]) => void;
}) {
  const { data, update } = props;
  const context = React.useContext(Context);
  const stepIndex = context.currentDocument?.steps.findIndex(
    (s) => s.id === data.id
  );

  if (!context.currentDocument || stepIndex === undefined) {
    return null;
  }

  const args = Array.from(context.currentDocument.steps[stepIndex]?.args || []);

  return (
    <div>
      {context.currentDocument.steps
        .slice(0, stepIndex)
        .filter((s) => s.type === "form")
        .map((s) => {
          const fields: Types.FieldInterface[] = JSON.parse(s.content || "[]");
          return (
            <div key={`fields_${s.id}`}>
              {fields
                .filter((f) => f.name)
                .map((f) => (
                  <Toggle
                    key={`field_${f.name}`}
                    value={args.includes(f.name)}
                    label={f.label || f.name}
                    onChange={(v) => {
                      if (v) {
                        args.push(f.name);
                      } else {
                        const index = args.findIndex((a) => a === f.name);
                        args.splice(index, 1);
                      }

                      update(args);
                    }}
                  />
                ))}
            </div>
          );
        })}
    </div>
  );
}

function FormStepContext(props: {
  data: Types.Step;
  update: (content: string) => void;
}) {
  const { data, update } = props;
  const [fieldType, setFieldType] = React.useState<Types.FieldType>("text");
  const [toggledFields, setToggledFields] = React.useState<string[]>([]);
  const fields = JSON.parse(data.content || "[]");

  const addField = React.useCallback(
    (type: Types.FieldType) => {
      fields.push({
        id: uuidv4(),
        type,
        name: "",
        label: "",
        options: type === "select" ? [] : undefined,
      });

      update(JSON.stringify(fields));
    },
    [data]
  );

  const updateField = React.useCallback(
    (id: string, key: string, value: string | boolean) => {
      const fieldIndex = fields.findIndex(
        (f: Types.FieldInterface) => f.id === id
      );
      fields[fieldIndex][key] = value;
      update(JSON.stringify(fields));
    },
    [data]
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
    [toggledFields, data]
  );

  const deleteField = React.useCallback(
    (id: string) => {
      const fieldIndex = fields.findIndex(
        (f: Types.FieldInterface) => f.id === id
      );
      fields.splice(fieldIndex, 1);
      update(JSON.stringify(fields));
    },
    [data]
  );

  const addOption = React.useCallback(
    (fieldId: string) => {
      const fieldIndex = fields.findIndex(
        (f: Types.FieldInterface) => f.id === fieldId
      );

      fields[fieldIndex].options.push({
        value: "",
        label: "",
      });

      update(JSON.stringify(fields));
    },
    [data]
  );

  const editOption = React.useCallback(
    (fieldId: string, index: number, key: string, value: string) => {
      const fieldIndex = fields.findIndex(
        (f: Types.FieldInterface) => f.id === fieldId
      );

      fields[fieldIndex].options[index][key] = value;

      update(JSON.stringify(fields));
    },
    [data]
  );

  const deleteOption = React.useCallback(
    (fieldId: string, index: number) => {
      const fieldIndex = fields.findIndex(
        (f: Types.FieldInterface) => f.id === fieldId
      );

      fields[fieldIndex].options.splice(index, 1);

      update(JSON.stringify(fields));
    },
    [data]
  );

  return (
    <div className="max-h-screen flex flex-col">
      <div className="p-4 border-b dark:border-gray-300/20 flex items-center">
        <div className="w-full">
          <Select
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
            Icon={Icons.Plus}
            label="Add"
            border
            onClick={() => addField(fieldType)}
          />
        </div>
      </div>
      <ul className="p-2 h-full overflow-auto">
        {fields.map((f: Types.FieldInterface) => (
          <li
            key={f.id}
            className="dark:odd:bg-stone-800 dark:even:bg-stone-800/50 mb-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="pl-2">
                  {f.type === "text" ? <Icons.Fonts /> : null}
                  {f.type === "number" ? <Icons.Hash /> : null}
                  {f.type === "file" ? <Icons.Folder /> : null}
                  {f.type === "check" ? <Icons.ToggleOff /> : null}
                  {f.type === "select" ? <Icons.CardList /> : null}
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
              <div className="grid grid-cols-1 text-xs">
                {/* <Button Icon={Icons.ArrowUp} />
                <Button Icon={Icons.ArrowDown} /> */}
                <Button
                  style="negative"
                  Icon={Icons.Trash3}
                  onClick={() => deleteField(f.id)}
                />
              </div>
            </div>
            <div
              className="mb-1 flex justify-center cursor-pointer"
              onClick={() => toggleField(f.id)}
            >
              <Icons.GripHorizontal />
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
                            Icon={Icons.Trash3}
                            onClick={() => deleteOption(f.id, index)}
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      Icon={Icons.Plus}
                      label="Add option"
                      border
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
