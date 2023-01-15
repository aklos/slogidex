import React, { useContext } from "react";
import cx from "classnames";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-solarizedlight.css";
import Button from "../lib/Button";
import { DashCircle, Play, PlayCircle, PlayFill } from "react-bootstrap-icons";
import Context from "../../context";
import { useNavigate } from "react-router-dom";
import { getArgString } from "../../utils";

interface Props {
  processId: string;
  instanceId?: string;
  stepId: string;
  state?: Types.StepState;
  content: Types.ScriptContent;
  updateContent: (value: Types.ScriptContent) => void;
  editable: boolean;
  completable: boolean;
}

export default function ScriptWidget(props: Props) {
  const {
    processId,
    instanceId,
    stepId,
    state,
    content,
    updateContent,
    editable,
    completable,
  } = props;
  const context = useContext(Context);
  const navigate = useNavigate();

  const run = () => {
    let _instanceId = instanceId;

    if (!_instanceId) {
      const instance = context.addInstance(processId, true);
      _instanceId = instance.id;
      navigate(`/${processId}/${_instanceId}`);
    }

    context.runScript(processId, _instanceId, stepId);
  };

  const status =
    context.invokedScripts.find((x) => x.stepId === stepId)?.status ||
    "initial";

  const process = context.processes.find((p) => p.id === processId);
  const instance = process?.instances.find((i) => i.id === instanceId);
  const step = process?.steps.find((s) => s.id === stepId);
  const args = process && step ? getArgString(process, step, instance) : "";

  return (
    <div className="bg-stone-200/70 dark:bg-stone-900">
      <div className="flex">
        <div className="text-lg">
          {["initial", "completed", "failed"].includes(status) ? (
            <Button
              Icon={PlayCircle}
              title="Run the script"
              onClick={run}
              disabled={!completable}
            />
          ) : (
            <div className="p-2">
              <DashCircle className="animate-spin" />
            </div>
          )}
        </div>
        <div className="p-2 relative w-full">
          {args ? (
            <div className="font-mono text-sm mb-1 opacity-50">
              <span>[{args}]</span>
            </div>
          ) : null}
          <Editor
            className="w-full font-mono text-sm"
            value={content.code}
            onValueChange={(code) => {
              content.code = code;
              updateContent(content);
            }}
            highlight={(code) => {
              if (code.startsWith("#!/bin/bash")) {
                return highlight(code, languages.bash, "bash");
              } else {
                return highlight(code, languages.python, "python");
              }
            }}
            tabSize={4}
            readOnly={!editable}
          />
        </div>
      </div>
      {state?.data ? (
        <pre
          className={cx(
            "p-2 text-xs bg-stone-300 dark:bg-black/50 max-h-[250px]",
            {
              "overflow-hidden": context.selectedStepId !== stepId,
              "overflow-auto": context.selectedStepId === stepId,
            }
          )}
        >
          <code>{state.data as string}</code>
        </pre>
      ) : null}
    </div>
  );
}
