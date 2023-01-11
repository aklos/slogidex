import React, { useContext } from "react";
import cx from "classnames";
import Context from "../context";
import FormWidget from "./widgets/FormWidget";
import ScriptWidget from "./widgets/ScriptWidget";
import TextWidget from "./widgets/TextWidget";
import {
  ArrowDown,
  ArrowUp,
  CheckSquare,
  CheckSquareFill,
  Square,
  Trash3,
} from "react-bootstrap-icons";
import Button from "./lib/Button";

interface Props {
  step: Types.Step;
  state?: Types.StepState;
  update: (step: Types.Step) => void;
  move: (dir: -1 | 1) => void;
  remove: () => void;
  processId: string;
  instanceId?: string;
  updateInstance: (stepState: Types.StepState) => void;
  editable: boolean;
  completable: boolean;
}

export default function Step(props: Props) {
  const {
    step,
    state,
    update,
    move,
    remove,
    processId,
    instanceId,
    updateInstance,
    editable,
    completable,
  } = props;
  const context = useContext(Context);

  const updateContent = (value: Types.StepContent) => {
    step.content = value;
    update(step);
  };

  const updateFieldValue = (fieldId: string, value: string | boolean) => {
    const _state = state || ({ completed: false, data: {} } as Types.StepState);
    (_state.data as Types.FieldStates)[fieldId] = value;
    updateInstance(_state);
  };

  const toggleRequired = () => {
    step.required = !step.required;
    update(step);
  };

  const toggleCompleted = () => {
    const _state = state || ({ completed: false } as Types.StepState);
    _state.completed = !_state.completed;
    updateInstance(_state);
  };

  const widgetMap = () => {
    switch (step.type) {
      case "form":
        return (
          <FormWidget
            content={step.content as Types.FormContent}
            valueData={state?.data as Types.FieldStates}
            updateFieldValue={updateFieldValue}
          />
        );
      case "script":
        return (
          <ScriptWidget
            processId={processId}
            instanceId={instanceId}
            stepId={step.id}
            state={state}
            content={step.content as Types.ScriptContent}
            updateContent={updateContent}
            editable={editable}
            completable={completable}
          />
        );
      case "text":
        return (
          <TextWidget
            content={step.content as string}
            updateContent={updateContent}
            editable={editable}
          />
        );
    }
  };

  return (
    <section
      className={cx("relative border border-transparent group/step", {
        "border-gray-400/50 dark:border-gray-200/30":
          context.selectedStepId === step.id && editable,
        "hover:border-gray-200 dark:hover:border-gray-200/10":
          context.selectedStepId !== step.id && editable,
      })}
      onClick={() => context.selectStep(step.id)}
    >
      <div
        className={cx(
          "absolute z-10 top-0 right-0 text-xs bg-gray-400/20 flex opacity-0 transition duration-200",
          {
            "pointer-events-none": !editable,
            "group-hover/step:opacity-100": editable,
          }
        )}
      >
        <Button
          Icon={step.required ? CheckSquareFill : CheckSquare}
          onClick={toggleRequired}
          title="Toggle checked requirement"
        />
        <Button Icon={ArrowUp} onClick={() => move(-1)} title="Move up" />
        <Button Icon={ArrowDown} onClick={() => move(1)} title="Move down" />
        <Button Icon={Trash3} onClick={() => remove()} title="Delete block" />
      </div>
      <div className="flex">
        {step.required ? (
          <div
            className={cx("flex-shrink-0 border-r", {
              "border-gray-400/40": !state?.completed,
              "border-lime-500 dark:border-lime-400": state?.completed,
            })}
          >
            <Button
              Icon={state?.completed ? CheckSquareFill : Square}
              positive={state?.completed}
              title="Complete this step"
              onClick={toggleCompleted}
              disabled={!completable}
            />
          </div>
        ) : null}
        <div className="w-full">{widgetMap()}</div>
      </div>
    </section>
  );
}
