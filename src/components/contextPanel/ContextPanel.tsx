import React, { useContext, useState } from "react";
import cx from "classnames";
import { ArrowBarRight, ArrowBarLeft } from "react-bootstrap-icons";
import Context from "../../context";
import Button from "../lib/Button";
import FormContext from "./FormContext";
import ScriptContext from "./ScriptContext";

interface Props {
  process: Types.Process;
  step?: Types.Step;
}

export default function ContextPanel(props: Props) {
  const { process, step } = props;
  const context = useContext(Context);
  const [showPanel, togglePanel] = useState(false);

  const updateStep = (stepData: Types.Step) => {
    if (!step) {
      return;
    }
    const index = process.steps.findIndex((s) => s.id === step.id);
    process.steps[index] = stepData;
    context.updateProcess(process.id, process);
  };

  const contextMap = () => {
    if (!step) {
      return;
    }

    switch (step.type) {
      case "form":
        return <FormContext step={step} update={updateStep} />;
      case "text":
        return null;
      case "script":
        return (
          <ScriptContext process={process} step={step} update={updateStep} />
        );
    }
  };

  return (
    <div
      className={cx(
        "flex-shrink-0 border-l dark:border-black",
        "w-96 2xl:w-80 flex",
        "fixed 2xl:relative",
        "z-10 h-screen right-0 drop-shadow-xl",
        "2xl:right-auto 2xl:h-full 2xl:drop-shadow-none",
        "bg-stone-100 dark:bg-stone-900",
        {
          "-mr-96 transform -translate-x-[32px] 2xl:mr-0 2xl:translate-x-0":
            !showPanel,
        }
      )}
    >
      <div className="relative w-9 h-full 2xl:hidden border-r dark:border-black">
        <div className="absolute top-1/2 -translate-y-1/2">
          <Button
            Icon={showPanel ? ArrowBarRight : ArrowBarLeft}
            title="Show context panel"
            onClick={() => togglePanel(!showPanel)}
          />
        </div>
      </div>
      <div className="w-full">{contextMap()}</div>
    </div>
  );
}
