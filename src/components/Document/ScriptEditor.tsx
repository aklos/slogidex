import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

type Props = {
  value: any;
  updateSection: any;
};

export default function ScriptEditor(props: Props) {
  const { value, updateSection } = props;

  return (
    <div className="pl-2">
      <Editor
        value={value}
        onValueChange={(code) => updateSection(code)}
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
  );
}
