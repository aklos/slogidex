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
  Trash3,
} from "react-bootstrap-icons";
import Button from "./lib/Button";

interface Props {
  data: Types.Step;
  state?: Types.StepState;
  update: (data: Types.Step) => void;
  move: (dir: -1 | 1) => void;
  remove: () => void;
  processId: string;
  instanceId?: string;
  updateInstance: (data: Types.StepState) => void;
}

export default function Step(props: Props) {
  const {
    data,
    state,
    update,
    move,
    remove,
    processId,
    instanceId,
    updateInstance,
  } = props;
  const context = useContext(Context);

  const updateContent = (value: Types.StepContent) => {
    data.content = value;
    update(data);
  };

  const updateFieldValue = (fieldId: string, value: string | boolean) => {
    const _state = state || ({ completed: false, data: {} } as Types.StepState);
    (_state.data as Types.FieldStates)[fieldId] = value;
    updateInstance(_state);
  };

  const toggleRequired = () => {
    data.required = !data.required;
    update(data);
  };

  const widgetMap = () => {
    switch (data.type) {
      case "form":
        return (
          <FormWidget
            content={data.content as Types.FormContent}
            valueData={state?.data as Types.FieldStates}
            updateFieldValue={updateFieldValue}
          />
        );
      case "script":
        return (
          <ScriptWidget
            processId={processId}
            instanceId={instanceId}
            stepId={data.id}
            state={state}
            content={data.content as Types.ScriptContent}
            updateContent={updateContent}
          />
        );
      case "text":
        return (
          <TextWidget
            content={data.content as string}
            updateContent={updateContent}
          />
        );
    }
  };

  return (
    <section
      className={cx("relative p-2 border border-transparent group/step", {
        "border-gray-200/30": context.selectedStepId === data.id,
        "hover:border-gray-200/10": context.selectedStepId !== data.id,
      })}
      onClick={() => context._selectStep(data.id)}
    >
      <div className="absolute z-10 top-0 right-0 text-xs bg-gray-400/20 flex opacity-0 group-hover/step:opacity-100 transition duration-200">
        <Button
          Icon={data.required ? CheckSquareFill : CheckSquare}
          onClick={toggleRequired}
          title="Toggle checked requirement"
        />
        <Button Icon={ArrowUp} onClick={() => move(-1)} title="Move up" />
        <Button Icon={ArrowDown} onClick={() => move(1)} title="Move down" />
        <Button Icon={Trash3} onClick={() => remove()} title="Delete block" />
      </div>
      <div>{widgetMap()}</div>
    </section>
  );
}
