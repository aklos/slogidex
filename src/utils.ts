export function getArgString(
  process: Types.Process,
  step: Types.Step,
  instance?: Types.Instance
) {
  const stepIndex = process.steps.findIndex((s) => s.id === step.id);
  const args = (step.content as Types.ScriptContent).args || [];

  return Object.entries(
    process.steps.slice(0, stepIndex).reduce((accu, curr) => {
      if (curr.type !== "form") {
        return accu;
      }

      const content = curr.content as Types.FormContent;
      const state = (instance?.state[curr.id]?.data || {}) as Types.FieldStates;

      for (const arg of args) {
        const matchingField = content.fields.find((f) => f.name === arg);

        if (matchingField) {
          const value =
            state[matchingField.id] ||
            matchingField.defaultValue ||
            "undefined";
          accu[arg] = value;
        }
      }

      return accu;
    }, {} as { [key: string]: string | boolean })
  )
    .map(([key, value]) => `--${key}=${value}`)
    .join(" ");
}
