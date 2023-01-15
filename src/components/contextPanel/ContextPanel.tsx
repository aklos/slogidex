import React, { useContext, useState } from "react";
import cx from "classnames";
import { ArrowBarRight, ArrowBarLeft } from "react-bootstrap-icons";
import Context from "../../context";
import Button from "../lib/Button";
import FormContext from "./FormContext";
import ScriptContext from "./ScriptContext";
import TableOfContents from "./TableOfContents";

interface Props {
  process: Types.Process;
  step?: Types.Step;
  instance?: Types.Instance;
}

export default function ContextPanel(props: Props) {
  const { process, step, instance } = props;
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
    if (!step || (instance && !instance.test)) {
      return <TableOfContents process={process} />;
    }

    switch (step.type) {
      case "form":
        return <FormContext step={step} update={updateStep} />;
      case "text":
        return <TableOfContents process={process} />;
      case "script":
        return (
          <ScriptContext process={process} step={step} update={updateStep} />
        );
    }
  };

  return (
    <div
      className={cx(
        "flex flex-shrink-0 z-10",
        "bg-stone-100 dark:bg-stone-900 text-sm"
      )}
    >
      <div className="w-8 2xl:hidden h-full relative border-r dark:border-black">
        <div className="absolute top-1/2 -translate-y-1/2">
          <Button
            Icon={showPanel ? ArrowBarRight : ArrowBarLeft}
            title="Show context panel"
            onClick={() => togglePanel(!showPanel)}
          />
        </div>
      </div>
      <div
        className={cx("w-80 2xl:block", {
          hidden: !showPanel,
          block: showPanel,
        })}
      >
        {contextMap()}
      </div>
    </div>
  );
}
