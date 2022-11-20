import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Button from "./lib/Button";
import Markdown from "./editors/Markdown";
import Script from "./editors/Script";
import Form from "./editors/Form";
import Context from "../context";

export default function Step(props: {
  data: Types.Step;
  stepValue: Types.StepInstanceValue | null;
  updateContent: (content: string) => void;
  updateArgs: (args: string[]) => void;
  updateStepValue: (value: Types.FieldValue) => void;
  toggleRequired: () => void;
  deleteStep: () => void;
  runScript?: () => void;
}) {
  const {
    data,
    stepValue,
    updateContent,
    updateArgs,
    updateStepValue,
    toggleRequired,
    deleteStep,
    runScript,
  } = props;
  const context = React.useContext(Context);
  const ref = React.useRef(null);

  const handleWindowClick = (e: any) => {
    if (ref.current && !(ref.current as any).contains(e.target)) {
      if (context.selectedStep?.id === data.id) {
        context.selectStep(null, null);
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleWindowClick);
    return () => {
      document.removeEventListener("mousedown", handleWindowClick);
    };
  }, []);

  const editorComponentMap = React.useCallback(() => {
    switch (data.type) {
      case "form":
        return (
          <Form
            data={data}
            stepValue={stepValue}
            update={(value: string) => updateContent(value)}
            updateValue={(v) => updateStepValue(v)}
          />
        );
      case "markdown":
        return (
          <Markdown
            data={data}
            update={(value: string) => updateContent(value)}
          />
        );
      case "script":
        return (
          <Script
            data={data}
            stepValue={stepValue}
            update={(value: string) => updateContent(value)}
            run={runScript}
          />
        );
    }
  }, [data, stepValue, updateContent, runScript]);

  return (
    <div
      ref={ref}
      className={cx("group/step relative")}
      onClick={() =>
        context.selectStep(
          data,
          data.type === "script" ? updateArgs : updateContent
        )
      }
      onFocus={() =>
        context.selectStep(
          data,
          data.type === "script" ? updateArgs : updateContent
        )
      }
      // onBlur={() => context.selectStep(null, null)}
    >
      <div className="absolute z-10 right-0 text-xs bg-gray-400/20 flex opacity-0 group-hover/step:opacity-100 transition duration-200">
        <Button
          Icon={data.required ? Icons.CheckSquareFill : Icons.CheckSquare}
          onClick={toggleRequired}
        />
        <Button Icon={Icons.ArrowUp} />
        <Button Icon={Icons.ArrowDown} />
        <Button
          style="negative"
          Icon={Icons.Trash3Fill}
          onClick={() => deleteStep()}
        />
      </div>
      <div
        className={cx(
          "w-full transition duration-200 border border-transparent",
          {
            flex: data.required,
            "group-hover/step:border-gray-400/20":
              context.selectedStep?.id !== data.id,
            "border-gray-400/50": context.selectedStep?.id === data.id,
          }
        )}
      >
        {data.required ? (
          <div className="flex-shrink-0 border-r-2 border-gray-400/20">
            <Button
              Icon={
                data.type === "script" ? Icons.CaretRightSquare : Icons.Square
              }
            />
          </div>
        ) : null}
        <div
          className={cx("w-full", {
            "": data.required,
          })}
        >
          {editorComponentMap()}
        </div>
      </div>
    </div>
  );
}
