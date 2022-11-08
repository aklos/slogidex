import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import Button from "./lib/Button";
import Input from "./lib/Input";

type DocumentEntryType = Types.Document & { toggled: boolean };

export default function Inventory() {
  const [search, setSearch] = React.useState("");
  const [entries, setEntries] = React.useState<DocumentEntryType[]>([]);

  React.useEffect(() => {
    const testData: DocumentEntryType[] = [];

    for (let i = 0; i < 32; i++) {
      const instances = [];

      for (let j = 0; j < Math.floor(Math.random() * 5); j++) {
        instances.push({
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          stepValues: [],
        });
      }

      testData.push({
        id: uuidv4(),
        toggled: false,
        name: "",
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        instances,
      });
    }

    setEntries(testData);
  }, []);

  const toggleEntry = React.useCallback(
    (id: string) => {
      const _entries = Array.from(entries);
      const index = _entries.findIndex((e) => e.id === id);
      _entries[index].toggled = !_entries[index].toggled;
      setEntries(_entries);
    },
    [entries]
  );

  return (
    <div
      className={cx(
        "w-80 flex-grow flex-shrink-0",
        "dark:bg-gray-900 bg-gray-100 dark:border-black border-r text-sm"
      )}
    >
      <div className="px-4 pt-2 pb-4 dark:border-black border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold">Inventory</div>
        </div>
        <Input
          Icon={Icons.Search}
          value={search}
          onChange={(v) => setSearch(v)}
        />
      </div>
      <div className="px-4 flex justify-end dark:border-black border-b">
        <Button
          Icon={Icons.PlusSquare}
          title="Create new document"
          label="New"
        />
        {/* <Button Icon={Icons.Trash2} title="Delete" /> */}
        <Button
          Icon={Icons.ArrowsCollapse}
          title="Collapse all"
          label="Collapse"
        />
      </div>
      <ul
        style={{ height: "calc(100vh - 80px - 32px)" }}
        className="py-1 overflow-y-auto"
      >
        {entries.map((e) => (
          <DocumentEntry
            key={e.id}
            name={e.id}
            toggled={e.toggled}
            toggle={() => toggleEntry(e.id)}
            numSteps={e.steps.length}
            instances={e.instances}
          />
        ))}
      </ul>
    </div>
  );
}

function DocumentEntry(props: {
  name: string;
  numSteps: number;
  toggled: boolean;
  toggle: () => void;
  instances: Types.Instance[];
}) {
  const { name, numSteps, toggled, toggle, instances } = props;

  const numFinishedInstances = instances.reduce((accu, curr) => {
    if (curr.stepValues.length === numSteps) {
      return accu + 1;
    }

    return accu;
  }, 0);

  return (
    <>
      <li
        className={cx(
          "px-4 py-1.5 flex items-center justify-between",
          "whitespace-nowrap overflow-hidden text-ellipsis",
          "cursor-pointer hover:bg-gray-200 dark:hover:bg-black transition duration-200",
          "font-bold",
          {
            "bg-gray-200 dark:bg-black": toggled,
          }
        )}
        onClick={toggle}
      >
        <div className="flex items-center">
          <div className="text-xs mr-1">
            {toggled ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </div>
          <div className="text-xs">{name}</div>
        </div>
        <div
          className={cx("w-2 h-2 rounded-full", {
            "bg-blue-400": instances.length === 0,
            "bg-yellow-400":
              instances.length > 0 && numFinishedInstances < instances.length,
          })}
        ></div>
      </li>
      <ul
        className={cx(
          "bg-gray-200 dark:bg-black border-b-2 border-gray-100 dark:border-gray-900",
          {
            hidden: !toggled,
          }
        )}
      >
        {instances.map((i) => (
          <InstanceEntry
            key={i.id}
            id={i.id}
            progress={0}
            timestamp={i.createdAt}
          />
        ))}
      </ul>
    </>
  );
}

function InstanceEntry(props: {
  id: string;
  progress: number;
  timestamp: Date;
}) {
  const { id, progress, timestamp } = props;
  return (
    <li className="px-4 py-1.5 text-xs">
      <div className="flex justify-between">
        <span className="pl-4">
          {format(timestamp, "MMM dd yyyy, HH:mm:ss")}
        </span>
        <div
          className={cx("w-2 h-2 rounded-full", {
            "bg-gray-400 dark:bg-gray-700": progress === 0,
            "bg-yellow-400": progress < 1,
            "bg-green-400": progress === 1,
          })}
        ></div>
      </div>
    </li>
  );
}
