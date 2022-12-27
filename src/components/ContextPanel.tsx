import React, { useContext, useState } from "react";
import cx from "classnames";
import { ArrowBarRight, ArrowBarLeft } from "react-bootstrap-icons";
import Context from "../context";
import Button from "./lib/Button";
import FormContext from "./FormContext";
import ScriptContext from "./ScriptContext";

interface Props {
  process: Types.Process;
  step: Types.Step;
}

export default function ContextPanel(props: Props) {
  const { process, step } = props;
  const context = useContext(Context);
  const [showPanel, togglePanel] = useState(false);

  const updateStep = (stepData: Types.Step) => {
    const index = process.steps.findIndex((s) => s.id === step.id);
    process.steps[index] = stepData;
    context.updateProcess(process.id, process);
  };

  const contextMap = () => {
    switch (step.type) {
      case "form":
        return <FormContext data={step} update={updateStep} />;
      case "text":
        return null;
      case "script":
        return (
          <ScriptContext process={process} data={step} update={updateStep} />
        );
    }
  };

  return (
    <div
      className={cx(
        "w-80 flex-shrink-0 border-l dark:border-black",
        "flex",
        "fixed z-10 h-[calc(100vh_-_32px)] right-0 drop-shadow-xl",
        "2xl:relative 2xl:right-auto 2xl:h-full 2xl:drop-shadow-none",
        "bg-stone-100 dark:bg-stone-900",
        {
          "-mr-80 transform -translate-x-[32px] 2xl:mr-0 2xl:translate-x-0":
            !showPanel,
        }
      )}
    >
      <div className="relative h-full 2xl:hidden">
        <div className="absolute top-1/2 -translate-y-1/2">
          <Button
            Icon={showPanel ? ArrowBarRight : ArrowBarLeft}
            onClick={() => togglePanel(!showPanel)}
          />
        </div>
      </div>
      <div className="w-full">{contextMap()}</div>
    </div>
  );
}
