function dateTimeReviver(key: string, value: string) {
  if (typeof value === "string") {
    const a = Date.parse(value);
    if (a) {
      return a;
    }
  }

  return value;
}

const storage: Types.Storage = JSON.parse(
  window.localStorage.getItem("tbd") ||
    JSON.stringify({ blueprints: [], instances: [] }),
  dateTimeReviver
);

export default storage;
