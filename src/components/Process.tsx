import React, { useContext } from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "react-bootstrap-icons";
import Context from "../context";
import Step from "./Step";
import ContextPanel from "./ContextPanel";
import Editable from "./lib/Editable";
import Button from "./lib/Button";
import { useNavigate } from "react-router-dom";

interface Props {
  data: Types.Process;
  instance?: Types.Instance;
}

export default function Process(props: Props) {
  const { data, instance } = props;
  const context = useContext(Context);
  const navigate = useNavigate();

  const updateName = (value: string) => {
    data.name = value;
    context.updateProcess(data.id, data);
  };

  const updateStep = (id: string, stepData: Types.Step) => {
    const index = data.steps.findIndex((s) => s.id === id);
    data.steps[index] = stepData;
    context.updateProcess(data.id, data);
  };

  const updateInstance = (stepId: string, stepState: Types.StepState) => {
    let _instance = instance;

    if (!_instance) {
      const newInstance = context.addInstance(data.id, true);
      _instance = newInstance;
      navigate(`/${data.id}/${newInstance.id}`);
    }

    _instance.state[stepId] = stepState;
    context.updateInstance(data.id, _instance);
  };

  const moveStep = (id: string, dir: -1 | 1) => {
    const index = data.steps.findIndex((s) => s.id === id);
    const step = data.steps[index];

    data.steps.splice(index, 1);
    data.steps.splice(index + dir, 0, step);

    context.updateProcess(data.id, data);
  };

  const removeStep = (id: string) => {
    const index = data.steps.findIndex((s) => s.id === id);
    data.steps.splice(index, 1);
    context.updateProcess(data.id, data);
  };

  const selectedStep = data.steps.find((s) => s.id === context.selectedStepId);

  return (
    <div className="w-full relative flex">
      <div
        className={cx(
          "w-full h-[calc(100vh_-_32px)] p-2 2xl:mr-0 overflow-auto",
          {
            "mr-[32px]": !!context.selectedStepId,
          }
        )}
      >
        <section className="mb-8">
          <h1
            className={cx("text-3xl font-bold", {
              "text-orange-400": !!instance,
            })}
          >
            <Editable onChange={updateName}>{data.name}</Editable>
          </h1>
        </section>
        {data.steps.map((s, index) => (
          <div key={s.id}>
            <Step
              data={s}
              state={instance?.state[s.id]}
              update={(newStepData: Types.Step) =>
                updateStep(s.id, newStepData)
              }
              move={(dir: -1 | 1) => moveStep(s.id, dir)}
              remove={() => removeStep(s.id)}
              processId={data.id}
              instanceId={instance?.id}
              updateInstance={(newStateData: Types.StepState) =>
                updateInstance(s.id, newStateData)
              }
            />
            <Divider index={index} process={data} />
          </div>
        ))}
        <div className="h-16"></div>
      </div>
      {!instance && selectedStep ? (
        <ContextPanel process={data} step={selectedStep} />
      ) : null}
    </div>
  );
}

function Divider(props: { index: number; process: Types.Process }) {
  const { index, process } = props;
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
        "py-2.5 opacity-0 hover:opacity-100 transition duration-200"
      )}
    >
      <div className="relative border-b flex items-center justify-center">
        <div className="absolute bg-white dark:bg-stone-800 grid grid-cols-3 z-10">
          <Button Icon={Plus} label="Text" onClick={() => addStep("text")} />
          <Button Icon={Plus} label="Form" onClick={() => addStep("form")} />
          <Button
            Icon={Plus}
            label="Script"
            onClick={() => addStep("script")}
          />
        </div>
      </div>
    </div>
  );
}
