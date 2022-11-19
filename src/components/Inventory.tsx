import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import { format } from "date-fns";
import Button from "./lib/Button";
import Input from "./lib/Input";
import { useLocation, useNavigate } from "react-router-dom";

type DocumentEntryType = Types.Document & { toggled: boolean };

export default function Inventory(props: {
  documents: Types.Document[];
  activeInstances: Types.Instance[];
}) {
  const { documents, activeInstances } = props;
  const [search, setSearch] = React.useState("");
  const [entries, setEntries] = React.useState<DocumentEntryType[]>(
    documents.map((d) => ({ ...d, toggled: false }))
  );

  // FIXME: JSON string dependency is a bad solution?
  React.useEffect(() => {
    setEntries(
      documents.map((d) => {
        const entry = entries.find((e) => e.id === d.id) || { toggled: false };
        return { ...d, toggled: entry.toggled };
      })
    );
  }, [JSON.stringify(documents)]);

  const toggleEntry = React.useCallback(
    (documentId: string, forceOpen: boolean = false) => {
      const _entries = Array.from(entries);
      const index = _entries.findIndex((e) => e.id === documentId);
      _entries[index].toggled = forceOpen ? true : !_entries[index].toggled;
      setEntries(_entries);
    },
    [entries]
  );

  return (
    <div
      className={cx(
        "w-80 flex-grow flex-shrink-0",
        "dark:bg-stone-900 bg-stone-100 dark:border-black border-r text-sm"
      )}
    >
      <div className="px-4 h-16 dark:border-black border-b flex items-center">
        <Input
          Icon={Icons.Search}
          value={search}
          placeholder="Search inventory"
          onChange={(v) => setSearch(v)}
        />
      </div>
      <div className="px-4 flex justify-end dark:border-black border-b">
        <Button
          Icon={Icons.PlusSquare}
          title="Create new document"
          label="New"
        />
        <Button
          Icon={Icons.ArrowsCollapse}
          title="Collapse all"
          label="Collapse"
        />
      </div>
      <ul
        style={{ height: "calc(100vh - 80px - 32px)" }}
        className="overflow-y-auto"
      >
        {entries.map((e) => (
          <DocumentEntry
            key={e.id}
            id={e.id}
            name={e.name}
            toggled={e.toggled}
            toggle={(force: boolean) => toggleEntry(e.id, force)}
            numSteps={e.steps.length}
            instances={e.instances.concat(
              activeInstances.filter((i) => i.documentId === e.id)
            )}
          />
        ))}
      </ul>
    </div>
  );
}

function DocumentEntry(props: {
  id: string;
  name: string;
  numSteps: number;
  toggled: boolean;
  toggle: (force: boolean) => void;
  instances: Types.Instance[];
}) {
  const { id, name, numSteps, toggled, toggle, instances } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname.includes(id);

  const numFinishedInstances = instances.reduce((accu, curr) => {
    if (curr.values.length === numSteps) {
      return accu + 1;
    }

    return accu;
  }, 0);

  return (
    <>
      <li
        className={cx(
          "px-4 py-1.5 flex items-center justify-between",
          "whitespace-nowrap",
          "transition duration-200",
          "font-bold",
          {
            "hover:bg-stone-200 dark:hover:bg-black":
              instances.length && !toggled,
            "bg-stone-200 dark:bg-black hover:bg-stone-200/50 dark:hover:bg-black/50":
              instances.length && toggled,
            "cursor-pointer": instances.length || !selected,
            "border border-blue-400/20": selected,
          }
        )}
        onClick={() => navigate(`${id}`)}
      >
        <div className="flex items-center overflow-hidden">
          <div
            className={cx("text-xs mr-1", {
              hidden: instances.length === 0,
            })}
            onClick={instances.length ? () => toggle(false) : () => null}
          >
            {toggled ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </div>
          <div className="text-xs overflow-hidden text-ellipsis">{name}</div>
        </div>
        <div
          className={cx("w-2 h-2 rounded-full flex-shrink-0", {
            "bg-blue-400": instances.length === 0,
            "bg-yellow-400":
              instances.length > 0 && numFinishedInstances < instances.length,
          })}
        ></div>
      </li>
      <ul
        className={cx("border-b-2 border-gray-100 dark:border-gray-900", {
          hidden: !toggled,
        })}
      >
        {instances
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
          .map((i) => (
            <InstanceEntry
              key={i.id}
              id={i.id}
              documentId={id}
              progress={0}
              timestamp={i.createdAt}
              toggleDocument={() => toggle(true)}
            />
          ))}
      </ul>
    </>
  );
}

function InstanceEntry(props: {
  id: string;
  documentId: string;
  progress: number;
  timestamp: Date;
  toggleDocument: () => void;
}) {
  const { id, documentId, progress, timestamp, toggleDocument } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname.includes(id);

  React.useEffect(() => {
    if (selected) {
      toggleDocument();
    }
  }, [selected]);

  return (
    <li
      className={cx(
        "px-4 py-1.5 text-xs",
        "bg-stone-200 dark:bg-black transition duration-200",
        "hover:bg-stone-200/50 dark:hover:bg-black/50",
        {
          "cursor-pointer": !selected,
          "border border-yellow-400/20": selected,
        }
      )}
      onClick={() => navigate(`${documentId}/${id}`)}
    >
      <div className="flex justify-between items-center">
        <span className="pl-4">
          {format(timestamp, "MMM dd yyyy, HH:mm:ss")}
        </span>
        <div
          className={cx("w-2 h-2 rounded-full", {
            "bg-stone-400 dark:bg-stone-700": progress === 0,
            "bg-yellow-400": progress < 1,
            "bg-green-400": progress === 1,
          })}
        ></div>
      </div>
    </li>
  );
}
