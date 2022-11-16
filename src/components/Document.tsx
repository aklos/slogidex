import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Editable from "./lib/Editable";
import Button from "./lib/Button";
import Step from "./Step";

export default function Document(props: {
  data: Types.Document;
  instance: Types.Instance | null;
  updateDocument: (value: Types.Document) => void;
  runScript: (stepId: string) => void;
}) {
  const { data, instance, updateDocument, runScript } = props;

  const changeName = React.useCallback(
    (value: string) => {
      const _data = Object.assign({}, data);
      _data.name = value;
      updateDocument(_data);
    },
    [data]
  );

  const toggleStepLocked = React.useCallback(() => {
    const _data = Object.assign({}, data);
    _data.locked = !_data.locked;
    updateDocument(_data);
  }, [data]);

  const toggleStepRequired = React.useCallback(
    (stepId: string) => {
      const _data = Object.assign({}, data);
      const stepIndex = _data.steps.findIndex((s) => s.id === stepId);
      _data.steps[stepIndex].required = !_data.steps[stepIndex].required;
      updateDocument(_data);
    },
    [data]
  );

  const addStep = React.useCallback(
    (stepId: string, type: Types.StepType) => {
      const _data = Object.assign({}, data);

      const step: Types.Step = {
        id: uuidv4(),
        type,
        required: false,
        content: "",
      };

      if (stepId) {
        const stepIndex = _data.steps.findIndex((s) => s.id === stepId);
        _data.steps.splice(stepIndex + 1, 0, step);
      } else {
        _data.steps.push(step);
      }

      updateDocument(_data);
    },
    [data]
  );

  const deleteStep = React.useCallback(
    (stepId: string) => {
      const _data = Object.assign({}, data);
      const stepIndex = _data.steps.findIndex((s) => s.id === stepId);

      _data.steps.splice(stepIndex, 1);

      updateDocument(_data);
    },
    [data]
  );

  const updateStepContent = React.useCallback(
    (stepId: string, content: string) => {
      const _data = Object.assign({}, data);
      const stepIndex = _data.steps.findIndex((s) => s.id === stepId);

      _data.steps[stepIndex].content = content;

      updateDocument(_data);
    },
    [data]
  );

  return (
    <div className="max-w-screen-xl mx-auto my-0 px-4">
      <section className="px-2 h-16 border-b border-gray-400/20 mb-4 flex items-center">
        <div className="flex items-center w-full">
          <div
            className={cx("text-2xl mr-2", {
              "text-blue-400": true,
            })}
          >
            <Icons.FileEarmarkFill />
          </div>
          <h2 className="font-bold text-xl dark:text-white">
            <Editable onChange={(value) => changeName(value)}>
              {data.name}
            </Editable>
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-0 flex-shrink-0">
          <Button Icon={Icons.ArrowClockwise} />
          <Button Icon={Icons.Clipboard2PlusFill} />
          <Button
            Icon={data.locked ? Icons.LockFill : Icons.UnlockFill}
            onClick={toggleStepLocked}
          />
          <Button style="negative" Icon={Icons.Trash3Fill} />
        </div>
      </section>
      {data.steps.length ? (
        data.steps.map((s) => {
          const stepValue = instance?.values.find((v) => v.stepId === s.id);
          return (
            <div key={s.id}>
              <Step
                data={s}
                stepValue={stepValue || null}
                updateContent={(content: string) =>
                  updateStepContent(s.id, content)
                }
                toggleRequired={() => toggleStepRequired(s.id)}
                deleteStep={() => deleteStep(s.id)}
                runScript={() => runScript(s.id)}
              />
              {/* {s.type === "script" && stepValue?.output ? (
                <pre className="p-2 text-sm dark:bg-black">
                  {stepValue.output}
                </pre>
              ) : null} */}
              <Divider addStep={(type) => addStep(s.id, type)} />
            </div>
          );
        })
      ) : (
        <Divider addStep={(type) => addStep("", type)} />
      )}
    </div>
  );
}

function Divider(props: { addStep: (type: Types.StepType) => void }) {
  const { addStep } = props;

  return (
    <div className="py-4 opacity-0 hover:opacity-100 transition duration-200">
      <div className="relative border-b flex items-center justify-center">
        <div className="absolute bg-white dark:bg-stone-800 grid grid-cols-3">
          <Button Icon={Icons.Markdown} onClick={() => addStep("markdown")} />
          <Button Icon={Icons.UiChecks} onClick={() => addStep("form")} />
          <Button Icon={Icons.CodeSquare} onClick={() => addStep("script")} />
        </div>
      </div>
    </div>
  );
}
