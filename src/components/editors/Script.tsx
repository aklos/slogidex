import React from "react";
import * as Icons from "react-bootstrap-icons";
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
}) {
  const { data, stepValue, update, run } = props;

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
          className="w-full p-2 bg-gray-100 dark:bg-stone-900 overflow-auto"
          style={{ maxHeight: "240px" }}
        >
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
            tabSize={4}
            className="w-full font-mono text-sm"
            textareaClassName="focus:outline-none"
          />
        </div>
      </div>
      {stepValue?.output ? (
        <pre
          className="w-full p-2 text-xs bg-gray-200 dark:bg-black/50 overflow-auto"
          style={{ maxHeight: "240px" }}
        >
          {stepValue.output}
        </pre>
      ) : null}
    </div>
  );
}
