import { v4 as uuidv4 } from "uuid";
import user_manual from "./user_manual.json";

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
  localStorage.getItem("autotool") ||
    JSON.stringify({
      documents: [user_manual],
    }),
  dateTimeReviver
);

export default saveState;
