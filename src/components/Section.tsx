import * as React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import MarkdownEditor from "./MarkdownEditor";
import ScriptEditor from "./ScriptEditor";
import Button from "./lib/Button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckboxCompleteIcon,
  ChecklistIcon,
  ChecklistXIcon,
  CircleCheckIcon,
  CircleDashIcon,
  CirclePlayIcon,
  NumberIcon,
  PlusIcon,
  SelectIcon,
  TextIcon,
  TrashIcon,
} from "./lib/icons";
import Checkbox from "./lib/Checkbox";
import FormEditor, { InputType } from "./FormEditor";
import Modal from "./lib/Modal";

export default function Section(props) {
  const {
    id,
    type,
    step,
    value,
    status,
    output,
    args,
    fields,
    updateSection,
    deleteSection,
    moveSection,
    setSectionStatus,
    toggleStep,
    addArgument,
    deleteArgument,
    runScript,
  } = props;
  const [hovering, setHovering] = React.useState(false);
  const [argumentModal, toggleArgumentModal] = React.useState(false);

  const addFormField = React.useCallback(
    (inputType: InputType) => {
      const fields = Array.from(value);

      fields.push({
        id: uuidv4(),
        name: "",
        label: "",
        inputType,
        value: "",
      });

      updateSection(id, fields);
    },
    [value]
  );

  return (
    <li
      className="list-inside"
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative flex">
        {/* Tool bar */}
        <div
          className={cx(
            "absolute z-20 px-4 py-1 bg-white border border-gray-400 rounded-full drop-shadow-md",
            "top-0 right-0 transform -translate-y-1/4",
            {
              "opacity-0 pointer-events-none": !hovering,
            }
          )}
        >
          <div
            className={cx("grid gap-2", {
              "grid-cols-3": type === "script",
              "grid-cols-4": type === "markdown",
              "grid-cols-8": type === "form",
            })}
          >
            {type === "markdown" || type === "form" ? (
              <Button
                icon={step ? ChecklistXIcon : ChecklistIcon}
                hint="Toggle step"
                onClick={() => toggleStep(id)}
              />
            ) : null}
            {type === "form" ? (
              <>
                <Button
                  icon={TextIcon}
                  hint="Add text field"
                  onClick={() => addFormField("text")}
                />
                <Button
                  icon={NumberIcon}
                  hint="Add number field"
                  onClick={() => addFormField("number")}
                />
                <Button
                  icon={CheckboxCompleteIcon}
                  hint="Add checkbox field"
                  onClick={() => addFormField("checkbox")}
                />
                <Button
                  icon={SelectIcon}
                  hint="Add select field"
                  onClick={() => addFormField("select")}
                />
              </>
            ) : null}
            <Button
              icon={ArrowUpIcon}
              hint="Move section up"
              onClick={() => moveSection(id, -1)}
            />
            <Button
              icon={ArrowDownIcon}
              hint="Move section down"
              onClick={() => moveSection(id, 1)}
            />
            <Button
              className="text-red-500"
              icon={TrashIcon}
              hint="Delete section"
              onClick={() => {
                if (confirm("Are you sure you want to delete this section?")) {
                  deleteSection(id);
                }
              }}
            />
          </div>
        </div>
        {/* Edit & preview */}
        <div
          className={cx(
            "flex w-full border border-transparent focus-within:border-gray-400",
            {
              "bg-gray-100": type === "script",
            }
          )}
        >
          {/* Side bar */}
          <div
            className={cx(
              "flex-shrink-0 relative bg-white w-12 h-full border-r-2 border-transparent",
              {
                "border-green-600": status === "completed",
              }
            )}
          >
            {step ? (
              <div className="absolute py-4 top-0 left-1/2 transform -translate-x-1/2">
                {type === "markdown" || type === "form" ? (
                  <Checkbox
                    checked={status === "completed"}
                    onChange={() =>
                      setSectionStatus(
                        id,
                        status !== "completed" ? "completed" : "initial"
                      )
                    }
                  />
                ) : status === "in-progress" ? (
                  <div className="w-5 h-5 animate-spin">{CircleDashIcon}</div>
                ) : (
                  <Button
                    icon={
                      status === "completed" ? CircleCheckIcon : CirclePlayIcon
                    }
                    onClick={() => {
                      setSectionStatus(id, "in-progress");
                      runScript(id);
                    }}
                  />
                )}
              </div>
            ) : null}
          </div>
          {/* Editor */}
          <div
            style={{ width: `calc(100% - 48px)` }}
            className={cx({
              "": type === "script",
            })}
          >
            <div
              className={cx({ "max-h-96 overflow-auto": type === "script" })}
            >
              {type === "script" && (fields.length || args?.length) ? (
                <div className="pt-4 pb-2 pl-2 pr-4 border-b font-mono text-sm">
                  {argumentModal ? (
                    <Modal onClose={() => toggleArgumentModal(false)}>
                      <div className="w-80">
                        {fields.map((f) => (
                          <div
                            key={`arg-field-${f.id}`}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              addArgument(id, f.id);
                              toggleArgumentModal(false);
                            }}
                          >
                            {f.name}
                          </div>
                        ))}
                      </div>
                    </Modal>
                  ) : null}
                  {args?.length
                    ? args.map((a) => (
                        <div
                          key={`arg-${a.id}`}
                          className="inline-block mr-2 cursor-pointer hover:bg-gray-300"
                          onClick={() => deleteArgument(id, a.id)}
                        >
                          --{a.name}={a.value}
                        </div>
                      ))
                    : null}
                  {fields.length ? (
                    <div className="inline-block">
                      <Button
                        small
                        icon={PlusIcon}
                        label="Add arg"
                        onClick={() => toggleArgumentModal(true)}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="py-4 pr-4">
                {type === "markdown" ? (
                  <MarkdownEditor
                    value={value}
                    updateSection={(value) => updateSection(id, value)}
                  />
                ) : type === "script" ? (
                  <ScriptEditor
                    status={status}
                    value={value}
                    output={output}
                    updateSection={(value) => updateSection(id, value)}
                  />
                ) : (
                  <FormEditor
                    value={value}
                    updateSection={(value) => updateSection(id, value)}
                  />
                )}
              </div>
            </div>
            {/* Output */}
            {type === "script" && !!output ? (
              <div className="border-t px-2 py-4 bg-gray-200 max-h-72 overflow-auto flex flex-col-reverse">
                <pre className="font-mono text-sm">{output}</pre>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
