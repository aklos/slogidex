import React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Step from "./Step";
import Button from "../lib/Button";
import * as Icon from "react-bootstrap-icons";

type Props = {
  document: Types.BlueprintInstance;
  updateDocument: (document: Types.BlueprintInstance) => void;
};

export default function BlueprintPanel(props: Props) {
  const { document, updateDocument } = props;

  const updateStep = React.useCallback(
    (key: string, value: any, index: number) => {
      let _doc = Object.assign({}, document);
      (_doc.steps[index] as any)[key] = value;
      updateDocument(_doc);
    },
    [document]
  );

  const insertStep = React.useCallback(
    (index: number, type: Types.StepType) => {
      let _doc = Object.assign({}, document);

      _doc.steps.splice(index, 0, {
        id: uuidv4(),
        name: "",
        value: type === "script" ? "#!/bin/bash" : "",
        type,
        status: "initial",
        required: true,
      });

      updateDocument(_doc);
    },
    [document]
  );

  const deleteStep = React.useCallback(
    (index: number) => {
      let _doc = Object.assign({}, document);
      _doc.steps.splice(index, 1);
      updateDocument(_doc);
    },
    [document]
  );

  const moveStep = React.useCallback(
    (index: number, direction: 1 | -1) => {
      const _doc = Object.assign({}, document);
      const element = _doc.steps[index];

      _doc.steps.splice(index, 1);
      _doc.steps.splice(index + direction, 0, element);

      updateDocument(_doc);
    },
    [document]
  );

  const updateTitle = React.useCallback(
    (value: string) => {
      const _doc = Object.assign({}, document);
      _doc.name = value;
      updateDocument(_doc);
    },
    [document]
  );

  const editable = !document.blueprintId;

  return (
    <div className="flex flex-grow bg-gray-100">
      {document.steps.filter((s) => s.required).length ? (
        <div className="flex-shrink-0 w-80 prose p-2 border-r">
          <ul>
            {document.steps.map((s) => {
              const stepIndex =
                document.steps.findIndex((_s) => _s.id === s.id) + 1;

              return (
                <li key={`li_${s.id}`}>
                  <a href={`#${s.name}`} className="font-bold">
                    {s.name ||
                      (s.required ? `Step #${stepIndex}` : `Unnamed section`)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <div className="mx-auto my-4 px-16 w-full max-w-screen-2xl">
        <div
          className={cx(
            "prose max-w-none border border-transparent px-3 py-1",
            "focus-within:border-gray-400"
          )}
        >
          <h1 className={cx({ "mb-6": !editable })}>
            {editable ? (
              <input
                type="text"
                className="outline-none w-full bg-transparent"
                placeholder="Document title"
                value={document.name}
                onChange={(e) => updateTitle(e.target.value)}
              />
            ) : (
              document.name
            )}
          </h1>
        </div>
        <ul className="list-none">
          {editable ? (
            <Division insertStep={(type) => insertStep(0, type)} />
          ) : null}
          {document.steps.map((s, index) => {
            const fields = document.steps
              .slice(0, index)
              .filter((_s) => _s.type === "form")
              .reduce((accu, curr) => {
                const data: Types.Field[] = JSON.parse(
                  curr.value || "[]"
                ).filter((f: Types.Field) => f.name);

                return accu.concat(data);
              }, [] as Types.Field[]);

            const stepIndex = s.required
              ? document.steps
                  .filter((_s) => _s.required)
                  .findIndex((_s) => _s.id === s.id) + 1
              : undefined;

            return (
              <div key={s.id} className={cx({ "mb-6": !editable })}>
                <Step
                  {...s}
                  index={stepIndex}
                  editable={editable}
                  fields={fields}
                  updateStep={(key, value) => updateStep(key, value, index)}
                  deleteStep={() => deleteStep(index)}
                  moveStep={(direction) => moveStep(index, direction)}
                />
                {editable ? (
                  <Division
                    insertStep={(type) => insertStep(index + 1, type)}
                  />
                ) : null}
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Division(props: { insertStep: (type: Types.StepType) => void }) {
  const { insertStep } = props;

  return (
    <div className={cx("relative py-3 opacity-0 hover:opacity-100")}>
      <div className="absolute z-10 w-full border-b border-gray-400 top-1/2 transform -translate-y-1/2">
        <div className="absolute bg-white border border-gray-400 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex">
          <Button
            Icon={Icon.ChatSquareQuote}
            className="p-1"
            onClick={() => insertStep("markdown")}
          />
          <Button
            Icon={Icon.CodeSquare}
            className="p-1"
            onClick={() => insertStep("script")}
          />
          <Button
            Icon={Icon.PencilSquare}
            className="p-1"
            onClick={() => insertStep("form")}
          />
        </div>
      </div>
    </div>
  );
}
