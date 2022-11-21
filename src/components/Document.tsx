import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Editable from "./lib/Editable";
import Button from "./lib/Button";
import Step from "./Step";
import Context from "../context";
import { useNavigate } from "react-router-dom";
import { mapArgs } from "./App";
import { format } from "date-fns";

export default function Document(props: {
  data: Types.Document;
  instance: Types.Instance | null;
  updateDocument: (value: Types.Document) => void;
  updateInstance: (instanceId: string, value: Types.Instance) => void;
  deleteDocument: () => void;
  runScript: (stepId: string) => void;
}) {
  const {
    data,
    instance,
    updateDocument,
    updateInstance,
    deleteDocument,
    runScript,
  } = props;
  const navigate = useNavigate();
  const context = React.useContext(Context);

  React.useEffect(() => {
    return () => {
      context.selectDocument(null);
    };
  }, []);

  React.useEffect(() => {
    context.selectDocument(data);
  }, [data]);

  React.useEffect(() => {
    context.selectInstance(instance);
  }, [instance]);

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

  const updateStepArgs = React.useCallback(
    (stepId: string, args: string[]) => {
      const _data = Object.assign({}, data);
      const stepIndex = _data.steps.findIndex((s) => s.id === stepId);

      _data.steps[stepIndex].args = args;

      updateDocument(_data);
    },
    [data]
  );

  const moveStep = React.useCallback(
    (stepId: string, dir: -1 | 1) => {
      const _data = Object.assign({}, data);
      const stepIndex = _data.steps.findIndex((s) => s.id === stepId);
      const step = _data.steps[stepIndex];

      _data.steps.splice(stepIndex, 1);
      _data.steps.splice(stepIndex + dir, 0, step);

      updateDocument(_data);
    },
    [data]
  );

  const updateStepFieldValue = React.useCallback(
    (stepId: string, value: Types.FieldValue) => {
      const _instance = Object.assign(
        {
          id: uuidv4(),
          documentId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          values: [],
        } as Types.Instance,
        instance
      );

      const newInstance = !instance;

      const stepIndex = _instance.values.findIndex((s) => s.stepId === stepId);

      if (stepIndex === -1) {
        _instance.values.push({
          stepId,
          completed: false,
          fieldValues: [value],
        });
      } else {
        const fieldIndex = _instance.values[stepIndex].fieldValues?.findIndex(
          (f) => f.id === value.id
        );

        if (fieldIndex === undefined) {
          return;
        }

        if (fieldIndex === -1) {
          (_instance.values[stepIndex].fieldValues as any).push(value);
        } else {
          (_instance.values[stepIndex].fieldValues as any)[fieldIndex] = value;
        }
      }

      updateInstance(_instance.id, _instance);

      if (newInstance) {
        navigate(`/${data.id}/${_instance.id}`);
      }
    },
    [instance]
  );

  const updateStepCompletion = React.useCallback(
    (stepId: string, completed: boolean) => {
      const _instance = Object.assign(
        {
          id: uuidv4(),
          documentId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          values: [],
        } as Types.Instance,
        instance
      );

      const newInstance = !instance;

      const stepIndex = _instance.values.findIndex((s) => s.stepId === stepId);

      if (stepIndex === -1) {
        _instance.values.push({
          stepId,
          completed,
        });
      } else {
        _instance.values[stepIndex].completed = completed;
      }

      updateInstance(_instance.id, _instance);

      if (newInstance) {
        navigate(`/${data.id}/${_instance.id}`);
      }
    },
    [instance]
  );

  return (
    <div className="max-w-screen-xl mx-auto my-0 px-8 pb-16">
      <section className="h-16 border-b border-gray-400/20 mb-4 flex items-center">
        <div className="flex items-center w-full">
          <div
            className={cx("text-2xl mx-2", {
              "text-blue-400": !instance,
              "text-yellow-400": instance,
            })}
          >
            {instance ? (
              <Icons.LightningChargeFill />
            ) : (
              <Icons.FileEarmarkFill />
            )}
          </div>
          <h2 className="font-bold text-2xl dark:text-white flex items-center">
            {data.locked ? (
              <div className="p-2">{data.name}</div>
            ) : (
              <Editable onChange={(value) => changeName(value)}>
                {data.name}
              </Editable>
            )}
            {instance ? (
              <div className="ml-2">
                {format(instance.createdAt, "MMM dd yyyy, HH:mm:ss")}
              </div>
            ) : null}
          </h2>
        </div>
        <div className="flex items-center flex-shrink-0 text-sm">
          {/* <Button Icon={Icons.Clipboard2PlusFill} /> */}
          <Button
            Icon={data.locked ? Icons.LockFill : Icons.UnlockFill}
            onClick={toggleStepLocked}
            label={data.locked ? "Locked" : "Unlocked"}
            disabled={data.locked && !!instance}
            title="Toggle content editing"
          />
          {!instance ? (
            <Button
              style="negative"
              Icon={Icons.Trash3Fill}
              label="Delete"
              onClick={deleteDocument}
              title="Delete the process"
            />
          ) : null}
        </div>
      </section>
      {data.steps.length ? (
        data.steps.map((s, index) => {
          const stepValue = instance?.values.find((v) => v.stepId === s.id);
          const requiredSteps = data.steps
            .slice(0, index)
            .filter((_s) => _s.required);
          const allCompleted = requiredSteps.reduce((accu, curr) => {
            if (!accu) {
              return accu;
            }

            const instanceValue = instance?.values.find(
              (v) => v.stepId === curr.id
            );
            if (instanceValue?.completed) {
              return true;
            }

            return false;
          }, true);
          const allowRunScript = allCompleted;
          return (
            <div key={s.id}>
              <Step
                data={s}
                stepValue={stepValue || null}
                updateContent={(content: string) =>
                  updateStepContent(s.id, content)
                }
                updateArgs={(args: string[]) => updateStepArgs(s.id, args)}
                updateStepValue={(v) => updateStepFieldValue(s.id, v)}
                updateCompleted={(completed: boolean) =>
                  updateStepCompletion(s.id, completed)
                }
                toggleRequired={() => toggleStepRequired(s.id)}
                deleteStep={() => deleteStep(s.id)}
                mappedArgs={mapArgs(data, instance, s)}
                runScript={() => (allowRunScript ? runScript(s.id) : null)}
                frozen={!allowRunScript}
                locked={data.locked}
                moveStep={(dir: -1 | 1) => moveStep(s.id, dir)}
              />
              {/* {s.type === "script" && stepValue?.output ? (
                <pre className="p-2 text-sm dark:bg-black">
                  {stepValue.output}
                </pre>
              ) : null} */}
              <Divider
                addStep={(type) => addStep(s.id, type)}
                locked={data.locked}
              />
            </div>
          );
        })
      ) : (
        <Divider addStep={(type) => addStep("", type)} locked={data.locked} />
      )}
    </div>
  );
}

function Divider(props: {
  addStep: (type: Types.StepType) => void;
  locked: boolean;
}) {
  const { addStep, locked } = props;

  return (
    <div
      className={cx(
        "py-2 opacity-0 hover:opacity-100 transition duration-200",
        { "opacity-0 pointer-events-none": locked }
      )}
    >
      <div className="relative border-b flex items-center justify-center">
        <div className="absolute bg-white dark:bg-stone-800 grid grid-cols-3 z-10">
          <Button
            Icon={Icons.Plus}
            label="Text"
            onClick={() => addStep("markdown")}
          />
          <Button
            Icon={Icons.Plus}
            label="Form"
            onClick={() => addStep("form")}
          />
          <Button
            Icon={Icons.Plus}
            label="Script"
            onClick={() => addStep("script")}
          />
        </div>
      </div>
    </div>
  );
}
