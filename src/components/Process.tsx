import React, { useContext, useRef } from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash3 } from "react-bootstrap-icons";
import Context from "../context";
import Step from "./Step";
import ContextPanel from "./contextPanel/ContextPanel";
import Editable from "./lib/Editable";
import Button from "./lib/Button";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

interface Props {
  process: Types.Process;
  instance?: Types.Instance;
}

export default function Process(props: Props) {
  const { process, instance } = props;
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(Context);
  const navigate = useNavigate();

  const updateName = (value: string) => {
    process.name = value;
    context.updateProcess(process.id, process);
  };

  const updateStep = (id: string, stepData: Types.Step) => {
    const index = process.steps.findIndex((s) => s.id === id);
    process.steps[index] = stepData;
    context.updateProcess(process.id, process);
  };

  const updateInstance = (stepId: string, stepState: Types.StepState) => {
    let _instance = instance;

    if (!_instance) {
      const newInstance = context.addInstance(process.id, true);
      _instance = newInstance;
      navigate(`/${process.id}/${newInstance.id}`);
    }

    _instance.state[stepId] = stepState;
    context.updateInstance(process.id, _instance);
  };

  const moveStep = (id: string, dir: -1 | 1) => {
    const index = process.steps.findIndex((s) => s.id === id);
    const step = process.steps[index];

    process.steps.splice(index, 1);
    process.steps.splice(index + dir, 0, step);

    context.updateProcess(process.id, process);
  };

  const removeStep = (id: string) => {
    const index = process.steps.findIndex((s) => s.id === id);
    process.steps.splice(index, 1);
    context.updateProcess(process.id, process);
  };

  const selectedStep = process.steps.find(
    (s) => s.id === context.selectedStepId
  );

  const editable = !instance || instance.test;

  return (
    <div className="w-full flex">
      <div
        id="process"
        ref={ref}
        className={cx("w-full h-[calc(100vh_-_32px)] flex overflow-auto")}
      >
        <div className="w-full p-2">
          <section className="pb-2 mx-8 border-b dark:border-black/30">
            <h1 className={cx("flex items-center justify-between")}>
              <div className="text-2xl font-bold">
                {editable ? (
                  <Editable onChange={updateName}>{process.name}</Editable>
                ) : (
                  <div className="p-2">{process.name}</div>
                )}
              </div>
              {editable ? (
                <Button
                  Icon={Trash3}
                  label="Delete"
                  title="Delete this process"
                  destructive
                  onClick={() => context.deleteProcess(process.id)}
                />
              ) : null}
            </h1>
          </section>
          <div>
            <Divider index={-1} process={process} editable={editable} />
          </div>
          {process.steps.map((s, index) => {
            const completable = process.steps
              .slice(0, index)
              .filter((_s) => _s.required)
              .reduce((accu, curr) => {
                if (instance?.state[curr.id]?.completed) {
                  return accu;
                }

                return false;
              }, true);

            return (
              <div id={s.id} key={s.id}>
                <Step
                  step={s}
                  state={instance?.state[s.id]}
                  update={(newStepData: Types.Step) =>
                    updateStep(s.id, newStepData)
                  }
                  move={(dir: -1 | 1) => moveStep(s.id, dir)}
                  remove={() => removeStep(s.id)}
                  processId={process.id}
                  instanceId={instance?.id}
                  updateInstance={(newStateData: Types.StepState) =>
                    updateInstance(s.id, newStateData)
                  }
                  editable={editable}
                  completable={completable}
                />
                <Divider index={index} process={process} editable={editable} />
              </div>
            );
          })}
          <div className="h-16"></div>
        </div>
        {instance && !instance.test ? (
          <ProgressBar process={process} instance={instance} />
        ) : null}
      </div>
      <ContextPanel process={process} step={selectedStep} instance={instance} />
    </div>
  );
}

function Divider(props: {
  index: number;
  process: Types.Process;
  editable: boolean;
}) {
  const { index, process, editable } = props;
  const context = useContext(Context);

  const addStep = (stepType: Types.StepType) => {
    const newStep = {
      id: uuidv4(),
      type: stepType,
      required: false,
      content:
        stepType === "text"
          ? ""
          : stepType === "form"
          ? { fields: [] }
          : { args: [], code: "" },
    };

    process.steps.splice(index + 1, 0, newStep);

    context.updateProcess(process.id, process);
  };

  return (
    <div
      className={cx(
        "py-2.5 opacity-0 hover:opacity-100 transition duration-200",
        {
          "opacity-0 pointer-events-none": !editable,
        }
      )}
    >
      <div className="relative border-b flex items-center justify-center">
        <div className="absolute bg-white dark:bg-stone-800 grid grid-cols-3 z-10">
          <Button
            Icon={Plus}
            label="Text"
            title="Add text"
            onClick={() => addStep("text")}
          />
          <Button
            Icon={Plus}
            label="Form"
            title="Add form"
            onClick={() => addStep("form")}
          />
          <Button
            Icon={Plus}
            label="Script"
            title="Add script"
            onClick={() => addStep("script")}
          />
        </div>
      </div>
    </div>
  );
}
