import React from "react";
import cx from "classnames";
import Markdown from "./Markdown";
import Script from "./Script";
import Button from "../lib/Button";
import Checkbox from "../lib/Checkbox";
import * as Icon from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import Form from "./Form";
import Modal from "../lib/Modal";

type Props = Types.Step & {
  editable: boolean;
  index?: number;
  fields: Types.Field[];
  updateStep: (key: keyof Types.Step, value: any) => void;
  deleteStep: () => void;
  moveStep: (direction: 1 | -1) => void;
};

export default function Step(props: Props) {
  const {
    id,
    type,
    value,
    index,
    name,
    output,
    status,
    editable,
    required,
    args,
    fields,
    updateStep,
    deleteStep,
    moveStep,
  } = props;
  const [focused, toggleFocused] = React.useState(false);
  const [modal, toggleModal] = React.useState(false);
  const containerRef = React.useRef(null);

  const toggleCheckbox = React.useCallback(() => {
    updateStep("status", status === "completed" ? "initial" : "completed");
  }, [status]);

  const closeModal = React.useCallback(() => {
    toggleModal(false);
  }, []);

  const addField = React.useCallback(
    (type: Types.FieldType) => {
      const data = JSON.parse(value);

      data.push({
        id: uuidv4(),
        type,
        value: "",
        label: "",
        name: "",
        options: [],
      });

      updateStep("value", JSON.stringify(data));
      toggleModal(false);
    },
    [value]
  );

  return (
    <li
      ref={containerRef}
      className={cx(
        "list-inside relative group bg-white border border-l-[2px] border-r-[3px] border-b-[3px] border-gray-300",
        {
          "border-l-green-500": status === "completed",
          "border-l-red-500": status === "failed",
          "focus-within:border-gray-400": editable,
        }
      )}
      onClick={(e) => (!focused ? toggleFocused(true) : null)}
      onFocus={(e) => toggleFocused(true)}
      onBlur={(e) => toggleFocused(false)}
    >
      {type === "script" && modal ? (
        <Modal onClose={closeModal}>
          {fields.map((f) => (
            <Button
              key={f.id}
              label={f.name}
              className="p-2 font-mono"
              onClick={() => {
                if (args) {
                  updateStep("args", args.concat([f]));
                }
                toggleModal(false);
              }}
            />
          ))}
        </Modal>
      ) : null}
      {type === "form" && modal ? (
        <Modal onClose={closeModal}>
          <Button
            Icon={Icon.InputCursorText}
            label="Text field"
            className="p-2"
            onClick={() => addField("text")}
          />
          <Button
            Icon={Icon.Icon123}
            label="Number field"
            className="p-2"
            onClick={() => addField("number")}
          />
          <Button
            Icon={Icon.Check2Square}
            label="Check box"
            className="p-2"
            onClick={() => addField("check")}
          />
        </Modal>
      ) : null}
      {/* Toolbar */}
      <div
        className={cx(
          "absolute z-10 -top-[1px] -right-[1px] hidden",
          "border border-gray-400 bg-white",
          {
            "group-hover:flex": editable,
          }
        )}
      >
        {type === "script" ? (
          <Button
            Icon={Icon.BracesAsterisk}
            className="p-1"
            onClick={() => toggleModal(true)}
          />
        ) : null}
        {type === "form" ? (
          <Button
            Icon={Icon.InputCursor}
            className="p-1"
            onClick={() => toggleModal(true)}
          />
        ) : null}
        <Button
          Icon={Icon.Clipboard2Check}
          className="p-1"
          onClick={() => updateStep("required", !required)}
        />
        <Button
          Icon={Icon.ArrowUp}
          className="p-1"
          onClick={() => moveStep(-1)}
        />
        <Button
          Icon={Icon.ArrowDown}
          className="p-1"
          onClick={() => moveStep(1)}
        />
        <Button Icon={Icon.Trash} className="p-1" onClick={deleteStep} />
      </div>
      {/* Editor & preview */}
      <div id={name} className="relative">
        {required ? (
          <div className="absolute p-3 transform -translate-x-full">
            <Checkbox
              checked={status === "completed"}
              onChange={toggleCheckbox}
            />
          </div>
        ) : null}
        <div className="prose border-b-2 max-w-none px-3 py-1">
          <h2>
            {editable ? (
              <input
                type="text"
                className="outline-none w-full"
                placeholder={required ? `Step #${index}` : "Unnamed section"}
                value={name}
                onChange={(e) => updateStep("name", e.target.value)}
              />
            ) : (
              name || `Step #${index}`
            )}
          </h2>
        </div>
        {type === "markdown" ? (
          <Markdown
            editing={editable && focused}
            value={value}
            updateStep={(key, v) => updateStep(key, v)}
          />
        ) : null}
        {type === "script" ? (
          <Script
            stepId={id}
            value={value}
            args={args || []}
            fields={fields}
            editing={editable}
            output={output || ""}
            status={status}
            updateStep={(key, v) => updateStep(key, v)}
          />
        ) : null}
        {type === "form" ? (
          <Form
            editing={editable}
            value={value}
            updateStep={(key, v) => updateStep(key, v)}
          />
        ) : null}
      </div>
    </li>
  );
}
