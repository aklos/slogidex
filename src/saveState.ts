import { v4 as uuidv4 } from "uuid";

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
      documents: [
        {
          id: uuidv4().toString(),
          name: "Example document",
          steps: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          instances: [],
        },
      ],
    }),
  dateTimeReviver
);

export default saveState;
