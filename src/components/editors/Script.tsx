import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import Button from "../lib/Button";

export default function Script(props: {
  data: Types.Step;
  stepValue: Types.StepInstanceValue | null;
  update: (value: string) => void;
  run?: () => void;
  mappedArgs: string;
  selected: boolean;
  locked: boolean;
}) {
  const { data, stepValue, update, run, mappedArgs, selected, locked } = props;

  return (
    <div className="">
      <div className="flex bg-gray-100 dark:bg-stone-900">
        {data.required ? null : (
          <div className="border-r-2 border-transparent">
            {stepValue && stepValue.status !== "completed" ? (
              stepValue.status === "running" ? (
                <div className="px-1.5 py-1 animate-spin">
                  <Icons.DashCircleDotted />
                </div>
              ) : (
                <div className="px-1.5 py-1">
                  <Icons.XCircle />
                </div>
              )
            ) : (
              <Button Icon={Icons.CaretRightFill} onClick={run} />
            )}
          </div>
        )}
        <div
          className={cx("w-full p-2 bg-gray-100 dark:bg-stone-900", {
            "overflow-auto": selected,
            "overflow-hidden": !selected,
          })}
          style={{ maxHeight: "240px" }}
        >
          {mappedArgs ? (
            <div className="flex items-center text-mono text-sm mb-2 opacity-50">
              {mappedArgs.split("!").map((arg) => (
                <div key={`${data.id}_arg_${arg}`} className="mr-2">
                  {arg}
                </div>
              ))}
            </div>
          ) : null}
          <Editor
            value={data.content}
            onValueChange={(code) => update(code)}
            highlight={(code) => {
              if (code.startsWith("#!/bin/bash")) {
                return highlight(code, languages.bash, "bash");
              } else {
                return highlight(code, languages.python, "python");
              }
            }}
            readOnly={locked}
            tabSize={4}
            className="w-full font-mono text-sm"
            textareaClassName="focus:outline-none"
          />
        </div>
      </div>
      {stepValue?.output ? (
        <pre
          className={cx(
            "relative w-full p-2 text-xs bg-gray-200 dark:bg-black/50",
            {
              "overflow-auto": selected,
              "overflow-hidden": !selected,
            }
          )}
          style={{ maxHeight: "240px" }}
        >
          {stepValue.output}
        </pre>
      ) : null}
    </div>
  );
}
