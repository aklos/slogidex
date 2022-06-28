import * as React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

export default function ScriptEditor(props) {
  const { value, updateSection } = props;

  return (
    <div className="pl-2">
      <Editor
        value={value}
        onValueChange={(code) => updateSection(code)}
        highlight={(code) => {
          if (code.startsWith("#!/bin/bash")) {
            return highlight(code, languages.bash);
          } else {
            return highlight(code, languages.python);
          }
        }}
        tabSize={4}
        className="w-full font-mono text-sm"
        textareaClassName="focus:outline-none"
      />
    </div>
  );
}
