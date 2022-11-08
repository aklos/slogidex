function dateTimeReviver(key: string, value: string) {
  if (typeof value === "string") {
    const a = Date.parse(value);
    if (a) {
      return a;
    }
  }

  return value;
}

const saveState: Types.SaveState = JSON.parse(
  localStorage.getItem("autotool") || JSON.stringify({ documents: [] }),
  dateTimeReviver
);

export default saveState;
