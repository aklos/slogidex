import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import Button from "../lib/Button";

export default function Script(props: {
  data: Types.Step;
  update: (value: string) => void;
}) {
  const { data, update } = props;

  return (
    <div className="flex dark:bg-stone-900">
      {data.required ? null : (
        <div className="border-r-2 border-transparent">
          <Button Icon={Icons.CaretRightFill} />
        </div>
      )}
      <div className="w-full p-2 bg-gray-100 dark:bg-stone-900">
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
  );
}
