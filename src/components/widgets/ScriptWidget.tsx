import React, { useContext } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-solarizedlight.css";
import Button from "../lib/Button";
import { Play } from "react-bootstrap-icons";
import Context from "../../context";
import { useNavigate } from "react-router-dom";

interface Props {
  processId: string;
  instanceId?: string;
  stepId: string;
  state?: Types.StepState;
  content: Types.ScriptContent;
  updateContent: (value: Types.ScriptContent) => void;
}

export default function ScriptWidget(props: Props) {
  const { processId, instanceId, stepId, state, content, updateContent } =
    props;
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

  // const status =
  //   context.invokedScripts.find((x) => x.stepId === stepId)?.status ||
  //   "initial";

  return (
    <div className="bg-stone-200 dark:bg-stone-900">
      <div className="flex">
        <div className="">
          <Button Icon={Play} onClick={run} />
        </div>
        <div className="p-2">
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
          />
        </div>
      </div>
      {state ? (
        <pre className="p-2 text-xs bg-stone-300 dark:bg-black/50">
          <code>{state.data as string}</code>
        </pre>
      ) : null}
    </div>
  );
}
