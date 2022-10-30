import React from "react";
import cx from "classnames";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import Button from "../lib/Button";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import * as Icon from "react-bootstrap-icons";
import Selectable from "../lib/Selectable";

type Props = {
  stepId: string;
  value: string;
  args: Types.Field[];
  output: string;
  status: Types.StepStatus;
  fields: Types.Field[];
  editing: boolean;
  updateStep: (key: keyof Types.Step, value: any) => void;
};

export default function Script(props: Props) {
  const { stepId, value, args, output, status, fields, editing, updateStep } =
    props;

  const handleEvent = React.useCallback(
    (e: any) => {
      const message = JSON.parse(e.payload.message);

      if (message.output !== "__finished__") {
        updateStep(
          "output",
          output ? output + "\n" + message.output : message.output
        );

        if (message.error) {
          updateStep("status", "failed");
        }
      } else if (status !== "failed") {
        updateStep("status", "completed");
      }
    },
    [output]
  );

  React.useEffect(() => {
    let unlisten: any;

    (async () => {
      unlisten = await listen("script-output", handleEvent);
    })();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  // React.useEffect(() => {
  //   if (fields.length) {
  //     console.log(fields);
  //   }
  // }, [fields]);

  return (
    <div>
      {fields.length ? (
        <div className="mb-2 flex items-center justify-between">
          <div>
            {args.map((a) => {
              const field = fields.find((f) => f.id === a.id);

              if (!field) {
                return null;
              }

              return (
                <Selectable
                  key={a.id}
                  onClick={() =>
                    updateStep(
                      "args",
                      args.filter((_a) => _a.id !== a.id)
                    )
                  }
                >
                  <span className="mr-2 font-mono text-sm cursor-pointer">{`--${field.name}=${field.value}`}</span>
                </Selectable>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="relative">
        <div className="absolute transform -translate-x-full p-3">
          <Button
            Icon={status === "running" ? Icon.Asterisk : Icon.CaretRightSquare}
            className={cx("bg-transparent", {
              "animate-spin": status === "running",
            })}
            onClick={() => {
              updateStep("output", "");
              updateStep("status", "running");

              invoke("run_script", {
                invokeMessage: JSON.stringify({
                  id: stepId,
                  args: args.reduce((accu, curr) => {
                    const field = fields.find((f) => f.id === curr.id);

                    if (field) {
                      const arg = `--${field.name}=${field.value}`;
                      if (!accu) {
                        return arg;
                      }

                      return accu + "!" + arg;
                    } else {
                      return accu;
                    }
                  }, ""),
                  script: value,
                }),
              });
            }}
          />
        </div>
        <div
          className="p-3 bg-gray-50 w-full overflow-auto"
          style={{ maxHeight: "240px" }}
        >
          <Editor
            value={value}
            disabled={!editing}
            onValueChange={(code) => updateStep("value", code)}
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
      {output ? (
        <pre
          className="relative bg-gray-100 p-3 text-sm overflow-auto"
          style={{ maxHeight: "240px" }}
        >
          <div
            className="absolute top-0 right-0 p-3 cursor-pointer"
            onClick={() => {
              updateStep("output", "");
            }}
          >
            <Icon.X size={16} />
          </div>
          {output}
        </pre>
      ) : null}
    </div>
  );
}
