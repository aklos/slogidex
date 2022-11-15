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
          name: "User manual",
          steps: [
            {
              id: uuidv4(),
              type: "markdown",
              required: false,
              content: "",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          instances: [],
          locked: false,
        },
      ],
    }),
  dateTimeReviver
);

export default saveState;
