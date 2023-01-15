import React from "react";
import Toggle from "../lib/Toggle";

interface Props {
  process: Types.Process;
  step: Types.Step;
  update: (step: Types.Step) => void;
}

export default function ScriptContext(props: Props) {
  const { process, step, update } = props;
  const content = step.content as Types.ScriptContent;
  const stepIndex = process.steps.findIndex((s) => s.id === step.id);

  const fields = process.steps
    .slice(0, stepIndex)
    .filter((s) => s.type === "form")
    .map((s) => {
      const fields = (s.content as Types.FormContent).fields;
      return (
        <div key={`fields_${s.id}`}>
          {fields
            .filter((f) => f.name)
            .map((f) => (
              <div key={`field_${f.name}`} className="mb-2">
                <Toggle
                  value={content.args?.includes(f.name)}
                  label={f.label || f.name}
                  onChange={(v) => {
                    if (v) {
                      content.args.push(f.name);
                    } else {
                      const index = content.args.findIndex((a) => a === f.name);
                      content.args.splice(index, 1);
                    }

                    step.content = content;

                    update(step);
                  }}
                />
              </div>
            ))}
        </div>
      );
    });

  return (
    <div className="p-2">
      <div className="font-bold mb-2">Script argument fields</div>
      {fields.length ? (
        fields
      ) : (
        <div className="italic opacity-50">No fields available.</div>
      )}
    </div>
  );
}
